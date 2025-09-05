import { BaseSeeder } from '@adonisjs/lucid/seeders'
import RazonSocial from '#models/razon_social'

export default class RazonesSocialesSeeder extends BaseSeeder {
  public async run() {
    await RazonSocial.updateOrCreateMany('nombre', [
      { nombre: 'Encuentralo.com', prefijoOrden: 'OEC', activo: true },
      { nombre: 'Mundosmartphone', prefijoOrden: 'OGC', activo: true },
    ])
  }
}
