import { BaseSchema } from '@adonisjs/lucid/schema'

export default class OrdenFotos extends BaseSchema {
  protected tableName = 'orden_fotos'

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

      // Ruta o clave de almacenamiento
      table.string('url', 255).notNullable()

      // Descripción opcional de la foto
      table.string('descripcion', 160).nullable()

      // Índices útiles
      table.index(['orden_id'])

      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
