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
  declare id: number

  @column()
  declare nombre: string

  @column({ columnName: 'prefijo_orden', serializeAs: 'prefijo_orden' })
  declare prefijoOrden: string

  @column()
  declare activo: boolean

  // ---- Perfil / branding ----
  @column({ columnName: 'avatar_url', serializeAs: 'avatar_url' })
  declare avatarUrl: string | null

  @column({ columnName: 'banner_url', serializeAs: 'banner_url' })
  declare bannerUrl: string | null

  @column()
  declare telefono: string | null

  @column()
  declare correo: string | null

  @column()
  declare direccion: string | null

  @column({ columnName: 'sitio_web', serializeAs: 'sitio_web' })
  declare sitioWeb: string | null

  @column({ columnName: 'color_hex', serializeAs: 'color_hex' })
  declare colorHex: string | null

  @column()
  declare descripcion: string | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  @hasMany(() => Cliente, { foreignKey: 'razonSocialId' })
  declare clientes: HasMany<typeof Cliente>

  @hasMany(() => Orden, { foreignKey: 'razonSocialId' })
  declare ordenes: HasMany<typeof Orden>
}
