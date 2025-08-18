// app/Models/roles_permisos_item.ts  <- ¡IMPORTANTE: Renombra tu archivo a esto!

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Rol from '#models/roles'
import Permiso from '#models/permisos'
import Item from '#models/items'

export default class RolesPermisosItem extends BaseModel {
  public static table = 'rol_permiso_items'

  // CLAVE PRIMARIA SIMPLE (ID autoincrementable):
  // Es más flexible y compatible con itemId nullable.
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare rolId: number

  @column()
  declare permisoId: number

  @column({ serializeAs: null }) // Permite que itemId sea nulo
  declare itemId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // RELACIONES:
  @belongsTo(() => Rol, {
    foreignKey: 'rolId',
    localKey: 'id',
  })
  declare rol: BelongsTo<typeof Rol>

  @belongsTo(() => Permiso, {
    foreignKey: 'permisoId',
  })
  declare permiso: BelongsTo<typeof Permiso>

  @belongsTo(() => Item, {
    foreignKey: 'itemId',
    localKey: 'id',
  })
  declare item: BelongsTo<typeof Item>
}
