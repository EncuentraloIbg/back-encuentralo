import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { UsuariosRolFactory } from '#database/factories/usuarios_rol_factory'

export default class UsuarioRolSeeder extends BaseSeeder {
  public async run() {
    await UsuariosRolFactory.createMany(99)
  }
}
