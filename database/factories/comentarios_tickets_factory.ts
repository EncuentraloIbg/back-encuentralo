import factory from '@adonisjs/lucid/factories'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import ComentarioTicket from '#models/comentarios_tickets'
import Ticket from '#models/tickets'
import Usuario from '#models/usuarios'

export const ComentarioTicketFactory = factory
  .define(ComentarioTicket, async () => {
    const ticket = await Ticket.query().select('id').orderByRaw('RAND()').firstOrFail()
    const usuario = await Usuario.query().select('id').orderByRaw('RAND()').firstOrFail()

    return {
      comentario: faker.lorem.sentences({ min: 1, max: 3 }),
      ticketId: ticket.id,
      usuarioId: usuario.id,
      createdAt: DateTime.fromJSDate(faker.date.past()),
      updatedAt: DateTime.fromJSDate(faker.date.recent()),
    }
  })
  .build()
