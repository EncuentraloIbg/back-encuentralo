import { BaseSchema } from '@adonisjs/lucid/schema'

export default class OrdenHistorial extends BaseSchema {
  protected tableName = 'orden_historial'

  async up() {
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

      // Estado al que cambió
      table.enum('estado', ['recibido', 'entregado', 'cancelada', 'rechazada']).notNullable()

      // Motivo (solo aplica para cancelada/rechazada, pero lo dejamos nullable)
      table
        .integer('motivo_estado_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('motivos_estado')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.text('motivo_texto').nullable()

      // Usuario que hizo el cambio (si luego añades usuarios)
      table.integer('usuario_id').unsigned().nullable()

      // Índices útiles
      table.index(['orden_id', 'created_at'])
      table.index(['motivo_estado_id'])

      // Solo necesitamos created_at como marca temporal del evento
      table.timestamp('created_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
