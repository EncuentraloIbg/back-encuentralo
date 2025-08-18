import factory from '@adonisjs/lucid/factories'
import { faker } from '@faker-js/faker'
import Proyecto from '#models/proyectos'

export const ProyectoFactory = factory
  .define(Proyecto, async () => {
    return {
      nombre: faker.company.name(),
    }
  })
  .build()
