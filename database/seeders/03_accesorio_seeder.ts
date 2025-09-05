import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Accesorio from '#models/accesorio'

export default class AccesoriosSeeder extends BaseSeeder {
  public async run() {
    await Accesorio.updateOrCreateMany('nombre', [
      { nombre: 'cargador', activo: true },
      { nombre: 'cable', activo: true },
      { nombre: 'mouse', activo: true },
      { nombre: 'teclado', activo: true },
      { nombre: 'maletín', activo: true },
      { nombre: 'funda', activo: true },
      { nombre: 'otro', activo: true },
    ])
  }
}
