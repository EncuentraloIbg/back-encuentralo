import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Equipos extends BaseSchema {
  protected tableName = 'equipos'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Relaciones
      table
        .integer('cliente_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clientes')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table
        .integer('tipo_equipo_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tipos_equipo')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      // Atributos del equipo
      table.string('marca', 80).notNullable()
      table.string('modelo', 80).notNullable()
      table.string('serie_imei', 80).notNullable()
      table.string('so_version', 120).nullable()
      table.smallint('ram_gb').unsigned().nullable()
      table.integer('disco_gb').unsigned().nullable()

      // Índices útiles
      table.index(['cliente_id'])
      table.index(['tipo_equipo_id'])
      table.index(['serie_imei'])

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
