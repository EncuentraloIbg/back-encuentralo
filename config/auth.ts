// config/auth.ts
import { defineConfig } from '@adonisjs/auth'
import { tokensGuard, tokensUserProvider } from '@adonisjs/auth/access_tokens'
import type { Authenticators, InferAuthenticators, InferAuthEvents } from '@adonisjs/auth/types'

/**
 * Configuración ÚNICA de Auth (OAT)
 * - Usa el modelo Usuario (singular)
 * - Se apoya en Usuario.accessTokens (tabla/ajustes definidos en el modelo)
 */
const authConfig = defineConfig({
  default: 'api',

  guards: {
    api: tokensGuard({
      provider: tokensUserProvider({
        tokens: 'accessTokens', // <- coincide con Usuario.accessTokens
        model: () => import('#models/usuario'), // <- ¡singular y alias ts!
      }),
    }),
  },
})

export default authConfig

/**
 * Tipos inferidos
 */
declare module '@adonisjs/auth/types' {
  export interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}
declare module '@adonisjs/core/types' {
  interface EventsList extends InferAuthEvents<Authenticators> {}
}
