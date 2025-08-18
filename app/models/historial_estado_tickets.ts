import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Ticket from '../models/tickets.js'
import EstadoTicket from '../models/estados_ticket.js'
import Usuario from '../models/usuarios.js'

export default class HistorialEstadosTicket extends BaseModel {
  public static table = 'historial_estado_tickets'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ticketId: number

  @column()
  declare estadoId: number

  @column()
  declare comentario: string

  @column.dateTime({ autoCreate: true })
  declare fechaCambio: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare usuarioId: number

  @belongsTo(() => Ticket)
  declare ticket: BelongsTo<typeof Ticket>

  @belongsTo(() => EstadoTicket, { foreignKey: 'estadoId' }) // ✅ CORREGIDO
  declare estado: BelongsTo<typeof EstadoTicket>

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>
}
