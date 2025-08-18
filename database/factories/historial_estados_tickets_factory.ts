import factory from '@adonisjs/lucid/factories'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import HistorialEstadosTicket from '#models/historial_estado_tickets'
import Ticket from '#models/tickets'
import Usuario from '#models/usuarios'
import EstadoTicket from '#models/estados_ticket'

export const HistorialEstadosTicketFactory = factory
  .define(HistorialEstadosTicket, async () => {
    const ticket = await Ticket.query().select('id').orderByRaw('RAND()').firstOrFail()
    const usuario = await Usuario.query().select('id').orderByRaw('RAND()').firstOrFail()
    const estado = await EstadoTicket.query().select('id').orderByRaw('RAND()').firstOrFail()

    return {
      ticketId: ticket.id,
      estadoId: estado.id,
      comentario: faker.lorem.sentence(),
      fechaCambio: DateTime.fromJSDate(faker.date.past()),
      usuarioId: usuario.id,
    }
  })
  .build()
