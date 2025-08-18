// app/Controllers/Http/NotificacionesController.ts

import type { HttpContext } from '@adonisjs/core/http'
import Notificacion from '#models/notificaciones'
//import Usuario from '#models/usuarios' // Aunque no se usa directamente en este código, se mantiene tu importación original
import Ticket from '#models/tickets'

// ¡IMPORTANTE! Importa el emisor desde tu NotificationStreamController.
// Asegúrate de que la ruta sea correcta.
// Ajusta la ruta y el nombre del archivo según la ubicación real y el casing correcto
import { notificationEmitter } from '#controllers/notification_stream_controller'

export default class NotificacionesController {
  /**
   * Listar notificaciones del usuario logueado
   */
  public async index({ request, response }: HttpContext) {
    const usuarioId = request.input('usuarioId')

    if (!usuarioId) {
      return response.status(400).json({ mensaje: 'usuarioId es requerido' })
    }

    const notificaciones = await Notificacion.query()
      .where('usuario_id', usuarioId)
      .orderBy('created_at', 'desc')

    return notificaciones
  }

  /**
   * Marcar una notificación como leída
   */
  public async marcarComoLeida({ params, response }: HttpContext) {
    const notificacion = await Notificacion.find(params.id)

    if (!notificacion) {
      return response.status(404).json({ mensaje: 'Notificación no encontrada' })
    }

    notificacion.leido = true
    await notificacion.save()

    return { mensaje: 'Notificación marcada como leída' }
  }

  /**
   * Crea una notificación para el creador de un ticket específico.
   * Este método es llamado desde otros controladores (ej. TicketsController).
   * @param data Los datos de la notificación, incluyendo el ID del ticket.
   */
  public static async crearParaCreadorTicket(data: {
    titulo: string
    mensaje: string
    ticketId: number
    estadoId?: number // Opcional para el tipo de estado de la notificación
  }) {
    try {
      // 1. Encontrar el ticket para obtener el ID de su creador
      const ticket = await Ticket.find(data.ticketId)
      if (!ticket) {
        console.warn(
          `[NotificacionesController] No se encontró el ticket con ID ${data.ticketId}. No se pudo crear la notificación para el creador.`
        )
        return // Salir si el ticket no existe
      }

      // 2. Crear la notificación para el usuario creador del ticket
      const notificacionData = {
        titulo: data.titulo,
        mensaje: data.mensaje,
        ticketId: data.ticketId,
        estadoId: data.estadoId, // Este es el ID de estado para la notificación
        usuarioId: ticket.creadorId, // ¡La notificación es SOLO para el creador del ticket!
        leido: false,
      }

      // Guarda la notificación en la base de datos y OBTÉN LA INSTANCIA CON EL ID
      const notificacionCreada = await Notificacion.create(notificacionData)
      console.log(
        `Notificación de cambio de estado creada para el creador del ticket #${data.ticketId} (Usuario ID: ${ticket.creadorId}). ID de Notificación: ${notificacionCreada.id}`
      )

      // --- INICIO DE LA INTEGRACIÓN CRÍTICA PARA SSE ---
      // Emite un evento a través del EventEmitter global que escucha el NotificationStreamController.
      // Esta emisión activará el envío de la notificación a los clientes conectados vía SSE.
      notificationEmitter.emit('newNotification', {
        id: notificacionCreada.id, // <-- ¡AGREGADO: EL ID DE LA NOTIFICACIÓN RECIÉN CREADA!
        ticketId: data.ticketId,
        userId: ticket.creadorId, // Fundamental: para que el frontend filtre la notificación por usuario
        message: data.mensaje,
        title: data.titulo,
        statusId: data.estadoId, // Incluye cualquier dato adicional que el frontend necesite para la notificación
      })
      console.log(
        `[NotificacionesController] Evento 'newNotification' emitido con ID: ${notificacionCreada.id} para userId: ${ticket.creadorId}`
      ) // Log para confirmar la emisión
      // --- FIN DE LA INTEGRACIÓN CRÍTICA PARA SSE ---
    } catch (error) {
      console.error(
        '[NotificacionesController] Error al crear notificación para el creador del ticket:',
        error
      )
    }
  }

  // El método 'crearParaTodos' fue reemplazado por 'crearParaCreadorTicket'.
  // Si lo necesitas para otros fines no relacionados con tickets, puedes crearlo como un método aparte.
}
