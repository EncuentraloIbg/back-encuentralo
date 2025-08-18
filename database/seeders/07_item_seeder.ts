//import db from '@adonisjs/lucid/services/db' // Importa el servicio de base de datos
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Item from '#models/items'

export default class ItemSeeder extends BaseSeeder {
  async run() {
    await Item.createMany([
      {
        nombre: 'Dashboard',
        url: '/dashboard',
        icon: 'mdi-view-dashboard',
      },

      // Configuración (items)
      {
        nombre: 'Perfil',
        url: '/profile',
        icon: 'mdi-account',
      },
      {
        nombre: 'Roles',
        url: '/roles-crud',
        icon: 'mdi-account-cog',
      },
      {
        nombre: 'Permisos',
        url: '/permisos',
        icon: 'mdi-shield-account',
      },

      // Tickets
      {
        nombre: 'Crear Ticket',
        url: '/tickets',
        icon: 'mdi-ticket-confirmation',
      },
      {
        nombre: 'Historial Tickets',
        url: '/historial-tickets',
        icon: 'mdi-history',
      },

      // Otros items
      {
        nombre: 'Usuarios',
        url: '/Usuarios',
        icon: 'mdi-account-multiple',
      },
      {
        nombre: 'Empresas',
        url: '/formulario-empresas',
        icon: 'mdi-domain',
      },
      {
        nombre: 'Proyectos',
        url: '/proyectos',
        icon: 'mdi-folder-multiple',
      },
      {
        nombre: 'Notificaciones',
        url: '/Notificaciones',
        icon: 'mdi-bell',
      },
    ])
  }
}
