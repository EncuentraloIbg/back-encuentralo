import { BaseSeeder } from '@adonisjs/lucid/seeders'
import MotivoEstado from '#models/motivo_estado'

export default class MotivosEstadoSeeder extends BaseSeeder {
  public async run() {
    await MotivoEstado.updateOrCreateMany(
      ['estadoAplicable', 'nombre'],
      [
        { estadoAplicable: 'cancelada', nombre: 'Cliente no aprueba costo', activo: true },
        { estadoAplicable: 'cancelada', nombre: 'Retiro voluntario', activo: true },
        { estadoAplicable: 'cancelada', nombre: 'Otro', activo: true },
        { estadoAplicable: 'rechazada', nombre: 'Sin repuesto', activo: true },
        { estadoAplicable: 'rechazada', nombre: 'Irreparable', activo: true },
        { estadoAplicable: 'rechazada', nombre: 'No autoriza apertura', activo: true },
        { estadoAplicable: 'rechazada', nombre: 'Otro', activo: true },
      ]
    )
  }
}
