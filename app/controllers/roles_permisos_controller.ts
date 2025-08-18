// app/Controllers/RolesPermisosController.ts

import type { HttpContext } from '@adonisjs/core/http'
import Rol from '#models/roles'
import Permiso from '#models/permisos'
import Item from '#models/items'
import RolPermisoItem from '#models/roles_permisos_item'

export default class RolesPermisosController {
  // --- Métodos de obtención de datos (Leer / Read) ---

  async getRoles({ response }: HttpContext) {
    try {
      const roles = await Rol.all()
      return response.ok(roles)
    } catch (error) {
      console.error('Error al obtener roles:', error)
      return response.internalServerError({
        message: 'Error al obtener roles',
        error: (error as any).message,
      })
    }
  }

  async getPermisos({ response }: HttpContext) {
    try {
      const permisos = await Permiso.all()
      return response.ok(permisos)
    } catch (error) {
      console.error('Error al obtener permisos:', error)
      return response.internalServerError({
        message: 'Error al obtener permisos',
        error: (error as any).message,
      })
    }
  }

  async getItems({ response }: HttpContext) {
    try {
      const items = await Item.all()
      return response.ok(items)
    } catch (error) {
      console.error('Error al obtener ítems:', error)
      return response.internalServerError({
        message: 'Error al obtener ítems',
        error: (error as any).message,
      })
    }
  }

  async getAsignaciones({ response }: HttpContext) {
    try {
      const asignaciones = await RolPermisoItem.query()
        .preload('rol')
        .preload('permiso')
        .preload('item')
        .orderBy('created_at', 'desc')

      return response.ok(asignaciones)
    } catch (error) {
      console.error('Error al obtener todas las asignaciones:', error)
      return response.internalServerError({
        message: 'Error al obtener todas las asignaciones',
        error: (error as any).message,
      })
    }
  }

  async getAsignacionesPorRol({ params, response }: HttpContext) {
    try {
      const rolId = params.rolId

      if (!rolId || Number.isNaN(Number(rolId))) {
        return response.badRequest({ message: 'ID de rol inválido.' })
      }

      const asignaciones = await RolPermisoItem.query()
        .where('rol_id', rolId)
        .preload('rol')
        .preload('permiso')
        .preload('item')
        .orderBy('created_at', 'desc')

      return response.ok(asignaciones)
    } catch (error) {
      console.error(`Error al obtener asignaciones para el rol ${params.rolId}:`, error)
      return response.internalServerError({
        message: 'Error al obtener asignaciones',
        error: (error as any).message,
      })
    }
  }

  // --- Método para crear asignaciones (Crear / Create) ---
  async createAsignacion({ request, response }: HttpContext) {
    const { rolId, itemId, selectedPermisos, selectedVistas } = request.only([
      'rolId',
      'itemId',
      'selectedPermisos',
      'selectedVistas',
    ])

    const cleanRolId = Number(rolId)
    const cleanItemId = itemId === undefined || itemId === '' ? null : Number(itemId)

    if (Number.isNaN(cleanRolId)) {
      return response.badRequest({ message: 'El ID de rol es inválido.' })
    }
    if (itemId !== undefined && itemId !== '' && Number.isNaN(cleanItemId as number)) {
      return response.badRequest({ message: 'El ID del ítem debe ser un número válido o nulo.' })
    }

    if (!selectedPermisos && !selectedVistas) {
      return response.badRequest({
        message: 'Debe seleccionar al menos un permiso o una vista para asignar.',
      })
    }

    const permisoLeer = await Permiso.findBy('nombre', 'leer')
    if (!permisoLeer) {
      return response.internalServerError({
        message: "El permiso 'leer' (para vistas) no fue encontrado. Asegúrate de crearlo.",
      })
    }
    const leerPermisoId = permisoLeer.id

    const assignmentsToCreate: Array<{ rolId: number; permisoId: number; itemId: number | null }> =
      []

    if (selectedPermisos && selectedPermisos.length > 0) {
      for (const permisoId of selectedPermisos) {
        if (permisoId === leerPermisoId) {
          continue
        }
        assignmentsToCreate.push({
          rolId: cleanRolId,
          permisoId: permisoId,
          itemId: cleanItemId,
        })
      }
    }

    if (selectedVistas && selectedVistas.length > 0) {
      for (const vistaId of selectedVistas) {
        const numericVistaId = Number(vistaId)
        if (Number.isNaN(numericVistaId)) {
          return response.badRequest({
            message: `El ID de la vista '${vistaId}' no es un número válido.`,
          })
        }
        assignmentsToCreate.push({
          rolId: cleanRolId,
          permisoId: leerPermisoId,
          itemId: numericVistaId,
        })
      }
    }

    if (assignmentsToCreate.length === 0) {
      return response.badRequest({ message: 'No se generaron asignaciones válidas para crear.' })
    }

    try {
      let createdCount = 0
      for (const assign of assignmentsToCreate) {
        const exists = await RolPermisoItem.query()
          .where('rol_id', assign.rolId)
          .where('permiso_id', assign.permisoId)
          .if(assign.itemId !== null, (query) => {
            query.where('item_id', assign.itemId!)
          })
          .if(assign.itemId === null, (query) => {
            query.whereNull('item_id')
          })
          .first()

        if (!exists) {
          await RolPermisoItem.create({
            rolId: assign.rolId,
            permisoId: assign.permisoId,
            itemId: assign.itemId,
          })
          createdCount++
        }
      }

      return response.created({
        message: `Asignaciones procesadas. ${createdCount} nuevas asignaciones creadas.`,
        createdRecords: assignmentsToCreate,
      })
    } catch (error) {
      console.error('Error al crear asignaciones:', error)
      if ((error as any).code === '23505' || (error as any).code === 'ER_DUP_ENTRY') {
        return response.conflict({ message: 'Algunas asignaciones ya existen.' })
      }
      return response.internalServerError({
        message: 'Error al crear asignaciones',
        error: (error as any).message,
      })
    }
  }

