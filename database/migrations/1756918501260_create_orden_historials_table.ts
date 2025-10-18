// database/migrations/xxxx_create_orden_historial.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateOrdenHistorial extends BaseSchema {
  protected tableName = 'orden_historial'

  public async up() {
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

      // Motivo (solo aplica para cancelada/rechazada, nullable)
      table
        .integer('motivo_estado_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('motivos_estado')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.text('motivo_texto').nullable()

      // Usuario que hizo el cambio (nullable si sistema)
      table.integer('usuario_id').unsigned().nullable()
      // Si tienes tabla usuarios y quieres FK:
      // .references('id').inTable('usuarios').onDelete('SET NULL').onUpdate('CASCADE')

      // Timestamps que usa tu modelo/controlador
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()

      // Índices útiles
      table.index(['orden_id', 'created_at'], 'orden_historial_orden_created_idx')
      table.index(['motivo_estado_id'], 'orden_historial_motivo_idx')
      table.index(['estado'], 'orden_historial_estado_idx')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
