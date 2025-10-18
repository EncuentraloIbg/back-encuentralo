// database/migrations/xxxx_create_clientes.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateClientes extends BaseSchema {
  protected tableName = 'clientes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('razon_social_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('razones_sociales')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      // 🔹 Campos que usa tu controlador
      table.string('nombre', 180).notNullable()
      table.string('documento', 60).notNullable()
      table.string('telefono', 30).notNullable()
      table.string('correo', 180).nullable()
      table.boolean('whatsapp_opt_in').notNullable().defaultTo(false)
      table.string('direccion', 200).nullable()
      table.string('tipo_cliente', 20).nullable() // 'persona' | 'empresa'

      // Índices
      table.unique(['razon_social_id', 'documento'], 'clientes_rs_documento_unique')
      table.index(['razon_social_id'], 'clientes_rs_idx')
      table.index(['telefono'], 'clientes_tel_idx')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
