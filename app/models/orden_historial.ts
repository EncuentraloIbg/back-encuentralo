// app/models/orden_historial.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import Orden, * as orden from '#models/orden'
import MotivoEstado from '#models/motivo_estado'

export default class OrdenHistorial extends BaseModel {
  public static table = 'orden_historial'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  @column({ columnName: 'orden_id' })
  declare public ordenId: number

  // 'recibido' | 'entregado' | 'cancelada' | 'rechazada'
  @column()
  declare public estado: orden.OrdenEstado

  // Catálogo (solo aplica en cancelada/rechazada)
  @column({ columnName: 'motivo_estado_id' })
  declare public motivoEstadoId: number | null

  // Texto libre si no se usa catálogo
  @column({ columnName: 'motivo_texto' })
  declare public motivoTexto: string | null

  // Auditoría: usuario que hizo el cambio (si aplica)
  @column({ columnName: 'usuario_id' })
  declare public usuarioId: number | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare public updatedAt: DateTime

  /** Relaciones */
  @belongsTo(() => Orden, { foreignKey: 'ordenId' })
  declare public orden: BelongsTo<typeof Orden>

  @belongsTo(() => MotivoEstado, { foreignKey: 'motivoEstadoId' })
  declare public motivoEstado: BelongsTo<typeof MotivoEstado>

  // Si luego agregas usuarios:
  // @belongsTo(() => Usuario, { foreignKey: 'usuarioId' })
  // declare public usuario: BelongsTo<typeof Usuario>
}
