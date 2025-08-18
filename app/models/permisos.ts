import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

// ¡IMPORTACIONES CORREGIDAS CON ALIASES!
import Rol from '#models/roles'
import Item from '#models/items'

export default class Permiso extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare descripcion: string | null // Añadido para la descripción, si la usas

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relación a la tabla pivote 'rol_permiso_items'
  // Un Permiso puede estar en varias asignaciones de Rol-Permiso-Item
  @manyToMany(() => Rol, {
    pivotTable: 'rol_permiso_items', // Nombre correcto de la tabla pivote principal
    localKey: 'id',
    pivotForeignKey: 'permiso_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'rol_id',
  })
  declare roles: ManyToMany<typeof Rol>

  // Relación a la tabla pivote 'permisos_item'
  // Un Permiso puede estar asociado a varios Items (vistas)
  @manyToMany(() => Item, {
    pivotTable: 'permisos_item', // Nombre de la tabla pivote 'permisos_item'
    localKey: 'id',
    pivotForeignKey: 'permiso_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'item_id',
  })
  declare items: ManyToMany<typeof Item>
}
