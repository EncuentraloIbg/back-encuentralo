import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Ordenes extends BaseSchema {
  protected tableName = 'ordenes'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      // Identificación
      table.string('codigo', 30).notNullable().unique()

      // consecutivo por razón social
      table.integer('consecutivo').unsigned().notNullable()
      table.unique(['razon_social_id', 'consecutivo'])

      // Relaciones principales
      table
        .integer('razon_social_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('razones_sociales')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table
        .integer('cliente_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('clientes')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table
        .integer('equipo_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('equipos')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      // Estado operativo
      table
        .enum('estado', ['recibido', 'entregado', 'cancelada', 'rechazada'])
        .notNullable()
        .defaultTo('recibido')

      // Datos de negocio
      table.text('estado_estetico').notNullable()
      table.text('fallo_reportado').notNullable()
      table.text('observaciones_cliente').nullable()

      // Acceso / banderas
      table.string('pass_desbloqueo', 120).nullable()
      table.boolean('autoriza_respaldo').notNullable().defaultTo(false)
      table.boolean('autoriza_apertura').notNullable().defaultTo(false)
      table.boolean('mojado').notNullable().defaultTo(false)

      // Valores
      table.decimal('diagnostico_costo', 12, 2).notNullable().defaultTo(0)
      table.decimal('anticipo', 12, 2).notNullable().defaultTo(0)

      // Método de pago (opcional)
      table
        .integer('metodo_pago_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('metodos_pago')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      // Fechas operativas
      table.dateTime('fecha_entrega_acordada', { useTz: true }).nullable()
      table.dateTime('fecha_cierre', { useTz: true }).nullable()

      // Motivo de cierre no exitoso (opcional)
      table
        .integer('motivo_estado_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('motivos_estado')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')

      table.text('motivo_estado_texto').nullable()

      // Auditoría (si luego agregas usuarios)
      table.integer('cerrado_por_usuario_id').unsigned().nullable()

      // Índices útiles
      table.index(['razon_social_id'])
      table.index(['cliente_id'])
      table.index(['equipo_id'])
      table.index(['estado'])
      table.index(['created_at'])
      table.index(['fecha_cierre'])

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
