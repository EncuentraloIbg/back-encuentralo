import Categoria from '#models/categorias'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Categoria.createMany([
      { nombre: 'Hardware' },
      { nombre: 'Software' },
      { nombre: 'Redes' },
      { nombre: 'Base de datos' },
      { nombre: 'Seguridad' },
      { nombre: 'Aplicaciones' },
    ])
  }
}
