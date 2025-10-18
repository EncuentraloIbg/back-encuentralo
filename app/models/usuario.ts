// app/models/usuario.ts
import { DateTime } from 'luxon'
import Hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, hasMany, beforeSave } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import RazonSocial from '#models/razon_social'
import Orden from '#models/orden'
import OrdenHistorial from '#models/orden_historial'

// Auth por correo usando SIEMPRE scrypt
const AuthFinder = withAuthFinder(() => Hash.use('scrypt'), {
  uids: ['correo'],
  passwordColumnName: 'password',
})

export default class Usuario extends compose(BaseModel, AuthFinder) {
  public static table = 'usuarios'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'razon_social_id', serializeAs: 'razon_social_id' })
  declare razonSocialId: number

  @column()
  declare nombres: string

  @column()
  declare apellidos: string

  @column()
  declare correo: string

  @column({ serializeAs: null })
  declare password: string

  // ⬇️ Clave: exponer siempre avatar_url en snake_case
  @column({ columnName: 'avatar_url', serializeAs: 'avatar_url' })
  declare avatarUrl: string | null

  @column()
  declare telefono: string | null

  @column()
  declare direccion: string | null

  @column()
  declare estado: 'activo' | 'inactivo'

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  /** Relaciones */
  @belongsTo(() => RazonSocial, { foreignKey: 'razonSocialId' })
  declare razonSocial: BelongsTo<typeof RazonSocial>

  @hasMany(() => OrdenHistorial, { foreignKey: 'usuarioId' })
  declare historiales: HasMany<typeof OrdenHistorial>

  @hasMany(() => Orden, { foreignKey: 'cerradoPorUsuarioId' })
  declare ordenesCerradas: HasMany<typeof Orden>

  /** Hook: normaliza correo y hashea con scrypt */
  @beforeSave()
  public static async normalizeAndHash(user: Usuario) {
    if (user.$dirty.correo) user.correo = user.correo.trim().toLowerCase()
    if (user.$dirty.password) {
      const looksHashed = typeof user.password === 'string' && user.password.startsWith('$scrypt$')
      if (!looksHashed) user.password = await Hash.use('scrypt').make(user.password)
    }
  }

  /** Access Tokens (OAT) */
  public static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
