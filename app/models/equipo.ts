// app/models/equipo.ts
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
  declare id: number

  @column({ columnName: 'cliente_id' })
  declare clienteId: number

  @column({ columnName: 'tipo_equipo_id' })
  declare tipoEquipoId: number

  @column()
  declare marca: string

  @column()
  declare modelo: string

  @column({ columnName: 'serie_imei' })
  declare serieImei: string

  // Extras opcionales
  @column({ columnName: 'so_version' })
  declare soVersion: string | null

  @column({ columnName: 'ram_gb' })
  declare ramGb: number | null

  @column({ columnName: 'disco_gb' })
  declare discoGb: number | null

  // Campo libre usado por el controlador / UI
  @column()
  declare specs: string | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  /** Relaciones */
  @belongsTo(() => Cliente, { foreignKey: 'clienteId' })
  declare cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => TipoEquipo, { foreignKey: 'tipoEquipoId' })
  declare tipoEquipo: BelongsTo<typeof TipoEquipo>

  @hasMany(() => Orden, { foreignKey: 'equipoId' })
  declare ordenes: HasMany<typeof Orden>
}
