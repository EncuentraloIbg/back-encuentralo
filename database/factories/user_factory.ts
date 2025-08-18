// database/factories/UserFactory.ts
import Factory from '@adonisjs/lucid/factories'
import Usuario from '#models/usuarios'
import hash from '@adonisjs/core/services/hash'

export const UserFactory = Factory.define(Usuario, async ({ faker }) => {
  // Ojo: Asegúrate de que tu modelo Usuario tiene rolId: number | null
  // Y que tu tabla usuarios tiene una columna rol_id
  return {
    nombre: faker.person.firstName(),
    apellido: faker.person.lastName(),
    telefono: faker.phone.number(),
    correo: faker.internet.email(),
    password: await hash.make('password'), // Contraseña por defecto para pruebas
    rolId: faker.helpers.arrayElement([1, 2]), // Asigna un ID de rol existente (1 para Admin, 2 para Usuario)
                                            // Asegúrate de que estos IDs existan en tu seeder de roles
  }
}).build()