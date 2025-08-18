import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('titulo', 255).notNullable()
      table.text('descripcion').notNullable()
      table
        .integer('estado_id')
        .unsigned()
        .references('id')
        .inTable('estado_tickets')
        .onDelete('SET NULL')
        .defaultTo(1)
      table
        .integer('prioridad_id')
        .unsigned()
        .references('id')
        .inTable('prioridads')
        .onDelete('SET NULL')
      table
        .integer('usuario_asignado_id')
        .unsigned()
        .references('id')
        .inTable('usuarios')
        .onDelete('SET NULL')
        .nullable()
      table
        .integer('empresas_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('empresas')
        .onDelete('CASCADE')
      table
        .integer('categoria_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('categorias')
        .onDelete('CASCADE')
      table
        .integer('servicio_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('servicios')
        .onDelete('CASCADE')
      table
        .integer('creador_id') // Nuevo campo para el ID del creador
        .unsigned()
        .references('id')
        .inTable('usuarios') // Nombre de tu tabla de usuarios
        .onDelete('RESTRICT') // O 'CASCADE' si quieres eliminar tickets si el usuario creador se elimina (¡Cuidado con esto!)
        .notNullable() // El creador siempre debe existir
      table.string('nombre_archivo', 255).nullable() // <--- Asegúrate de que sea nullable
      table.dateTime('fecha_asignacion').nullable() // <--- Asegúrate de que sea nullable
      table.dateTime('fecha_finalizacion').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('nombre_archivo')
      table.dropColumn('fecha_finalizacion')
    })
  }
}
