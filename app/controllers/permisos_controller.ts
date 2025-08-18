// app/Controllers/PermisosController.ts

import type { HttpContext } from '@adonisjs/core/http'
// *** ¡CAMBIO CRÍTICO AQUÍ! Asegúrate de importar el modelo Permiso, no el Rol. ***
// La ruta correcta a tu modelo Permiso, usando la mayúscula en 'Permiso'
import Permiso from '#models/permisos'

export default class PermisosController {
  /**
   * Muestra una lista de todos los Permisos.
   * GET /api/permisos
   */
  async index({ response }: HttpContext) {
    try {
      // *** ¡CAMBIO CRÍTICO AQUÍ! Asegúrate de consultar el modelo Permiso. ***
      const permisos = await Permiso.all()
      return response.ok(permisos)
    } catch (error) {
      console.error('Error al obtener permisos en PermisosController:', error)
      return response.internalServerError({
        message: 'Error al obtener permisos',
        error: error.message,
      })
    }
  }

  /**
   * Mostrar un permiso específico por ID.
   * GET /api/permisos/:id
   */
  async show({ params, response }: HttpContext) {
    try {
      const permiso = await Permiso.find(params.id)
      if (!permiso) {
        return response.notFound({ message: 'Permiso no encontrado.' })
      }
      return response.ok(permiso)
    } catch (error) {
      console.error(`Error al obtener permiso ${params.id}:`, error)
      return response.internalServerError({
        message: 'Error al obtener permiso',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo permiso.
   * POST /api/permisos
   */
  async store({ request, response }: HttpContext) {
    const { nombre } = request.only(['nombre'])

    if (!nombre) {
      return response.badRequest({ message: 'El nombre del permiso es requerido.' })
    }

    try {
      const permiso = await Permiso.create({ nombre })
      return response.created(permiso) // 201 Created
    } catch (error) {
      console.error('Error al crear permiso:', error)
      // Puedes añadir más lógica aquí para errores de duplicados, etc.
      return response.internalServerError({
        message: 'Error al crear permiso',
        error: error.message,
      })
    }
  }

  /**
   * Actualizar un permiso existente.
   * PUT /api/permisos/:id
   */
  async update({ params, request, response }: HttpContext) {
    const { nombre } = request.only(['nombre'])

    if (!nombre) {
      return response.badRequest({ message: 'El nombre del permiso es requerido para actualizar.' })
    }

    try {
      const permiso = await Permiso.find(params.id)
      if (!permiso) {
        return response.notFound({ message: 'Permiso no encontrado para actualizar.' })
      }

      permiso.nombre = nombre
      await permiso.save()
      return response.ok(permiso)
    } catch (error) {
      console.error(`Error al actualizar permiso ${params.id}:`, error)
      return response.internalServerError({
        message: 'Error al actualizar permiso',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un permiso.
   * DELETE /api/permisos/:id
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const permiso = await Permiso.find(params.id)
      if (!permiso) {
        return response.notFound({ message: 'Permiso no encontrado para eliminar.' })
      }

      await permiso.delete()
      return response.noContent() // 204 No Content
    } catch (error) {
      console.error(`Error al eliminar permiso ${params.id}:`, error)
      // OJO: Considera añadir lógica para evitar eliminar permisos si tienen asignaciones (FK en rol_permiso_items)
      // Esto causaría un error de restricción de clave foránea.
      return response.internalServerError({
        message: 'Error al eliminar permiso',
        error: error.message,
      })
    }
  }
}
