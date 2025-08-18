import factory from '@adonisjs/lucid/factories'
import Usuario from '#models/usuarios'
import { faker } from '@faker-js/faker'

export const UsuariosFactory = factory
  .define(Usuario, async () => {
    return {
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      telefono: '+573' + faker.string.numeric(8),
      correo: faker.internet.email(),
      password: '12345678', // Se encripta automáticamente con `withAuthFinder`
    }
  })
  .build()
