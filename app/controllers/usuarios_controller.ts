// app/controllers/usuarios_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuario'
import RazonSocial from '#models/razon_social'

export default class UsuariosController {
  /** GET /api/v1/usuarios */
  public async index({ request, response }: HttpContext) {
    const q = String(request.input('q') || '').trim()
    const estado = request.input('estado') as 'activo' | 'inactivo' | undefined
    const rsId = request.input('razon_social_id')
      ? Number(request.input('razon_social_id'))
      : undefined
    const page = Number(request.input('page') || 1)
    const perPage = Math.min(Number(request.input('perPage') || 20), 100)

    const users = await Usuario.query()
      .if(q, (qb) =>
        qb.where((sub) => {
          sub
            .whereILike('nombres', `%${q}%`)
            .orWhereILike('apellidos', `%${q}%`)
            .orWhereILike('correo', `%${q}%`)
            .orWhereILike('telefono', `%${q}%`)
        })
      )
      .if(estado, (qb) => qb.where('estado', estado!))
      .if(rsId, (qb) => qb.where('razon_social_id', rsId!))
      .orderBy('id', 'asc')
      .paginate(page, perPage)

    return response.ok(users)
  }

  /** GET /api/v1/usuarios/:id */
  public async show({ params, response }: HttpContext) {
    const user = await Usuario.find(params.id)
    if (!user) return response.notFound({ message: 'Usuario no encontrado' })
    return response.ok(user)
  }

  /** POST /api/v1/usuarios */
  public async store({ request, response }: HttpContext) {
    const razonSocialId = Number(request.input('razon_social_id'))
    const nombres = String(request.input('nombres') || '').trim()
    const apellidos = String(request.input('apellidos') || '').trim()
    const correo = String(request.input('correo') || '').trim().toLowerCase()
    const password = String(request.input('password') || '')
    const telefono = request.input('telefono') ? String(request.input('telefono')) : null
    const direccion = request.input('direccion') ? String(request.input('direccion')) : null
    const estado = (request.input('estado') as 'activo' | 'inactivo') ?? 'activo'
    const avatarUrl = request.input('avatar_url') ? String(request.input('avatar_url')) : null

    if (!razonSocialId || Number.isNaN(razonSocialId)) {
      return response.badRequest({ message: 'razon_social_id es requerido y debe ser numérico' })
    }
    if (!nombres) return response.badRequest({ message: 'nombres es requerido' })
    if (!apellidos) return response.badRequest({ message: 'apellidos es requerido' })
    if (!correo) return response.badRequest({ message: 'correo es requerido' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      return response.badRequest({ message: 'correo no tiene un formato válido' })
    }
    if (!password || password.length < 6) {
      return response.badRequest({ message: 'password debe tener al menos 6 caracteres' })
    }
    if (estado !== 'activo' && estado !== 'inactivo') {
      return response.badRequest({ message: "estado debe ser 'activo' o 'inactivo'" })
    }

    const rs = await RazonSocial.find(razonSocialId)
    if (!rs) return response.badRequest({ message: 'La razón social no existe' })

    const emailTaken = await Usuario.findBy('correo', correo)
    if (emailTaken) return response.conflict({ message: 'El correo ya está registrado' })

    try {
      const created = await Usuario.create({
        razonSocialId,
        nombres,
        apellidos,
        correo,
        password,
        telefono,
        direccion,
        estado,
        avatarUrl,
      })
      return response.created(created)
    } catch (error: any) {
      return response.internalServerError({
        message: 'Error al crear usuario',
        error: String(error),
      })
    }
  }

  /** PATCH /api/v1/usuarios/:id */
  public async update({ params, request, response }: HttpContext) {
    const user = await Usuario.find(params.id)
    if (!user) return response.notFound({ message: 'Usuario no encontrado' })

    const razonSocialIdRaw = request.input('razon_social_id')
    const razonSocialId =
      razonSocialIdRaw !== undefined && razonSocialIdRaw !== null
        ? Number(razonSocialIdRaw)
        : undefined

    const nombres =
      request.input('nombres') !== undefined ? String(request.input('nombres')).trim() : undefined
    const apellidos =
      request.input('apellidos') !== undefined
        ? String(request.input('apellidos')).trim()
        : undefined
    const correo =
      request.input('correo') !== undefined
        ? String(request.input('correo')).trim().toLowerCase()
        : undefined
    const password =
      request.input('password') !== undefined ? String(request.input('password')) : undefined
    const telefono =
      request.input('telefono') !== undefined ? String(request.input('telefono')) : undefined
    const direccion =
      request.input('direccion') !== undefined ? String(request.input('direccion')) : undefined
    const estado = request.input('estado') as 'activo' | 'inactivo' | undefined
    const avatarUrl =
      request.input('avatar_url') !== undefined ? String(request.input('avatar_url')) : undefined

    if (razonSocialId !== undefined) {
      if (!razonSocialId || Number.isNaN(razonSocialId)) {
        return response.badRequest({ message: 'razon_social_id debe ser numérico' })
      }
      const rsExists = await RazonSocial.find(razonSocialId)
      if (!rsExists) return response.badRequest({ message: 'La razón social no existe' })
      user.razonSocialId = razonSocialId
    }

    if (correo !== undefined) {
      if (!correo) return response.badRequest({ message: 'correo no puede estar vacío' })
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return response.badRequest({ message: 'correo no tiene un formato válido' })
      }
      if (correo !== user.correo) {
        const emailTaken = await Usuario.findBy('correo', correo)
        if (emailTaken) return response.conflict({ message: 'El correo ya está registrado' })
        user.correo = correo
      }
    }

    if (nombres !== undefined) user.nombres = nombres
    if (apellidos !== undefined) user.apellidos = apellidos
    if (telefono !== undefined) user.telefono = telefono || null
    if (direccion !== undefined) user.direccion = direccion || null
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl || null

    if (estado !== undefined) {
      if (estado !== 'activo' && estado !== 'inactivo') {
        return response.badRequest({ message: "estado debe ser 'activo' o 'inactivo'" })
      }
      user.estado = estado
    }

    if (password !== undefined) {
      if (!password || password.length < 6) {
        return response.badRequest({ message: 'password debe tener al menos 6 caracteres' })
      }
      user.password = password // hook la hashea
    }

    try {
      await user.save()
      return response.ok(user)
    } catch (error: any) {
      return response.internalServerError({
        message: 'Error al actualizar usuario',
        error: String(error),
      })
    }
  }

