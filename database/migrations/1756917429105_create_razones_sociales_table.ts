import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RazonesSociales extends BaseSchema {
  protected tableName = 'razones_sociales'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nombre', 120).notNullable()
      table.string('prefijo_orden', 10).notNullable()
      table.boolean('activo').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
