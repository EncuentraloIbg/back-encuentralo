import { UsuariosFactory } from '#database/factories/usuarios_factory'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Usuario from '#models/usuarios'

export default class UsuarioSeeder extends BaseSeeder {
  public async run() {
    await Usuario.query().delete()

    await Usuario.createMany([
      {
        nombre: 'Laura',
        apellido: 'González',
        telefono: '3001234567',
        correo: 'laura@example.com',
        password: '12345678',
      },
      {
        nombre: 'Miguel',
        apellido: 'Pérez',
        telefono: '3007654321',
        correo: 'miguelperez@gmail.com',
        password: '123456789',
      },
    ])

    await UsuariosFactory.createMany(99)
  }
}
