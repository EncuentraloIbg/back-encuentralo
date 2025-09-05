import { BaseSchema } from '@adonisjs/lucid/schema'

export default class OrdenArchivos extends BaseSchema {
  protected tableName = 'orden_archivos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Relación con la orden
      table
        .integer('orden_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('ordenes')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      // Archivo
      table.string('url', 255).notNullable()
      table.string('nombre_archivo', 160).notNullable()
      table.string('tipo', 40).notNullable() // Ej: factura, garantia, otro

      // Índices útiles
      table.index(['orden_id'])

      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
