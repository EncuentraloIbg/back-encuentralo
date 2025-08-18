import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notificacions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('titulo', 255)
      table.text('mensaje')
      table
        .integer('usuario_id')
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table
        .integer('estado_id')
        .unsigned()
        .references('id')
        .inTable('estado_notificacions')
        .onDelete('CASCADE')

      table.integer('ticket_id').unsigned().references('id').inTable('tickets').onDelete('CASCADE')

      table.boolean('leido').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('ticket_id')
    })
  }
}
