import { BaseSchema } from '@adonisjs/lucid/schema'

export default class OrdenAccesorios extends BaseSchema {
  protected tableName = 'orden_accesorios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Relaciones
      table
        .integer('orden_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('ordenes')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')

      table
        .integer('accesorio_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('accesorios')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      // Detalle opcional (ej. "cargador genérico")
      table.string('detalle', 120).nullable()

      // Evitar duplicados del mismo accesorio en la misma orden
      table.unique(['orden_id', 'accesorio_id'])

      // Índices útiles
      table.index(['accesorio_id'])

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
