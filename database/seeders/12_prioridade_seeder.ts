import Prioridad from '#models/prioridades'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Prioridad.createMany([
      {
        nombre: 'critica',
        descripcion: 'impacto inmediato en operaciones criticas',
        nivel: '1',
      },
      {
        nombre: 'Alta',
        descripcion: 'Problema serio que afecta multiples usuarios',
        nivel: '2',
      },
      {
        nombre: 'Media',
        descripcion: 'Problema que afecta la productividad',
        nivel: '3',
      },
      {
        nombre: 'Baja',
        descripcion: 'Problema menor o solicitud de mejora',
        nivel: '4',
      },
    ])
  }
}
