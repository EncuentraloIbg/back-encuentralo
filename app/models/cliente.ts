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
  declare id: number

  @column({ columnName: 'razon_social_id' })
  declare razonSocialId: number

  // 🔹 Campos esperados por el controlador
  @column()
  declare nombre: string

  @column()
  declare documento: string

  @column()
  declare telefono: string

  @column()
  declare correo: string | null

  @column({ columnName: 'whatsapp_opt_in' })
  declare whatsappOptIn: boolean

  @column()
  declare direccion: string | null

  @column({ columnName: 'tipo_cliente' })
  declare tipoCliente: 'persona' | 'empresa' | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  /** Relaciones */
  @belongsTo(() => RazonSocial, { foreignKey: 'razonSocialId' })
  declare razonSocial: BelongsTo<typeof RazonSocial>

  @hasMany(() => Equipo, { foreignKey: 'clienteId' })
  declare equipos: HasMany<typeof Equipo>

  @hasMany(() => Orden, { foreignKey: 'clienteId' })
  declare ordenes: HasMany<typeof Orden>
}
