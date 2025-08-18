import roles from '#models/roles'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await roles.createMany([
      {
        nombre: 'Administrador',
        descripcion:
          'Encargado de la configuración general del sistema y gestión de usuarios, roles y permisos.',
        estado: 'activo',
      },
      {
        nombre: 'Gerente de soporte',
        descripcion:
          'Responsable de supervisar los tickets,coordinar al equipo técnico y garantizar una atención eficiente al cliente.',
        estado: 'activo',
      },
      {
        nombre: 'Técnico de soporte',
        descripcion:
          'Encargado de resolver incidencias técnicas reportadas por los usuarios, brindando soluciones oportunas.',
        estado: 'activo',
      },
      {
        nombre: 'Usuario Empresa',
        descripcion:
          'Usuario que reporta incidencias o solicita asistencia técnica sobre los servicios contratados.',
        estado: 'activo',
      },
      {
        nombre: 'Empresa Admin',
        descripcion:
          'Representa una organización cliente que contrata servicios de soporte técnico.',
        estado: 'activo',
      },
    ])
  }
}
