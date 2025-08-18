import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'

import Proyecto from './proyectos.js'
import Usuario from './usuarios.js'

import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Empresa extends BaseModel {
  public static table = 'empresas' // Correcto, especifica explícitamente el nombre de la tabla

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare nit: string

  @column()
  declare correo: string

  @column()
  declare telefono: string

  // *** AQUÍ ESTÁ EL CAMPO 'estado' QUE FALTABA ***
  @column()
  declare estado: 'activo' | 'inactivo' // Define el tipo para los valores del ENUM

  @hasMany(() => Proyecto, {
    foreignKey: 'empresa_id',
    localKey: 'id',
  })
  declare proyectos: HasMany<typeof Proyecto>

  @hasMany(() => Usuario, {
    foreignKey: 'empresaId', // Asegúrate de que 'empresaId' es el nombre de la FK en la tabla de usuarios
    localKey: 'id',
  })
  declare usuarios: HasMany<typeof Usuario>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
