// database/migrations/TU_TIMESTAMP_create_rol_permiso_items_table.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rol_permiso_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('rol_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')
      table.integer('item_id').unsigned().references('id').inTable('items').onDelete('CASCADE')

      table
        .integer('permiso_id')
        .unsigned()
        .references('id')
        .inTable('permisos') // Asegúrate que 'permisos' sea el nombre correcto de tu tabla de permisos
        .onDelete('CASCADE')
        .nullable() // Si permiso_id puede ser nulo, déjalo así. Si no, cámbialo a .notNullable()

      // 2. Usamos un índice UNIQUE compuesto para la combinación de las 3 claves
      // Esto asegura que no puedas tener dos veces la misma combinación (rol, permiso, item)
      // Si item_id puede ser NULL, MySQL permite múltiples NULLs en este UNIQUE index.
      table.unique(['rol_id', 'permiso_id', 'item_id']) // <-- Ahora es un índice UNIQUE

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
