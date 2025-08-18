import { DateTime } from 'luxon'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import { BaseModel, column, hasMany, belongsTo, manyToMany } from '@adonisjs/lucid/orm'
import Permiso from '../models/permisos.js'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare url: string

  @column()
  declare icon: string

  @column()
  declare parentId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Item, {
    foreignKey: 'parentId',
  })
  declare padre: BelongsTo<typeof Item>

  @hasMany(() => Item, {
    foreignKey: 'parentId',
  })
  declare hijos: HasMany<typeof Item>

  @manyToMany(() => Permiso, {
    pivotTable: 'permisos_item',
  })
  declare permisos: ManyToMany<typeof Permiso>
}
