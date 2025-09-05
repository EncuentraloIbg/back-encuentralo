// app/models/cliente.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import RazonSocial from '#models/razon_social'
import Equipo from '#models/equipo'
import Orden from '#models/orden'

export default class Cliente extends BaseModel {
  public static table = 'clientes'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  @column({ columnName: 'razon_social_id' })
  declare public razonSocialId: number

  @column()
  declare public nombre: string

  @column()
  declare public documento: string

  @column()
  declare public telefono: string

  @column()
  declare public correo: string

  @column({ columnName: 'whatsapp_opt_in' })
  declare public whatsappOptIn: boolean

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare public updatedAt: DateTime

  /** Relaciones */

  @belongsTo(() => RazonSocial, { foreignKey: 'razonSocialId' })
  declare public razonSocial: BelongsTo<typeof RazonSocial>

  @hasMany(() => Equipo, { foreignKey: 'clienteId' })
  declare public equipos: HasMany<typeof Equipo>

  @hasMany(() => Orden, { foreignKey: 'clienteId' })
  declare public ordenes: HasMany<typeof Orden>
}
