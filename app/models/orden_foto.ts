// app/models/orden_foto.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Orden from '#models/orden'

export default class OrdenFoto extends BaseModel {
  public static table = 'orden_fotos'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  @column({ columnName: 'orden_id' })
  declare public ordenId: number

  @column()
  declare public url: string

  @column()
  declare public descripcion: string | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare public updatedAt: DateTime

  /** Relaciones */
  @belongsTo(() => Orden, { foreignKey: 'ordenId' })
  declare public orden: BelongsTo<typeof Orden>
}
