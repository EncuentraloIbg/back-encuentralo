import type { HttpContext } from '@adonisjs/core/http'
import RolesPermisosItem from '#models/roles_permisos_item'

export default class RolePermissionItemController {
  /**
   * Lista todas las asignaciones existentes con datos relacionados
   */
  async index({ response }: HttpContext) {
    const asignaciones = await RolesPermisosItem.query()
      .preload('rol')
      .preload('permiso')
      .preload('item')

    return response.ok(asignaciones)
  }

  /**
   * Asigna múltiples permisos a un rol por ítem
   */
  async store({ request, response }: HttpContext) {
    const { rolId, itemId, permisosIds } = request.body()

    // Validaciones básicas
    if (!rolId || !itemId || !Array.isArray(permisosIds) || permisosIds.length === 0) {
      return response.badRequest({
        message: 'Debe proporcionar rolId, itemId y al menos un permiso válido.',
      })
    }

    // Consultar asignaciones existentes
    const existentes = await RolesPermisosItem.query()
      .where('rol_id', rolId)
      .where('item_id', itemId)

    const combinacionesExistentes = new Set(
      existentes.map((a) => `${a.permisoId}-${a.itemId}-${a.rolId}`)
    )

    // Filtrar permisos nuevos (que no estén ya asignados)
    const nuevos = permisosIds
      .filter((permisoId) => !combinacionesExistentes.has(`${permisoId}-${itemId}-${rolId}`))
      .map((permisoId) => ({
        rolId,
        itemId,
        permisoId,
      }))

    if (nuevos.length === 0) {
      return response.badRequest({ message: 'Todos los permisos ya fueron asignados previamente.' })
    }

    await RolesPermisosItem.createMany(nuevos)
    return response.created({ message: 'Permisos asignados correctamente.', data: nuevos })
  }

  async updateByRolItem({ request, response }: HttpContext) {
    const { rolId, itemId, permisosIds } = request.body()

    if (!rolId || !itemId || !Array.isArray(permisosIds)) {
      return response.badRequest({
        message: 'Debe proporcionar rolId, itemId y un array de permisosIds.',
      })
    }
    // 1. Eliminar todas las asignaciones existentes para este rol e ítem
    await RolesPermisosItem.query().where('rol_id', rolId).where('item_id', itemId).delete()

    // 2. Si no hay permisos nuevos, hemos terminado.
    if (permisosIds.length === 0) {
      return response.ok({ message: 'Permisos actualizados correctamente (todos eliminados).' })
    }

    // 3. Preparar las nuevas asignaciones
    const nuevasAsignaciones = permisosIds.map((permisoId: number) => ({
      rolId,
      itemId,
      permisoId,
    }))
    // 4. Crear las nuevas asignaciones
    await RolesPermisosItem.createMany(nuevasAsignaciones)

    return response.ok({
      message: 'Permisos actualizados correctamente.',
      data: nuevasAsignaciones,
    })
  }

  /**
   * Elimina una asignación por ID
   */
  async destroy({ params, response }: HttpContext) {
    const asignacion = await RolesPermisosItem.findOrFail(params.id)
    await asignacion.delete()

    return response.ok({ message: 'Asignación eliminada correctamente.' })
  }

  public async eliminarPorRolItem({ params, response }: HttpContext) {
    const { rolId, itemId } = params // Captura los parámetros de la URL

    // 1. Validar que los IDs existen y son numéricos
    // Adonis valida los parámetros de ruta por defecto, pero una verificación explícita es buena.
    if (!rolId || !itemId || Number.isNaN(Number(rolId)) || Number.isNaN(Number(itemId))) {
      return response.badRequest({ message: 'IDs de rol e ítem inválidos o faltantes en la URL.' })
    }

    try {
      // 2. Ejecutar la eliminación en la base de datos
      // Esto elimina todas las filas de la tabla roles_permisos_item
      // donde rol_id coincida con rolId y item_id coincida con itemId.
      const deletedRows = await RolesPermisosItem.query()
        .where('rol_id', Number(rolId)) // Asegúrate de castear a Number si tus IDs de DB son numéricos
        .where('item_id', Number(itemId)) // Asegúrate de castear a Number
        .delete()

      // 3. Responder al cliente
      if (Array.isArray(deletedRows) ? deletedRows.length > 0 : deletedRows > 0) {
        return response.ok({
          message: `Se eliminaron ${Array.isArray(deletedRows) ? deletedRows.length : deletedRows} asignaciones para el rol ${rolId} y el ítem ${itemId}.`,
          deletedCount: Array.isArray(deletedRows) ? deletedRows.length : deletedRows,
        })
      } else {
        // Esto se ejecutará si no se encontraron asignaciones para esos IDs
        return response.notFound({
          message:
            'No se encontraron asignaciones para eliminar con el rol y el ítem especificados.',
        })
      }
    } catch (error) {
      console.error('Error en el servidor al eliminar asignaciones por rol/ítem:', error)
      return response.internalServerError({
        message: 'Error interno del servidor al eliminar asignaciones.',
        error: error.message,
      })
    }
  }
}
