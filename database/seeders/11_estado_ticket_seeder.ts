import EstadoTicket from '#models/estados_ticket'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await EstadoTicket.createMany([
      {
        nombre: 'Abierto',
        descripcion: 'Ticket recién creado, sin asignar',
      },
      {
        nombre: 'Asignado',
        descripcion: 'Ticket asignado a un técnico',
      },
      {
        nombre: 'En Progreso',
        descripcion: 'Técnico trabajando en la solución',
      },
      {
        nombre: 'En Espera',
        descripcion: 'Esperando respuesta del cliente',
      },
      {
        nombre: 'Resuelto',
        descripcion: 'Problema solucionado, pendiente de confirmación',
      },
      {
        nombre: 'Cerrado',
        descripcion: 'Ticket cerrado y confirmado por el cliente',
      },
      {
        nombre: 'Rechazado',
        descripcion: 'Ticket no válido o duplicado',
      },
    ])
  }
}