  // --- Método para eliminar asignación (Eliminar / Delete) - CORREGIDO Y COMPLETO ---
  async deleteAsignacion({ params, response }: HttpContext) {
    const { rolId, permisoId, itemId } = params

    console.log('Backend DELETE: Recibiendo params del URL:', { rolId, permisoId, itemId })

    const numericRolId = Number(rolId)
    const numericPermisoId = Number(permisoId)

    if (Number.isNaN(numericRolId) || Number.isNaN(numericPermisoId)) {
      console.error('Backend DELETE: rolId o permisoId son inválidos o "undefined"')
      return response.badRequest({ message: 'Los IDs de rol o permiso no son válidos.' })
    }

    let actualItemId: number | null = null
    if (itemId === 'null') {
      // Si el string es 'null', convertir a null
      actualItemId = null
    } else if (itemId !== undefined && itemId !== null && itemId !== '') {
      // Si tiene valor, intentar convertir a número
      actualItemId = Number(itemId)
      if (Number.isNaN(actualItemId)) {
        console.error('Backend DELETE: ID del ítem no válido (NaN después de conversión):', itemId)
        return response.badRequest({ message: 'El ID del ítem no es válido.' })
      }
    }
    // Si itemId es undefined, null, o '', actualItemId ya es null.

    console.log('Backend DELETE: Valores procesados para la consulta:', {
      numericRolId,
      numericPermisoId,
      actualItemId,
    })

    try {
      const query = RolPermisoItem.query()
        .where('rol_id', numericRolId)
        .where('permiso_id', numericPermisoId)

      if (actualItemId === null) {
        query.whereNull('item_id')
      } else {
        query.where('item_id', actualItemId)
      }

      const deletedRows = await query.delete()

      console.log('Backend DELETE: Filas eliminadas:', deletedRows)

      if (deletedRows.length === 0) {
        return response.notFound({ message: 'Asignación no encontrada o ya eliminada.' })
      }

      return response.noContent() // 204 No Content
    } catch (error) {
      console.error(
        `Error al eliminar asignación para Rol:${rolId}, Permiso:${permisoId}, Item:${itemId}:`,
        error
      )
      return response.internalServerError({
        message: 'Error al eliminar asignación',
        error: (error as any).message,
      })
    }
  }

  // El método updateAsignacion se mantiene comentado si no se usa.
  /*
  async updateAsignacion({ params, request, response }: HttpContext) {
    const { rolId, permisoId, itemId } = params;

    const numericRolId = Number(rolId);
    const numericPermisoId = Number(permisoId);

    if (isNaN(numericRolId) || isNaN(numericPermisoId)) {
        return response.badRequest({ message: 'Los IDs de rol o permiso no son válidos para actualizar.' });
    }

    let actualItemId: number | null = null;
    if (itemId === 'null') {
      actualItemId = null;
    } else if (itemId !== undefined && itemId !== null && itemId !== '') {
      actualItemId = Number(itemId);
      if (isNaN(actualItemId)) {
        return response.badRequest({ message: 'El ID del ítem no es válido para actualizar.' });
      }
    }

    const { is_active } = request.only(['is_active']);

    try {
      const assignment = await RolPermisoItem.query()
        .where('rol_id', numericRolId)
        .where('permiso_id', numericPermisoId)
        .if(actualItemId === null, (query) => {
          query.whereNull('item_id');
        })
        .if(actualItemId !== null, (query) => {
          query.where('item_id', actualItemId);
        })
        .first();

      if (!assignment) {
        return response.notFound({ message: 'Asignación no encontrada para actualizar.' });
      }

      if (typeof is_active === 'boolean') {
        assignment.is_active = is_active;
        await assignment.save();
        return response.ok({ message: 'Asignación actualizada exitosamente.', assignment });
      } else {
        return response.ok({ message: 'Asignación encontrada, pero no se proporcionaron campos actualizables válidos.', assignment });
      }

    } catch (error) {
      console.error(`Error al actualizar asignación para Rol:${rolId}, Permiso:${permisoId}, Item:${itemId}:`, error);
      return response.internalServerError({ message: 'Error al actualizar asignación', error: (error as any).message });
    }
  }
  */
} // <--- ¡Asegúrate de que esta llave de cierre de la clase exista al final del archivo!
