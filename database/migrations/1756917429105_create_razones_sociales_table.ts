// database/migrations/xxxxxx_create_razones_sociales.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RazonesSociales extends BaseSchema {
  protected tableName = 'razones_sociales'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('nombre', 120).notNullable().index()
      table.string('prefijo_orden', 10).notNullable()
      table.boolean('activo').notNullable().defaultTo(true)

      // ===== Perfil / branding =====
      table.string('avatar_url', 255).nullable() // <- usado por el modelo/servicio/controlador
      table.string('banner_url', 255).nullable() // opcional, por si lo necesitas
      table.string('telefono', 50).nullable()
      table.string('correo', 255).nullable()
      table.string('direccion', 255).nullable()
      table.string('sitio_web', 255).nullable()
      table.string('color_hex', 12).nullable()
      table.text('descripcion').nullable()

      // ===== Timestamps =====
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
