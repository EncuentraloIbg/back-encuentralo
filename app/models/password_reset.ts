// app/models/password_reset.ts
import { DateTime } from 'luxon'
import { BaseModel, column, computed, beforeSave } from '@adonisjs/lucid/orm'

export default class PasswordReset extends BaseModel {
  public static table = 'password_resets'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public correo: string

  // No exponer el token en respuestas JSON
  @column({ serializeAs: null })
  declare public token: string

  // DB: expires_at → Modelo: expiresAt
  @column.dateTime({ columnName: 'expires_at' })
  declare public expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  /** Normaliza el correo */
  @beforeSave()
  public static normalizeEmail(reset: PasswordReset) {
    if (reset.$dirty.correo) {
      reset.correo = reset.correo.trim().toLowerCase()
    }
  }

  /** ¿Ya expiró? (útil para checks rápidos) */
  @computed()
  public get isExpired(): boolean {
    return !this.expiresAt || this.expiresAt <= DateTime.now()
  }

  /** Busca un token válido (no expirado) */
  public static async findValidByToken(token: string) {
    return this.query()
      .where('token', token)
      .andWhere('expires_at', '>', DateTime.now().toJSDate())
      .first()
  }

  /** Invalida el token (borra el registro) */
  public async consume() {
    await this.delete()
  }
}
