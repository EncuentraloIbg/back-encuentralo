import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuarios'
import hash from '@adonisjs/core/services/hash'
import PasswordReset from '#models/password_reset'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import crypto from 'node:crypto'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const { correo, password } = request.only(['correo', 'password'])

    try {
      const user = await Usuario.query()
        .where('correo', correo)
        .preload('rol') // <--- CARGA la relación aquí
        .first()

      if (!user) {
        return response.unauthorized({ message: 'Correo o contraseña inválidos' })
      }

      const cleanPassword = typeof password === 'string' ? password.trim() : ''
      const isPasswordValid = await hash.verify(user.password, cleanPassword)

      if (!isPasswordValid) {
        return response.unauthorized({ message: 'Correo o contraseña inválidos' })
      }

      const token = await Usuario.accessTokens.create(user)

      // Usamos serialize para enviar también el rol
      const userData = user.serialize()

      userData.profilePictureUrl = user.foto_perfil

      console.log('User data:', userData)

      return {
        type: 'bearer',
        token: token,
        user: userData, // Ahora incluye role: { id, nombre, ... }
      }
    } catch (error) {
      console.error('Error en login:', error)
      return response.internalServerError({ message: 'Error interno del servidor' })
    }
  }

  public async forgotPassword({ request, response }: HttpContext) {
    const correo = request.input('correo')
    console.log('>>> LLEGÓ petición a forgotPassword, correo:', correo)

    // Verifica que el usuario exista
    const user = await Usuario.findBy('correo', correo)
    console.log('>>> Usuario encontrado:', user ? user.id : 'no existe')
    if (!user) {
      return response.badRequest({ message: 'El correo no está registrado.' })
    }

    // Generar un token único
    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })

    // Elimina tokens anteriores (opcional pero recomendado)
    await PasswordReset.query().where('correo', correo).delete()

    // Guardar nuevo token
    await PasswordReset.create({
      correo: correo,
      token,
      expiresAt,
    })

    // Enviar correo con enlace
    await mail.send((message) => {
      const enlace = `http://localhost:5173/new-password/${token}`

      message.to(correo).from('criferdel10@gmail.com', 'TuApp').subject('Restablece tu contraseña')
        .html(`
          <h2>Hola,</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <a href="${enlace}" style="display:inline-block; margin-top:1rem; padding:0.75rem 1.5rem; background:#4f46e5; color:#fff; text-decoration:none; border-radius:4px;">Restablecer contraseña</a>
          <p>Este enlace expirará el <strong>${expiresAt}</strong>.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
          <p style="margin-top:2rem; color:#777; font-size:0.875rem;">Gracias,<br/>El equipo de TuApp</p>
        `)
    })

    return response.ok({
      message: 'Correo enviado con instrucciones para restablecer la contraseña.',
    })
  }

  public async resetPassword({ request, response }: HttpContext) {
    const { token, password } = request.only(['token', 'password'])

    // Buscar token en la tabla
    const resetRecord = await PasswordReset.query()
      .where('token', token)
      .andWhere('expiresAt', '>', DateTime.now().toJSDate())
      .first()

    if (!resetRecord) {
      return response.badRequest({ message: 'El token es inválido o ha expirado.' })
    }

    // Buscar usuario asociado al correo
    const user = await Usuario.findBy('correo', resetRecord.correo)
    if (!user) {
      return response.badRequest({ message: 'Usuario no encontrado.' })
    }

    // Actualizar contraseña
    user.password = password // Se hashéa automáticamente si tu modelo está configurado así
    await user.save()

    // Eliminar el token después del uso
    await resetRecord.delete()

    return response.ok({ message: 'La contraseña se actualizó correctamente.' })
  }
}
