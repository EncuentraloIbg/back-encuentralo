import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ProyectoFactory } from '#database/factories/proyecto_factory'

export default class ProyectoSeeder extends BaseSeeder {
  public async run() {
    await ProyectoFactory.createMany(30) // Ajusta el número si necesitas más
  }
}
