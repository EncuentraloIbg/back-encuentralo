// database/migrations/17579xxxxxxx_create_usuarios_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Relación con razones_sociales
      table
        .integer('razon_social_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('razones_sociales')
        .onUpdate('CASCADE')
        .onDelete('RESTRICT')
        .index()

      table.string('nombres', 150).notNullable()
      table.string('apellidos', 150).notNullable()

      table.string('correo', 255).notNullable().unique().index()
      table.string('password', 255).notNullable()

      table.string('avatar_url', 255).nullable() // 👈 foto/imagen de perfil

      table.string('telefono', 50).nullable()
      table.string('direccion', 255).nullable()

      table.enum('estado', ['activo', 'inactivo']).notNullable().defaultTo('activo')

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
