// app/models/orden_accesorio.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Orden from '#models/orden'
import Accesorio from '#models/accesorio'

export default class OrdenAccesorio extends BaseModel {
  public static table = 'orden_accesorios'
  public static primaryKey = 'id' // si tu pivote usa PK compuesta, lo ajustamos

  @column({ isPrimary: true })
  declare public id: number

  @column({ columnName: 'orden_id' })
  declare public ordenId: number

  @column({ columnName: 'accesorio_id' })
  declare public accesorioId: number

  @column()
  declare public detalle: string | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare public updatedAt: DateTime

  /** Relaciones explícitas (útil para consultas directas al pivote) */
  @belongsTo(() => Orden, { foreignKey: 'ordenId' })
  declare public orden: BelongsTo<typeof Orden>

  @belongsTo(() => Accesorio, { foreignKey: 'accesorioId' })
  declare public accesorio: BelongsTo<typeof Accesorio>
}
