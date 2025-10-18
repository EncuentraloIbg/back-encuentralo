// database/seeders/06_usuarios_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Usuario from '#models/usuario'
import RazonSocial from '#models/razon_social'

export default class UsuariosSeeder extends BaseSeeder {
  public async run() {
    const oec = await RazonSocial.findByOrFail('nombre', 'Encuentralo.com')
    const ogc = await RazonSocial.findByOrFail('nombre', 'Mundosmartphone')

    await Usuario.query()
      .whereIn('correo', ['encuentralo@demo.com', 'mundosmartphone@demo.com'])
      .delete()

    await Usuario.createMany([
      {
        razonSocialId: oec.id,
        nombres: 'Encuentralo',
        apellidos: '',
        telefono: '3000000001',
        correo: 'encuentralo@demo.com',
        password: '12345678',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        direccion: null,
        estado: 'activo',
      },
      {
        razonSocialId: ogc.id,
        nombres: 'Mundosmartphone',
        apellidos: '',
        telefono: '3000000002',
        correo: 'mundosmartphone@demo.com',
        password: '12345678',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        direccion: null,
        estado: 'activo',
      },
    ])
  }
}
