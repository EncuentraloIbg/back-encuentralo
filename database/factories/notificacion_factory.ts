import factory from '@adonisjs/lucid/factories'
import { faker } from '@faker-js/faker'
import Notificacion from '#models/notificaciones'
import Usuario from '#models/usuarios'
import EstadoNotificacion from '#models/estados_notificacion'

export const NotificacionFactory = factory
  .define(Notificacion, async () => {
    const usuario = await Usuario.query().select('id').orderByRaw('RAND()').firstOrFail()
    const estado = await EstadoNotificacion.query().select('id').orderByRaw('RAND()').firstOrFail()

    return {
      titulo: faker.lorem.words(5),
      mensaje: faker.lorem.sentences(2),
      usuarioId: usuario.id,
      estadoId: estado.id,
      leido: faker.datatype.boolean(),
    }
  })
  .build()
