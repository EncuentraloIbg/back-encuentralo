// app/models/tipo_equipo.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Equipo from '#models/equipo'

export default class TipoEquipo extends BaseModel {
  public static table = 'tipos_equipo'
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

  @hasMany(() => Equipo, { foreignKey: 'tipoEquipoId' })
  declare public equipos: HasMany<typeof Equipo>
}
