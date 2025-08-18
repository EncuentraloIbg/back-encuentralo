// database/migrations/<timestamp>_create_empresas_table.ts
// (El nombre del archivo ya existente para tu tabla de empresas)

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'empresas'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre', 100).notNullable()
      table.string('nit', 50).notNullable().unique()
      table.string('correo', 150).notNullable()
      table.string('telefono', 50).notNullable()

      // *** AQUÍ SE AGREGA EL CAMPO 'estado' ***
      table.enum('estado', ['activo', 'inactivo']).defaultTo('activo').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
