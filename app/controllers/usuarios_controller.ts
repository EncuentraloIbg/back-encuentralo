import type { HttpContext } from '@adonisjs/core/http'
import Usuario from '#models/usuarios'
import Empresa from '#models/empresas'
import Rol from '#models/roles'
import { usuarioValidator } from '#validators/usuario'

export default class UsuariosController {
  public async index({ response }: HttpContext) {
    try {
      const users = await Usuario.query().preload('rol').preload('empresa').orderBy('id', 'asc')

      return response.ok(users)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al obtener usuarios',
        error: error.message,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const usuario = await Usuario.query()
        .where('id', params.id)
        .preload('rol')
        .preload('empresa')
        .firstOrFail()

      return response.ok(usuario)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'El usuario solicitado no fue encontrado.' })
      }
      return response.internalServerError({
        message: 'Ocurrió un error al obtener el usuario.',
        error: error.message,
      })
    }
  }

  public async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(usuarioValidator.crear)

    try {
      const user = await Usuario.create(payload)

      await user.load('rol')
      await user.load('empresa')

      return response.created(user)
    } catch (error) {
      return response.internalServerError({
        message: 'Error al crear usuario',
        error: error.message,
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    const user = await Usuario.findOrFail(params.id)
    const payload = await request.validateUsing(usuarioValidator.actualizar)

    try {
      user.merge(payload)
      await user.save()

      await user.load('rol')
      await user.load('empresa')

      return response.ok(user)
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Usuario no encontrado para actualizar' })
      }
      return response.internalServerError({
        message: 'Error al actualizar usuario',
        error: error.message,
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const user = await Usuario.findOrFail(params.id)
      await user.delete()
      return response.ok({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ message: 'Usuario no encontrado' })
      }

      return response.internalServerError({
        message: 'Error al eliminar usuario',
        error: error.message,
      })
    }
  }

  public async updateProfilePictureUrlNoAuth({ request, response }: HttpContext) {
    const { userId, url } = request.only(['userId', 'url'])

    if (!userId || !url) {
      return response.badRequest({ message: 'Se requiere userId y url' })
    }

    const user = await Usuario.find(userId)

    if (!user) {
      return response.notFound({ message: 'Usuario no encontrado' })
    }

    user.foto_perfil = url
    await user.save()

    return response.ok({
      message: 'Foto de perfil actualizada con éxito (sin auth)',
      foto_perfil: user.foto_perfil,
    })
  }

  /**
   * GET /api/usuarios/tecnicos-lista
   */
  public async getTecnicos({ response }: HttpContext) {
    try {
      const tecnicos = await Usuario.query()
        .select('id', 'nombre', 'apellido', 'rol_id')
        .preload('rol')
        .whereHas('rol', (query) => {
          query.where('nombre', 'Técnico de soporte')
        })
        .orderBy('nombre', 'asc')

      const resultado = tecnicos.map((t) => ({
        id: t.id,
        nombreCompleto: `${t.nombre} ${t.apellido}`,
      }))

      return response.ok(resultado)
    } catch (error) {
      return response.internalServerError({
        message: 'Ocurrió un error al obtener la lista de técnicos.',
        error: error.message,
      })
    }
  }

  public async getEmpresas({ response }: HttpContext) {
    try {
      const empresas = await Empresa.query().orderBy('nombre', 'asc')
      return response.ok(empresas)
    } catch (error) {
      return response.internalServerError({
        message: 'Ocurrió un error al obtener la lista de empresas.',
        error: error.message,
      })
    }
  }

  public async getRoles({ response }: HttpContext) {
    try {
      const roles = await Rol.query().orderBy('nombre', 'asc')
      return response.ok(roles)
    } catch (error) {
      return response.internalServerError({
        message: 'Ocurrió un error al obtener la lista de roles.',
        error: error.message,
      })
    }
  }
}
