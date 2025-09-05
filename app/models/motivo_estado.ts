// app/models/motivo_estado.ts
import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import Orden from '#models/orden'
import OrdenHistorial from '#models/orden_historial'

export default class MotivoEstado extends BaseModel {
  public static table = 'motivos_estado'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  // Estado al que aplica: 'cancelada' | 'rechazada'
  @column({ columnName: 'estado_aplicable' })
  declare public estadoAplicable: 'cancelada' | 'rechazada'

  @column()
  declare public nombre: string

  @column()
  declare public activo: boolean

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare public updatedAt: DateTime

  /** Relaciones */

  @hasMany(() => Orden, {
    foreignKey: 'motivoEstadoId', // DB: motivo_estado_id
  })
  declare public ordenes: HasMany<typeof Orden>

  @hasMany(() => OrdenHistorial, {
    foreignKey: 'motivoEstadoId',
  })
  declare public historiales: HasMany<typeof OrdenHistorial>
}
