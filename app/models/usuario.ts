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

// Auth por correo usando SIEMPRE el driver scrypt
const AuthFinder = withAuthFinder(() => Hash.use('scrypt'), {
  uids: ['correo'],
  passwordColumnName: 'password',
})

export default class Usuario extends compose(BaseModel, AuthFinder) {
  public static table = 'usuarios'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  @column({ columnName: 'razon_social_id' })
  declare public razonSocialId: number

  @column()
  declare public nombres: string

  @column()
  declare public apellidos: string

  @column()
  declare public correo: string

  @column({ serializeAs: null })
  declare public password: string

  @column()
  declare public telefono: string | null

  @column()
  declare public direccion: string | null

  @column()
  declare public estado: 'activo' | 'inactivo'

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  /** Relaciones */
  @belongsTo(() => RazonSocial, { foreignKey: 'razonSocialId' })
  declare public razonSocial: BelongsTo<typeof RazonSocial>

  @hasMany(() => OrdenHistorial, { foreignKey: 'usuarioId' })
  declare public historiales: HasMany<typeof OrdenHistorial>

  @hasMany(() => Orden, { foreignKey: 'cerradoPorUsuarioId' })
  declare public ordenesCerradas: HasMany<typeof Orden>

  /** Hook: normaliza correo y hashea con scrypt (evita doble-hash) */
  @beforeSave()
  public static async normalizeAndHash(user: Usuario) {
    if (user.$dirty.correo) {
      user.correo = user.correo.trim().toLowerCase()
    }
    if (user.$dirty.password) {
      const looksHashed = typeof user.password === 'string' && user.password.startsWith('$scrypt$')
      if (!looksHashed) {
        user.password = await Hash.use('scrypt').make(user.password)
      }
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
