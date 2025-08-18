import type { HttpContext } from '@adonisjs/core/http'
import Proyecto from '#models/proyectos' // Asegúrate de que esta ruta al modelo es correcta

export default class ProyectosController {
  public async index({ response }: HttpContext) {
    try {
      const proyectos = await Proyecto.query().preload('empresa')

      const proyectosConEmpresa = proyectos.map((proyecto) => {
        return {
          id: proyecto.id,
          nombre: proyecto.nombre,
          empresa: proyecto.empresa
            ? {
                id: proyecto.empresa.id, // Es bueno incluir el ID de la empresa también
                nombre: proyecto.empresa.nombre,
              }
            : null,
        }
      })

      return response.ok(proyectosConEmpresa)
    } catch (error) {
      console.error('Error al obtener proyectos en el controlador:', error) // Loguea el error en el servidor
      return response.status(500).send({ mensaje: 'Error al obtener proyectos' })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const datos = request.only(['nombre', 'empresa_id'])

      // --- Lógica de verificación de unicidad del nombre al CREAR ---
      const existingProyecto = await Proyecto.query().where('nombre', datos.nombre).first()

      if (existingProyecto) {
        return response.conflict({
          message: 'El nombre del proyecto ya está en uso. Por favor, elige uno diferente.',
        })
      }
      // --- FIN Lógica de verificación de unicidad ---

      const nuevoProyecto = await Proyecto.create(datos)

      await nuevoProyecto.load('empresa')

      return response.created({
        id: nuevoProyecto.id,
        nombre: nuevoProyecto.nombre,
        empresa: nuevoProyecto.empresa
          ? {
              id: nuevoProyecto.empresa.id, // Incluye el ID de la empresa en la respuesta de creación
              nombre: nuevoProyecto.empresa.nombre,
            }
          : null,
      })
    } catch (error) {
      console.error('Error al crear el proyecto en el controlador:', error) // Loguea el error
      return response.status(500).send({ mensaje: 'Error al crear el proyecto' })
    }
  }

  /**
   * Actualiza un proyecto existente por ID.
   * Método que maneja la solicitud PUT /api/proyectos/:id
   */
  public async update({ params, request, response }: HttpContext) {
    try {
      // params.id contiene el ID del proyecto de la URL
      const proyecto = await Proyecto.findOrFail(params.id)

      // request.only() para obtener solo los campos permitidos del cuerpo JSON
      const datos = request.only(['nombre', 'empresa_id'])

      // --- Lógica de verificación de unicidad del nombre al ACTUALIZAR ---
      // Solo verificar si el nombre ha cambiado
      if (datos.nombre && datos.nombre !== proyecto.nombre) {
        const existingProyecto = await Proyecto.query()
          .where('nombre', datos.nombre)
          .whereNot('id', params.id) // Excluir el propio proyecto que se está actualizando
          .first()

        if (existingProyecto) {
          return response.conflict({
            message:
              'El nombre del proyecto ya está en uso por otro proyecto. Por favor, elige uno diferente.',
          })
        }
      }
      // --- FIN Lógica de verificación de unicidad ---

      // Fusiona los datos recibidos con el modelo existente y guarda
      proyecto.merge(datos)
      await proyecto.save()

      // Carga la relación 'empresa' de nuevo para devolver el objeto completo y actualizado
      await proyecto.load('empresa')

      // Devuelve el proyecto actualizado con los datos de la empresa
      return response.ok({
        id: proyecto.id,
        nombre: proyecto.nombre,
        empresa: proyecto.empresa
          ? {
              id: proyecto.empresa.id,
              nombre: proyecto.empresa.nombre,
            }
          : null,
      })
    } catch (error) {
      // Manejo de errores: si el proyecto no se encuentra, o cualquier otro error de DB/lógica
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ mensaje: 'Proyecto no encontrado' })
      }
      console.error('Error al actualizar el proyecto en el controlador:', error)
      return response.status(500).send({ mensaje: 'Error al actualizar el proyecto' })
    }
  }

  /**
   * Elimina un proyecto por su ID.
   * Método que maneja la solicitud DELETE /api/proyectos/:id
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      // params.id contiene el ID del proyecto de la URL
      const proyecto = await Proyecto.findOrFail(params.id)

      // Elimina el proyecto de la base de datos
      await proyecto.delete()

      // Responde con un 204 No Content (sin contenido), que es estándar para eliminaciones exitosas
      return response.noContent()
    } catch (error) {
      // Manejo de errores: si el proyecto no se encuentra, o cualquier otro error de DB/lógica
      if (error.code === 'E_ROW_NOT_FOUND') {
        return response.notFound({ mensaje: 'Proyecto no encontrado' })
      }
      console.error('Error al eliminar el proyecto en el controlador:', error)
      return response.status(500).send({ mensaje: 'Error al eliminar el proyecto' })
    }
  }

  // --- **Nuevo Método: `checkUniqueName` (CORREGIDO)** ---
  // Este método debe estar DENTRO de las llaves de la clase ProyectosController { ... }
  public async checkUniqueName({ request, response }: HttpContext) {
    const name = request.input('name')
    const excludeId = request.input('excludeId')

    if (!name) {
      return response.badRequest({
        message: 'El nombre es requerido para la verificación de unicidad.',
      })
    }

    let query = Proyecto.query().where('nombre', name)

    if (excludeId) {
      query = query.whereNot('id', excludeId)
    }

    const existingProyecto = await query.first()

    // Si existingProyecto es null, el nombre es único.
    if (existingProyecto) {
      return response.conflict({
        isUnique: false,
        message: 'El nombre del proyecto ya está en uso.',
      })
    }

    return response.ok({ isUnique: true, message: 'El nombre del proyecto está disponible.' })
  }
} // <--- Asegúrate de que esta es la ÚNICA llave de cierre de la clase.
