import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { HistorialEstadosTicketFactory } from '#database/factories/historial_estados_tickets_factory'

export default class HistorialEstadoTicketSeeder extends BaseSeeder {
  public async run() {
    await HistorialEstadosTicketFactory.createMany(100) // Puedes ajustar la cantidad
  }
}
