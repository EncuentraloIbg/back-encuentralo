// app/models/razon_social.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Cliente from '#models/cliente'
import Orden from '#models/orden'

export default class RazonSocial extends BaseModel {
  public static table = 'razones_sociales'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public nombre: string

  @column({ columnName: 'prefijo_orden' })
  declare public prefijoOrden: string

  @column()
  declare public activo: boolean

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  /** Relaciones */
  @hasMany(() => Cliente, {
    foreignKey: 'razonSocialId', // DB: razon_social_id
  })
  declare public clientes: HasMany<typeof Cliente>

  @hasMany(() => Orden, {
    foreignKey: 'razonSocialId',
  })
  declare public ordenes: HasMany<typeof Orden>
}
