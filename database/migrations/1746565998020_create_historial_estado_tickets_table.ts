import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'historial_estado_tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('ticket_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tickets')
        .onDelete('CASCADE')
      table
        .integer('estado_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('estado_tickets')
        .onDelete('CASCADE')
      table.text('comentario').nullable()
      table.timestamp('fecha_cambio', { useTz: true }).defaultTo(this.now())
      table
        .integer('usuario_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
