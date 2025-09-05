import { BaseSeeder } from '@adonisjs/lucid/seeders'
import MetodoPago from '#models/metodo_pago'

export default class MetodosPagoSeeder extends BaseSeeder {
  public async run() {
    await MetodoPago.updateOrCreateMany('nombre', [
      { nombre: 'efectivo', activo: true },
      { nombre: 'transferencia', activo: true },
      { nombre: 'tarjeta', activo: true },
      { nombre: 'otro', activo: true },
    ])
  }
}
