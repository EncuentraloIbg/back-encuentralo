import { BaseSchema } from '@adonisjs/lucid/schema'

export default class MotivosEstado extends BaseSchema {
  protected tableName = 'motivos_estado'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Estado al que aplica el motivo
      table.enum('estado_aplicable', ['cancelada', 'rechazada']).notNullable()

      table.string('nombre', 120).notNullable()
      table.boolean('activo').notNullable().defaultTo(true)

      // Índices
      table.index(['estado_aplicable'])
      table.unique(['estado_aplicable', 'nombre'])

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
