import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Comentario from '../models/comentarios_tickets.js'
import Usuario from '../models/usuarios.js'
import Categoria from '../models/categorias.js'
import Servicio from '../models/servicios.js'
import EstadoTicket from '../models/estados_ticket.js'
import Prioridad from '../models/prioridades.js'
import Empresa from '../models/empresas.js'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare titulo: string

  @column()
  declare descripcion: string

  @column()
  declare estadoId: number

  @column()
  declare prioridadId: number

  @column()
  declare empresasId: number

  @column()
  declare usuarioAsignadoId: number | null

  @column()
  declare categoriaId: number

  @column()
  declare servicioId: number

  @column()
  declare creadorId: number // La columna en la DB es 'creador_id'

  @column()
  declare nombreArchivo: string | null // Para almacenar el nombre del archivo adjunto

  @column.dateTime({ autoCreate: true })
  declare fechaAsignacion: DateTime | null

  @column.dateTime()
  declare fechaFinalizacion: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Usuario, { foreignKey: 'usuarioAsignadoId' })
  declare usuarioAsignado: BelongsTo<typeof Usuario>

  @belongsTo(() => Usuario, { foreignKey: 'creadorId' }) // Usa 'creadorId' para la clave foránea
  declare creador: BelongsTo<typeof Usuario> // Nombre de la relación para acceder al usuario creador

  @belongsTo(() => Categoria)
  declare categoria: BelongsTo<typeof Categoria>

  @belongsTo(() => Servicio)
  declare servicio: BelongsTo<typeof Servicio>

  @belongsTo(() => EstadoTicket, { foreignKey: 'estadoId' })
  declare estado: BelongsTo<typeof EstadoTicket>

  @belongsTo(() => Prioridad)
  declare prioridad: BelongsTo<typeof Prioridad>

  @belongsTo(() => Empresa, { foreignKey: 'empresasId' })
  declare empresa: BelongsTo<typeof Empresa>

  @hasMany(() => Comentario)
  declare comentarios: HasMany<typeof Comentario>
}
