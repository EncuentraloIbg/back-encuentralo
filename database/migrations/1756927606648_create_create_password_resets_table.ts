import { BaseSchema } from '@adonisjs/lucid/schema'

export default class CreatePasswordResets extends BaseSchema {
  protected tableName = 'password_resets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Correo del usuario que solicita el reset
      table.string('correo', 180).notNullable().index('password_resets_correo_idx')

      // Token único para el reset (hash/hex de 64–128 chars)
      table.string('token', 128).notNullable().unique('password_resets_token_unique')

      // Fecha/hora de expiración
      table.dateTime('expires_at').notNullable()

      // Timestamps
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
