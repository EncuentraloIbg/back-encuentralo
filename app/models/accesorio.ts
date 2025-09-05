// app/models/accesorio.ts
import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

import Orden from '#models/orden'

export default class Accesorio extends BaseModel {
  public static table = 'accesorios'
  public static primaryKey = 'id'

  @column({ isPrimary: true })
  declare public id: number

  @column()
  declare public nombre: string

  @column()
  declare public activo: boolean

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare public updatedAt: DateTime

  /** Relaciones */

  @manyToMany(() => Orden, {
    pivotTable: 'orden_accesorios',
    localKey: 'id',
    pivotForeignKey: 'accesorio_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'orden_id',
  })
  declare public ordenes: ManyToMany<typeof Orden>
}
