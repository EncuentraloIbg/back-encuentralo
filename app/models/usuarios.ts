import { DateTime } from 'luxon'
import Hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

import Rol from './roles.js'
import Empresa from './empresas.js'

import type { BelongsTo } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => Hash.use('scrypt'), {
  uids: ['correo'],
  passwordColumnName: 'password',
})

export default class Usuario extends compose(BaseModel, AuthFinder) {
  public static table = 'usuarios'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare apellido: string

  @column()
  declare telefono: string

  @column()
  declare correo: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare foto_perfil: string | null

  // Clave foránea de rol
  @column({ columnName: 'rol_id' })
  declare rol_id: number | null

  @belongsTo(() => Rol, {
    foreignKey: 'rol_id',
  })
  declare rol: BelongsTo<typeof Rol>

  // Clave foránea de empresa
  @column({ columnName: 'empresa_id' })
  declare empresa_id: number | null

  @belongsTo(() => Empresa, {
    foreignKey: 'empresa_id',
  })
  declare empresa: BelongsTo<typeof Empresa>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(Usuario, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })
}
