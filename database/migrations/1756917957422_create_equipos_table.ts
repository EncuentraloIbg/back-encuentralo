// database/migrations/xxxx_create_equipos.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateEquipos extends BaseSchema {
  protected tableName = 'equipos'

  public async up() {
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

      // Extras opcionales
      table.string('so_version', 120).nullable()
      table.integer('ram_gb').unsigned().nullable()
      table.integer('disco_gb').unsigned().nullable()

      // Campo libre que usa el controlador (⚠️ este faltaba)
      table.string('specs', 500).nullable()

      // Índices útiles
      table.index(['cliente_id'], 'equipos_cliente_idx')
      table.index(['tipo_equipo_id'], 'equipos_tipo_idx')
      table.index(['serie_imei'], 'equipos_serie_idx')

      // Evita duplicados del mismo equipo por cliente
      table.unique(['cliente_id', 'serie_imei'], 'equipos_cliente_serie_unique')

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
