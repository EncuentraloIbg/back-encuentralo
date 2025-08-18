import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Usuario from './usuarios.js' // O la ruta correcta si usas alias (#models/usuario)
import Permiso from './permisos.js' // O la ruta correcta si usas alias (#models/permiso)

export default class Rol extends BaseModel {
  // ******************************************************
  // ¡CAMBIO CLAVE AQUÍ! Define el nombre real de la tabla en la DB
  public static table = 'roles' // <--- ¡AÑADIDO Y CORREGIDO A 'rols' (singular)!
  // ******************************************************

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare descripcion: string

  @column()
  // ¡ESTE ES EL CAMBIO CLAVE!
  // Ahora TypeScript sabe que 'estado' es una cadena que puede ser 'activo' o 'inactivo'.
  declare estado: 'activo' | 'inactivo'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @manyToMany(() => Usuario, {
    pivotTable: 'usuarios_roles',
  })
  declare usuarios: ManyToMany<typeof Usuario>

  @manyToMany(() => Permiso, {
    pivotTable: 'roles_permisos_item', // Este es el nombre de tu tabla de unión.
    // Asegúrate de que esta tabla exista y sea correcta.
    // Si tu tabla de unión es 'rol_permiso_items', entonces esto debería ser 'rol_permiso_items'
    // en lugar de 'roles_permisos_item'. ¡VERIFICA ESTO!
  })
  declare permisos: ManyToMany<typeof Permiso>
}
