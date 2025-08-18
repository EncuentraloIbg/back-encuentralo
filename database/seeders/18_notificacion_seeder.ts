import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { NotificacionFactory } from '#database/factories/notificacion_factory'

export default class NotificacionSeeder extends BaseSeeder {
  public async run() {
    await NotificacionFactory.createMany(50)
  }
}
