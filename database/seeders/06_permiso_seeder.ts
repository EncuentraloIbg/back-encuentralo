import Permiso from '#models/permisos'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Opcional: Eliminar permisos existentes para asegurar que solo queden estos 4
    await Permiso.query().delete()

    await Permiso.createMany([
      { nombre: 'crear', descripcion: 'Permite crear nuevos registros' },
      { nombre: 'leer', descripcion: 'Permite leer registros existentes' },
      { nombre: 'actualizar', descripcion: 'Permite actualizar registros existentes' },
      { nombre: 'eliminar', descripcion: 'Permite eliminar registros' },
    ])
  }
}
