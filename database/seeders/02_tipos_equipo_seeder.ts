import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TipoEquipo from '#models/tipo_equipo'

export default class TiposEquipoSeeder extends BaseSeeder {
  public async run() {
    await TipoEquipo.updateOrCreateMany('nombre', [
      { nombre: 'computador', activo: true },
      { nombre: 'portátil', activo: true },
      { nombre: 'all-in-one', activo: true },
      { nombre: 'celular', activo: true },
      { nombre: 'otro', activo: true },
    ])
  }
}
