import { BaseSchema } from '@adonisjs/lucid/schema'

export default class MetodosPago extends BaseSchema {
  protected tableName = 'metodos_pago'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nombre', 40).notNullable().unique()
      table.boolean('activo').notNullable().defaultTo(true)

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
