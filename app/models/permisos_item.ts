import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

// ¡IMPORTACIONES CORREGIDAS CON ALIASES!
import Permiso from '#models/permisos'
import Item from '#models/items'

export default class PermisoItem extends BaseModel {
  public static table = 'permisos_item'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare permisoId: number

  @column()
  declare itemId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Permiso, {
    foreignKey: 'permisoId',
  })
  declare permiso: BelongsTo<typeof Permiso>

  @belongsTo(() => Item, {
    foreignKey: 'itemId',
  })
  declare item: BelongsTo<typeof Item>
}
