import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Usuario from '../models/usuarios.js'
import EstadoNotificacion from './estados_notificacion.js'

export default class Notificacion extends BaseModel {
  public static table = 'notificacions'
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titulo: string

  @column()
  declare mensaje: string

  @column()
  declare usuarioId: number

  @column()
  declare estadoId: number

  @column()
  declare ticketId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare leido: boolean

  @belongsTo(() => Usuario)
  declare usuario: BelongsTo<typeof Usuario>

  @belongsTo(() => EstadoNotificacion, {
    foreignKey: 'estadoId',
  })
  declare estado: BelongsTo<typeof EstadoNotificacion>
}
