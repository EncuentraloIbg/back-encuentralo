// app/controllers/auth_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import Hash from '@adonisjs/core/services/hash'
import PasswordReset from '#models/password_reset'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'
import crypto from 'node:crypto'

export default class AuthController {
  /**
   * GET /api/v1/me
   * 🔓 MODO DEV SIN AUTENTICACIÓN:
   *   - Devuelve SIEMPRE el primer usuario (con su razón social) sin exigir Bearer token.
   *   - Úsalo para trabajar cómodo en front. No lo dejes así en producción.
   */
  public async me({ response }: HttpContext) {
    const user = await Usuario.query()
      .preload('razonSocial')
      .orderBy('id', 'asc')
      .first()

    if (!user) return response.ok({ user: null })

    return response.ok({
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        telefono: user.telefono,
        direccion: user.direccion,
        estado: user.estado,
        // importante para el sidebar/foto de perfil:
        avatar_url: user.avatarUrl, // ← el front espera snake_case
        razon_social: user.razonSocial
          ? { id: user.razonSocial.id, nombre: user.razonSocial.nombre }
          : null,
        created_at: user.createdAt?.toISO(),
        updated_at: user.updatedAt?.toISO(),
      },
    })
  }

  /** POST /api/v1/login */
  public async login({ request, response }: HttpContext) {
    const correo = String(request.input('correo') || '').trim().toLowerCase()
    const password = String(request.input('password') || '').trim()

    if (!correo || !password) {
      return response.badRequest({ message: 'correo y password son requeridos' })
    }

    try {
      const user = await Usuario.query().where('correo', correo).first()
      if (!user) return response.unauthorized({ message: 'Correo o contraseña inválidos' })

      if (user.estado && user.estado !== 'activo') {
        return response.forbidden({ message: 'Usuario inactivo' })
      }

      const ok = await Hash.use('scrypt').verify(user.password, password)
      if (!ok) return response.unauthorized({ message: 'Correo o contraseña inválidos' })

      const token = await Usuario.accessTokens.create(user)

      return response.ok({
        type: 'bearer',
        token: token.value,
        user: {
          id: user.id,
          nombres: user.nombres,
          apellidos: user.apellidos,
          correo: user.correo,
          telefono: user.telefono,
          direccion: user.direccion,
          estado: user.estado,
          avatar_url: user.avatarUrl,
          created_at: user.createdAt?.toISO(),
          updated_at: user.updatedAt?.toISO(),
        },
      })
    } catch {
      return response.internalServerError({ message: 'Error interno del servidor' })
    }
  }

  /** POST /api/v1/forgot-password */
  public async forgotPassword({ request, response }: HttpContext) {
    const correo = String(request.input('correo') || '').trim().toLowerCase()
    if (!correo) return response.badRequest({ message: 'correo es requerido' })

    const user = await Usuario.findBy('correo', correo)
    if (!user) return response.badRequest({ message: 'El correo no está registrado.' })

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = DateTime.now().plus({ hours: 1 })

    await PasswordReset.query().where('correo', correo).delete()
    await PasswordReset.create({ correo, token, expiresAt })

    const enlace = `http://localhost:5173/new-password/${token}`

    await mail.send((message) => {
      message
        .to(correo)
        .from('no-reply@tuapp.com', 'TuApp')
        .subject('Restablece tu contraseña')
        .html(`
          <h2>Hola,</h2>
          <p>Haz clic para crear una nueva contraseña:</p>
          <a href="${enlace}">Restablecer contraseña</a>
          <p>Expira: <strong>${expiresAt.toFormat('yyyy-LL-dd HH:mm')}</strong></p>
        `)
    })

    return response.ok({
      message: 'Correo enviado con instrucciones para restablecer la contraseña.',
    })
  }

  /** POST /api/v1/reset-password */
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
    if (!user) return response.badRequest({ message: 'Usuario no encontrado.' })

    user.password = newPassword // hook del modelo la hashea
    await user.save()
    await resetRecord.delete()

    return response.ok({ message: 'La contraseña se actualizó correctamente.' })
  }
}
