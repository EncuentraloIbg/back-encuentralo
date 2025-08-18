// app/controllers/comentarios_controller.ts
import { HttpContext } from '@adonisjs/core/http'
import ComentarioTicket from '#models/comentarios_tickets'
import Ticket from '#models/tickets' // Importa el modelo Ticket
import NotificacionesController from './notificacions_controller.js'
// No es estrictamente necesario importar EstadoNotificacion aquí, ya que el ID es un valor fijo.
// import EstadoNotificacion from '#models/estados_notificacion';

export default class ComentariosController {
  async store({ request, params, response }: HttpContext) {
    const ticketId = Number(params.id)
    const contenidoComentario = request.input('comentario')
    const usuarioId = request.input('usuarioId') // Este es el ID del usuario que está creando el comentario

    // Validación básica
    if (!contenidoComentario || !contenidoComentario.trim()) {
      return response.badRequest({ message: 'El comentario no puede estar vacío' })
    }

    if (!usuarioId) {
      return response.badRequest({ message: 'El ID del usuario es obligatorio' })
    }

    try {
      // 1. Crear el comentario
      const comentario = await ComentarioTicket.create({
        comentario: contenidoComentario.trim(),
        ticketId,
        usuarioId,
      })

      // 2. Obtener el ticket para identificar al creador y enviar la notificación
      const ticket = await Ticket.find(ticketId)

      // Define el ID de estado de notificación. Asegúrate de que este ID exista en tu tabla 'estados_notificacion'.
      // Por ejemplo, 2 podría ser "Nuevo Comentario".
      const ID_ESTADO_NOTIFICACION_NUEVO_COMENTARIO = 2

      if (ticket && ticket.creadorId) {
        // Carga la relación 'creador' para obtener su información y usarla en el mensaje de la notificación
        await ticket.load('creador') // Asegúrate de que tu modelo Ticket tenga esta relación definida

        //const nombreCreador = ticket.creador
        //  ? `${ticket.creador.nombre} ${ticket.creador.apellido}`
        //  : `Usuario ${ticket.creadorId}`
        const nombreQuienComento = await ComentarioTicket.query()
          .where('id', comentario.id)
          .preload('usuario')
          .first()
        const nombreUsuarioComentario = nombreQuienComento?.usuario
          ? `${nombreQuienComento.usuario.nombre} ${nombreQuienComento.usuario.apellido}`
          : `Usuario ${usuarioId}`

        // 3. Enviar la notificación al creador del ticket
        await NotificacionesController.crearParaCreadorTicket({
          titulo: 'Nuevo comentario en tu ticket',
          mensaje: `El ${nombreUsuarioComentario} ha añadido un nuevo comentario en el ticket #${ticket.id}: "${contenidoComentario.substring(0, 100)}..."`, // Truncar el mensaje para no exceder
          ticketId: ticket.id,
          estadoId: ID_ESTADO_NOTIFICACION_NUEVO_COMENTARIO,
          // Puedes añadir más datos relevantes si tu función crearParaCreadorTicket los acepta
          // Por ejemplo, id del usuario que realizó el comentario:
          // usuarioOrigenId: usuarioId
        })
      } else {
        console.warn(
          `[ComentariosController] No se pudo enviar notificación: Ticket #${ticketId} no encontrado o sin creadorId.`
        )
      }

      // 4. Cargar la relación 'usuario' para la respuesta del comentario si es necesario en el frontend
      await comentario.load('usuario')

      // 5. Devolver el comentario creado
      return response.created(comentario)
    } catch (error) {
      console.error('Error al guardar comentario:', error)
      return response.internalServerError({
        message: 'Error interno del servidor al crear el comentario',
        error: error.message,
      })
    }
  }
}