  /** PATCH /api/v1/usuarios/:id/inactivar */
  public async inactivate({ params, response }: HttpContext) {
    const user = await Usuario.find(params.id)
    if (!user) return response.notFound({ message: 'Usuario no encontrado' })
    user.estado = 'inactivo'
    await user.save()
    return response.ok({ message: 'Usuario inactivado', user })
  }

  /** PATCH /api/v1/usuarios/:id/activar */
  public async activate({ params, response }: HttpContext) {
    const user = await Usuario.find(params.id)
    if (!user) return response.notFound({ message: 'Usuario no encontrado' })
    user.estado = 'activo'
    await user.save()
    return response.ok({ message: 'Usuario activado', user })
  }

  /** DELETE /api/v1/usuarios/:id */
  public async destroy({ params, response }: HttpContext) {
    const user = await Usuario.find(params.id)
    if (!user) return response.notFound({ message: 'Usuario no encontrado' })
    await user.delete()
    return response.ok({ message: 'Usuario eliminado permanentemente' })
  }

  /** PUT /api/v1/usuarios/me (si decides usar auth) */
  public async updateMe({ auth, request, response }: HttpContext) {
    const apiGuard = auth.use('api')
    await apiGuard.authenticate()
    const authUser = apiGuard.user as unknown as Usuario | null
    if (!authUser?.id) return response.unauthorized({ message: 'No autenticado' })

    const user = await Usuario.findOrFail(authUser.id)

    const nombres = request.input('nombres') as string | undefined
    const apellidos = request.input('apellidos') as string | undefined
    const telefono = request.input('telefono') as string | undefined
    const direccion = request.input('direccion') as string | undefined
    const avatarUrl = request.input('avatar_url') as string | undefined

    if (nombres !== undefined) user.nombres = String(nombres).trim()
    if (apellidos !== undefined) user.apellidos = String(apellidos).trim()
    if (telefono !== undefined) user.telefono = telefono || null
    if (direccion !== undefined) user.direccion = direccion || null
    if (avatarUrl !== undefined) user.avatarUrl = avatarUrl || null

    await user.save()

    return response.ok({
      message: 'Perfil actualizado',
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        correo: user.correo,
        avatar_url: user.avatarUrl,
      },
    })
  }
}
