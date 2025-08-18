import type { HttpContext } from '@adonisjs/core/http'
import HistorialEstadosTicket from '#models/historial_estado_tickets'
import ComentarioTicket from '#models/comentarios_tickets'

export default class HistorialEstadosTicketsController {
  async porTicket({ params, response }: HttpContext) {
    const ticketId = params.id

    const historialEstados = await HistorialEstadosTicket.query()
      .where('ticket_id', ticketId)
      .preload('usuario')
      .preload('estado')
      .orderBy('fecha_cambio', 'desc')

    // 🗨 2. Comentarios del ticket
    const comentarios = await ComentarioTicket.query()
      .where('ticket_id', ticketId)
      .preload('usuario')
      .orderBy('created_at', 'desc')

    // 🧩 3. Unificamos los dos tipos
    const combinado = [
      ...historialEstados.map((item) => ({
        tipo: 'estado',
        fecha: item.fechaCambio,
        usuario: item.usuario,
        estado: item.estado,
        comentario: item.comentario,
      })),
      ...comentarios.map((item) => ({
        tipo: 'comentario',
        fecha: item.createdAt,
        usuario: item.usuario,
        comentario: item.comentario,
      })),
    ].sort((a, b) => b.fecha.toMillis() - a.fecha.toMillis()) // Orden descendente

    return response.ok(combinado)
  }
}
