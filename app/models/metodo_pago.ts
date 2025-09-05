// app/models/metodo_pago.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Orden from '#models/orden'

export default class MetodoPago extends BaseModel {
  public static table = 'metodos_pago'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public nombre: string

  @column()
  declare public activo: boolean

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare public updatedAt: DateTime

  /** Relaciones */
  @hasMany(() => Orden, { foreignKey: 'metodoPagoId' })
  declare public ordenes: HasMany<typeof Orden>
}
