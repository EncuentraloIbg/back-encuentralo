import Empresas from '#models/empresas'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Empresas.createMany([
      {
        nombre: 'IngeniaCore Solutions',
        nit: '900123456-1',
        correo: 'contacto@ingeniacore.com',
        telefono: '3132247653',
      },
      {
        nombre: 'TechInnovate',
        nit: '901234567-2',
        correo: 'info@techinnovate.com',
        telefono: '3136537365',
      },
      {
        nombre: 'DigitalFuture',
        nit: '902345678-3',
        correo: 'soporte@digitalfuture.com',
        telefono: '3145423676',
      },
    ])
  }
}
