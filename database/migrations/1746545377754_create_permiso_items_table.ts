import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permisos_item'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // Clave primaria propia para esta tabla pivote (opcional, podrías usar una compuesta)

      table
        .integer('permiso_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('permisos')
        .onDelete('CASCADE')

      table
        .integer('item_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('items') // Asumo que tu tabla se llama 'items' en plural
        .onDelete('CASCADE')

      table.unique(['permiso_id', 'item_id']) // Asegura que una combinación permiso-item sea única

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
