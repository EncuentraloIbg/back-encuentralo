// app/Controllers/ItemsController.ts

import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/items' // Asegúrate de que la ruta sea correcta

export default class ItemsController {
  /**
   * Listar todos los ítems.
   * GET /api/items
   */
  async index({ response }: HttpContext) {
    try {
      // Puedes incluir relaciones aquí si quieres que los ítems muestren sus padres o hijos
      const items = await Item.query().orderBy('nombre', 'asc') // Ordenar por nombre para facilitar la visualización
      return response.ok(items)
    } catch (error) {
      console.error('Error al obtener ítems:', error)
      return response.internalServerError({
        message: 'Error al obtener ítems',
        error: error.message,
      })
    }
  }

  /**
   * Mostrar un ítem específico por ID.
   * GET /api/items/:id
   */
  async show({ params, response }: HttpContext) {
    try {
      const item = await Item.find(params.id)
      if (!item) {
        return response.notFound({ message: 'Ítem no encontrado.' })
      }
      return response.ok(item)
    } catch (error) {
      console.error(`Error al obtener ítem ${params.id}:`, error)
      return response.internalServerError({
        message: 'Error al obtener ítem',
        error: error.message,
      })
    }
  }

  /**
   * Crear un nuevo ítem.
   * POST /api/items
   */
  async store({ request, response }: HttpContext) {
    const { nombre, url, icon, parentId } = request.only(['nombre', 'url', 'icon', 'parentId'])

    if (!nombre) {
      return response.badRequest({ message: 'El nombre del ítem es requerido.' })
    }

    try {
      const item = await Item.create({ nombre, url, icon, parentId })
      return response.created(item) // 201 Created
    } catch (error) {
      console.error('Error al crear ítem:', error)
      return response.internalServerError({ message: 'Error al crear ítem', error: error.message })
    }
  }

  /**
   * Actualizar un ítem existente.
   * PUT /api/items/:id
   */
  async update({ params, request, response }: HttpContext) {
    const { nombre, url, icon, parentId } = request.only(['nombre', 'url', 'icon', 'parentId'])

    if (!nombre) {
      // Puedes hacer que los otros campos sean opcionales para la actualización
      return response.badRequest({ message: 'El nombre del ítem es requerido para actualizar.' })
    }

    try {
      const item = await Item.find(params.id)
      if (!item) {
        return response.notFound({ message: 'Ítem no encontrado para actualizar.' })
      }

      item.nombre = nombre
      item.url = url || null // Si es null o undefined, guarda null
      item.icon = icon || null
      item.parentId = parentId === undefined ? item.parentId : parentId // Si parentId no se envía, mantiene el existente. Si es explícitamente null, lo actualiza.
      await item.save()
      return response.ok(item)
    } catch (error) {
      console.error(`Error al actualizar ítem ${params.id}:`, error)
      return response.internalServerError({
        message: 'Error al actualizar ítem',
        error: error.message,
      })
    }
  }

  /**
   * Eliminar un ítem.
   * DELETE /api/items/:id
   */
  async destroy({ params, response }: HttpContext) {
    try {
      const item = await Item.find(params.id)
      if (!item) {
        return response.notFound({ message: 'Ítem no encontrado para eliminar.' })
      }

      await item.delete()
      return response.noContent() // 204 No Content
    } catch (error) {
      console.error(`Error al eliminar ítem ${params.id}:`, error)
      // OJO: Considera añadir lógica para evitar eliminar ítems si tienen asignaciones (FK en rol_permiso_items)
      // O si son padres de otros ítems.
      return response.internalServerError({
        message: 'Error al eliminar ítem',
        error: error.message,
      })
    }
  }
}
