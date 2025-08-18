import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Servicio from '#models/servicios'

export default class ServicioSeeder extends BaseSeeder {
  public async run() {
    await Servicio.createMany([
      {
        id: 1,
        nombre: 'Soporte Técnico',
        descripcion: 'Servicio de soporte técnico para resolver incidencias y fallas',
        categoriaId: 1, // Hardware
      },
      {
        id: 2,
        nombre: 'Mantenimiento Preventivo',
        descripcion: 'Revisión y mantenimiento de equipos y sistemas para evitar fallas',
        categoriaId: 1, // Hardware
      },
      {
        id: 3,
        nombre: 'Desarrollo de Software',
        descripcion: 'Creación y mantenimiento de aplicaciones personalizadas',
        categoriaId: 2, // Software
      },
      {
        id: 4,
        nombre: 'Consultoría IT',
        descripcion: 'Asesoría en infraestructura y tecnología de la información',
        categoriaId: 3, // Redes
      },
      {
        id: 5,
        nombre: 'Capacitación',
        descripcion: 'Entrenamiento y formación en herramientas tecnológicas',
        categoriaId: 6, // Aplicaciones
      },
      {
        id: 6,
        nombre: 'Monitoreo de Sistemas',
        descripcion: 'Supervisión continua de sistemas y servidores críticos',
        categoriaId: 5, // Seguridad
      },
    ])
  }
}
