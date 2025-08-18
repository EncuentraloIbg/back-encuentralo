// backend_soporte/app/controllers/Http/DashboardController.ts
import { HttpContext } from '@adonisjs/core/http'
import Ticket from '#models/tickets' // Asegúrate que la ruta sea correcta
import Usuario from '#models/usuarios' // Ruta correcta a tu modelo Usuario
import { DateTime } from 'luxon'

export default class DashboardController {
  public async index({ response }: HttpContext) {
    // La variable 'user' es null por defecto, ya que no estamos usando 'auth' para obtenerla aquí.
    // const user = null; // <- Esta línea ya no es necesaria si la lógica de tareas pendientes no lo usa.
    try {
      const ESTADO_ABIERTO_ID = 1
      const ESTADO_CERRADO_ID = 6
      // 'ESTADOS_PENDIENTES_PARA_TAREA' ha sido eliminada de aquí porque no se usa.

      // 1.1. Métricas de Tickets
      const ticketsAbiertosCount = await Ticket.query()
        .where('estadoId', ESTADO_ABIERTO_ID)
        .count('* as total')
      const totalTicketsAbiertos = ticketsAbiertosCount[0].$extras.total

      const treintaDiasAtras = DateTime.now().minus({ days: 30 })
      const ticketsCerradosMesCount = await Ticket.query()
        .where('estadoId', ESTADO_CERRADO_ID)
        .where('updatedAt', '>=', treintaDiasAtras.toSQL())
        .count('* as total')
      const totalTicketsCerradosMes = ticketsCerradosMesCount[0].$extras.total

      // 1.2. Métricas de Usuarios (Nuevos Usuarios)
      const inicioTrimestre = DateTime.now().startOf('quarter')
      const nuevosUsuariosCount = await Usuario.query()
        .where('createdAt', '>=', inicioTrimestre.toSQL())
        .count('* as total')
      const totalNuevosUsuarios = nuevosUsuariosCount[0].$extras.total

      // 1.3. Actividad Reciente (Últimos tickets)
      const actividadReciente = await Ticket.query()
        .preload('usuarioAsignado')
        .preload('estado')
        .preload('empresa')
        .orderBy('createdAt', 'desc')
        .limit(5)

      // =======================================================================
      // 'tareasPendientes' es un array vacío, ya que no depende de un usuario logueado.
      // =======================================================================
      const tareasPendientes: Ticket[] = []

      return response.ok({
        metrics: {
          ticketsAbiertos: totalTicketsAbiertos,
          ticketsCerradosMes: totalTicketsCerradosMes,
          nuevosUsuarios: totalNuevosUsuarios,
        },
        actividadReciente: actividadReciente.map((ticket) => ({
          id: ticket.id,
          titulo: ticket.titulo,
          estado: ticket.estado?.nombre,
          asignadoA: ticket.usuarioAsignado?.nombre,
          empresa: ticket.empresa?.nombre,
          evento: `Ticket #${ticket.id}: ${ticket.titulo} (Estado: ${ticket.estado?.nombre || 'Desconocido'})`,
          fecha: ticket.createdAt.toRelative(),
        })),
        // Si 'tareasPendientes' es un array vacío, este map simplemente devolverá un array vacío, lo cual es correcto.
        tareasPendientes: tareasPendientes.map((ticket) => ({
          id: ticket.id,
          titulo: ticket.titulo,
          prioridad: ticket.prioridad?.nombre,
          estado: ticket.estado?.nombre,
          vence: 'Por definir',
          detalle: `Vence: ${ticket.prioridad?.nombre || 'Sin Prioridad'}`,
        })),
      })
    } catch (error) {
      console.error('Error al obtener datos del dashboard:', error)
      return response.internalServerError('Error al obtener datos del dashboard')
    }
  }
}
