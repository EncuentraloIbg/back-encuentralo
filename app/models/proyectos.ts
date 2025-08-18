import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Empresa from './empresas.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Proyecto extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare empresa_id: number

  @belongsTo(() => Empresa, { foreignKey: 'empresa_id' })
  declare empresa: BelongsTo<typeof Empresa>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
