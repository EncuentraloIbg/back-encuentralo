import factory from '@adonisjs/lucid/factories'
import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import Ticket from '#models/tickets'
import Usuario from '#models/usuarios'
import Categoria from '#models/categorias'
import Servicio from '#models/servicios'
import EstadoTicket from '#models/estados_ticket'
import Prioridad from '#models/prioridades'
import Empresa from '#models/empresas'

export const TicketFactory = factory
  .define(Ticket, async () => {
    const creador = await Usuario.query().select('id').orderByRaw('RAND()').firstOrFail()
    const usuarioAsignado = await Usuario.query().select('id').orderByRaw('RAND()').firstOrFail()
    const categoria = await Categoria.query().select('id').orderByRaw('RAND()').firstOrFail()
    const empresa = await Empresa.query().select('id').orderByRaw('RAND()').firstOrFail() // Asumiendo que 'empresa' es un usuario
    const servicio = await Servicio.query().select('id').orderByRaw('RAND()').firstOrFail()
    const estado = await EstadoTicket.query().select('id').orderByRaw('RAND()').firstOrFail()
    const prioridad = await Prioridad.query().select('id').orderByRaw('RAND()').firstOrFail()

    return {
      titulo: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      estadoId: estado.id,
      prioridadId: prioridad.id,
      usuarioAsignadoId: usuarioAsignado.id,
      categoriaId: categoria.id,
      empresasId: empresa.id,
      servicioId: servicio.id,
      creadorId: creador.id,
      fechaAsignacion: DateTime.fromJSDate(faker.date.recent()), // ✅ FIX aquí
    }
  })
  .build()
