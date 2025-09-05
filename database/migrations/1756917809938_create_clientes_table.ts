import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Clientes extends BaseSchema {
  protected tableName = 'clientes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // FK a razones_sociales
      table
        .integer('razon_social_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('razones_sociales')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.enum('tipo', ['persona', 'empresa']).notNullable()
      table.string('nombres', 120).notNullable()
      table.string('apellidos', 120).nullable()

      table.string('documento_tipo', 10).notNullable()
      table.string('documento_numero', 30).notNullable()

      table.string('telefono', 30).notNullable()
      table.string('email', 120).nullable()
      table.string('direccion', 180).nullable()

      table.boolean('whatsapp_opt_in').notNullable().defaultTo(true)

      // Índices y restricciones
      table.unique(['razon_social_id', 'documento_tipo', 'documento_numero'])
      table.index(['razon_social_id'])
      table.index(['telefono'])

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
