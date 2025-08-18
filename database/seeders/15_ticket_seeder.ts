import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { TicketFactory } from '#database/factories/tickets_factory'

export default class TicketSeeder extends BaseSeeder {
  public async run() {
    await TicketFactory.createMany(50) // ajusta según lo que necesites
  }
}
