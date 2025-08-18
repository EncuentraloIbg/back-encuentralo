import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Notificacion from '../models/notificaciones.js'

export default class EstadoNotificacion extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare descripcion: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoUpdate: true, autoCreate: true })
  declare updatedAt: DateTime

  @hasMany(() => Notificacion, {
    foreignKey: 'estadoId',
  })
  declare notificaciones: HasMany<typeof Notificacion>
}
