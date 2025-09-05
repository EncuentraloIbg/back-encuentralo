import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AuthAccessTokens extends BaseSchema {
  protected tableName = 'auth_access_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      // Polymorphic owner (en nuestro caso: usuarios)
      table
        .integer('tokenable_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('usuarios')
        .onDelete('CASCADE')

      table.string('tokenable_type').notNullable().defaultTo('Usuario')

      // Datos del token
      table.string('type').notNullable() // p.ej. 'auth_token'
      table.string('name').nullable()
      table.string('hash', 64).notNullable().unique() // hash del token (único)
      table.json('abilities').nullable() // sin default en MySQL

      // Auditoría / expiración
      table.timestamp('last_used_at').nullable()
      table.timestamp('expires_at').nullable()
      table.timestamps(true, true)

      // Índice útil para lookups por dueño
      table.index(['tokenable_type', 'tokenable_id'], 'access_tokens_tokenable_idx')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
