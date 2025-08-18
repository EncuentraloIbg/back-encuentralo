import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre', 100).notNullable()
      table.string('apellido', 100).notNullable()
      table.string('telefono', 20).notNullable()
      table.string('correo', 255).notNullable().unique()
      table.string('foto_perfil', 255).nullable()
      table.string('password', 180).notNullable()

      // Columna para la relación con Roles
      table
        .integer('rol_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('SET NULL')
        .nullable()

      // Columna para la relación con Empresas (¡NUEVA ADICIÓN!)
      table
        .integer('empresa_id') // Nombre de la columna para la clave foránea
        .unsigned() // Asegura que sea un entero sin signo
        .references('id') // Referencia la columna 'id'
        .inTable('empresas') // De la tabla 'empresas'
        .onDelete('SET NULL') // Comportamiento al borrar una empresa: pone el valor a NULL
        .nullable() // Permite que un usuario no tenga una empresa asignada

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
