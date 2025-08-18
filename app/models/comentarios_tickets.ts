import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from '../models/usuarios.js'
import Ticket from '../models/tickets.js'

export default class ComentarioTicket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare comentario: string

  @column()
  declare ticketId: number

  @column()
  declare usuarioId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Ticket)
  declare ticket: BelongsTo<typeof Ticket>

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>
}
