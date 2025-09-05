import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

import Cliente from '#models/cliente'
import TipoEquipo from '#models/tipo_equipo'
import Orden from '#models/orden'

export default class Equipo extends BaseModel {
  public static table = 'equipos'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  @column({ columnName: 'cliente_id' })
  declare public clienteId: number

  @column({ columnName: 'tipo_equipo_id' })
  declare public tipoEquipoId: number

  @column()
  declare public marca: string

  @column()
  declare public modelo: string

  @column({ columnName: 'serie_imei' })
  declare public serieImei: string

  @column()
  declare public specs: string | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare public updatedAt: DateTime

  /** Relaciones */

  @belongsTo(() => Cliente, { foreignKey: 'clienteId' })
  declare public cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => TipoEquipo, { foreignKey: 'tipoEquipoId' })
  declare public tipoEquipo: BelongsTo<typeof TipoEquipo>

  @hasMany(() => Orden, { foreignKey: 'equipoId' })
  declare public ordenes: HasMany<typeof Orden>
}
