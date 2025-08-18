import factory from '@adonisjs/lucid/factories'
import { faker } from '@faker-js/faker'
import UsuariosRol from '#models/usuarios_roles'

let usuarioRolId = 1

export const UsuariosRolFactory = factory
  .define(UsuariosRol, async () => {
    usuarioRolId++
    const isFirst70 = usuarioRolId <= 70

    return {
      usuarioId: usuarioRolId,
      rolId: isFirst70 ? 4 : faker.number.int({ min: 1, max: 3 }),
    }
  })
  .build()
