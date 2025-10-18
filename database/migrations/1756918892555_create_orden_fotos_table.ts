// database/migrations/xxxx_orden_fotos.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class OrdenFotos extends BaseSchema {
  protected tableName = 'orden_fotos'

  public async up() {
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

      // URL (más larga para S3/CloudFront/firmadas)
      table.string('url', 2048).notNullable()

      // Descripción opcional (usamos TEXT por seguridad)
      table.text('descripcion').nullable()

      // Índices útiles
      table.index(['orden_id'])

      // Timestamps
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
