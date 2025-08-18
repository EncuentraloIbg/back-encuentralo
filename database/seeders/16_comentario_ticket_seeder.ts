import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { ComentarioTicketFactory } from '#database/factories/comentarios_tickets_factory'

export default class ComentarioTicketSeeder extends BaseSeeder {
  public async run() {
    await ComentarioTicketFactory.createMany(100) // Puedes ajustar la cantidad
  }
}
