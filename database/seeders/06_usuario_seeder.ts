// database/seeders/06_usuarios_seeder.ts
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Usuario from '#models/usuario'
import RazonSocial from '#models/razon_social'

export default class UsuariosSeeder extends BaseSeeder {
  public async run() {
    // Asegúrate que el seeder de razones_sociales corra antes
    const oec = await RazonSocial.findByOrFail('nombre', 'Encuentralo.com')
    const ogc = await RazonSocial.findByOrFail('nombre', 'Mundosmartphone')

    // Limpia por si se corrió antes y quedó texto plano
    await Usuario.query().whereIn('correo', ['laura@example.com', 'miguelperez@gmail.com']).delete()

    // Crea con el MODELO → dispara hook: normaliza correo + hashea (scrypt)
    await Usuario.create({
      razonSocialId: oec.id,
      nombres: 'Laura',
      apellidos: 'González',
      telefono: '3001234567',
      correo: 'laura@example.com',
      password: '12345678', // el hook lo hashea con scrypt
      direccion: null,
      estado: 'activo',
    })

    await Usuario.create({
      razonSocialId: ogc.id,
      nombres: 'Miguel',
      apellidos: 'Pérez',
      telefono: '3007654321',
      correo: 'miguelperez@gmail.com',
      password: '123456789', // el hook lo hashea con scrypt
      direccion: null,
      estado: 'activo',
    })
  }
}
