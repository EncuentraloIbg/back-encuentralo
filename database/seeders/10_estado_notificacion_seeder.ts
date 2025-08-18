import EstadoNotificacion from '#models/estados_notificacion'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await EstadoNotificacion.createMany([
      {
        nombre: 'Pendiente',
        descripcion: 'Notificación no leída',
      },
      {
        nombre: 'Leída',
        descripcion: 'Notificación vista por el usuario',
      },
      {
        nombre: 'Archivada',
        descripcion: 'Notificación archivada',
      },
      {
        nombre: 'Urgente',
        descripcion: 'Notificación que requiere atención inmediata',
      },
    ])
  }
}
