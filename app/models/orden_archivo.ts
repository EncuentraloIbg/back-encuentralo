// app/models/orden_archivo.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Orden from '#models/orden'

export default class OrdenArchivo extends BaseModel {
  public static table = 'orden_archivos'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  @column({ columnName: 'orden_id' })
  declare public ordenId: number

  @column()
  declare public url: string

  @column({ columnName: 'nombre_archivo' })
  declare public nombreArchivo: string

  @column()
  declare public tipo: string

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare public updatedAt: DateTime

  /** Relaciones */
  @belongsTo(() => Orden, { foreignKey: 'ordenId' })
  declare public orden: BelongsTo<typeof Orden>
}
