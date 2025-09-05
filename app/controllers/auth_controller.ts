// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import Hash from '@adonisjs/core/services/hash'
import PasswordReset from '#models/password_reset'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import crypto from 'node:crypto'

export default class AuthController {
  /** Login: devuelve bearer + user */
  public async login({ request, response }: HttpContext) {
    const rawEmail = String(request.input('correo') || '')
    const rawPassword = String(request.input('password') || '')
    const correo = rawEmail.trim().toLowerCase()
    const password = rawPassword.trim()

    if (!correo || !password) {
      return response.badRequest({ message: 'correo y password son requeridos' })
    }

    try {
      const user = await Usuario.query().where('correo', correo).first()
      if (!user) {
        return response.unauthorized({ message: 'Correo o contraseña inválidos' })
      }

      if (user.estado && user.estado !== 'activo') {
        return response.forbidden({ message: 'Usuario inactivo' })
      }

      // Verificación con el mismo driver (scrypt)
      const ok = await Hash.use('scrypt').verify(user.password, password)
      if (!ok) {
        return response.unauthorized({ message: 'Correo o contraseña inválidos' })
      }

      const token = await Usuario.accessTokens.create(user)

      return {
        type: 'bearer',
        token: token.value, // string listo para el front
        user: user.serialize(), // password oculto por serializeAs: null
      }
    } catch {
      return response.internalServerError({ message: 'Error interno del servidor' })
    }
  }

  /** Forgot password: genera token y envía enlace /new-password/:token */
  public async forgotPassword({ request, response }: HttpContext) {
    const correo = String(request.input('correo') || '')
      .trim()
      .toLowerCase()
    if (!correo) return response.badRequest({ message: 'correo es requerido' })

    const user = await Usuario.findBy('correo', correo)
    if (!user) {
      // Podrías responder 200 para no revelar existencia; aquí dejamos feedback explícito
      return response.badRequest({ message: 'El correo no está registrado.' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })

    await PasswordReset.query().where('correo', correo).delete()
    await PasswordReset.create({ correo, token, expiresAt })

    const enlace = `http://localhost:5173/new-password/${token}`

    await mail.send((message) => {
      message.to(correo).from('no-reply@tuapp.com', 'TuApp').subject('Restablece tu contraseña')
        .html(`
          <h2>Hola,</h2>
          <p>Recibimos una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
          <a href="${enlace}" style="display:inline-block;margin-top:1rem;padding:0.75rem 1.5rem;background:#4f46e5;color:#fff;text-decoration:none;border-radius:4px;">Restablecer contraseña</a>
          <p>Este enlace expira el <strong>${expiresAt.toFormat('yyyy-LL-dd HH:mm')}</strong>.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        `)
    })

    return response.ok({
      message: 'Correo enviado con instrucciones para restablecer la contraseña.',
    })
  }

  /** Reset password: valida token no expirado y actualiza password (hook hashea con scrypt) */
  public async resetPassword({ request, response }: HttpContext) {
    const token = String(request.input('token') || '')
    const newPassword = String(request.input('password') || '')

    if (!token || !newPassword) {
      return response.badRequest({ message: 'token y password son requeridos' })
    }
    if (newPassword.length < 6) {
      return response.badRequest({ message: 'La contraseña debe tener al menos 6 caracteres' })
    }

    const resetRecord = await PasswordReset.query()
      .where('token', token)
      .andWhere('expires_at', '>', DateTime.now().toJSDate())
      .first()

    if (!resetRecord) {
      return response.badRequest({ message: 'El token es inválido o ha expirado.' })
    }

    const user = await Usuario.findBy('correo', resetRecord.correo)
    if (!user) {
      return response.badRequest({ message: 'Usuario no encontrado.' })
    }

    // Asignar en claro: el hook del modelo lo hashea con scrypt al guardar
    user.password = newPassword
    await user.save()
    await resetRecord.delete()

    return response.ok({ message: 'La contraseña se actualizó correctamente.' })
  }
}
