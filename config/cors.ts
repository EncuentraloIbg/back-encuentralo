import { defineConfig } from '@adonisjs/cors'

/** --- Helpers --- */
function isPrivateIPv4(hostname: string) {
  if (hostname.startsWith('10.')) return true
  const m172 = hostname.match(/^172\.(\d+)\./)
  if (m172) {
    const n = Number(m172[1])
    if (n >= 16 && n <= 31) return true
  }
  if (hostname.startsWith('192.168.')) return true
  return false
}

function isIPv4(hostname: string) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
}

/** Convierte patrones como *.trycloudflare.com a RegExp */
function patternToRegex(pattern: string) {
  const escaped = pattern.trim().replace(/\./g, '\\.').replace(/\*/g, '.*')
  return new RegExp(`^${escaped}$`, 'i')
}

/** Lee la whitelist desde .env o usa defaults útiles para CF */
const DEFAULT_ALLOWED = ['localhost', '*.trycloudflare.com', '*.pages.dev']

const ENV_ALLOWED = (process.env.CORS_ALLOWED_HOSTS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const ALLOWED_PATTERNS = [...new Set([...ENV_ALLOWED, ...DEFAULT_ALLOWED])]
  .map(patternToRegex)

export default defineConfig({
  enabled: true,

  /**
   * Permite:
   * - llamadas sin Origin (curl, Postman) -> true
   * - localhost / IPs privadas (dev LAN)
   * - dominios Cloudflare Tunnel (*.trycloudflare.com)
   * - Cloudflare Pages (*.pages.dev)
   * - dominios propios listados en CORS_ALLOWED_HOSTS
   * - IPs públicas (si las incluyes explícitamente en CORS_ALLOWED_HOSTS)
   */
  origin: (origin) => {
    if (!origin) return true // Curl/Postman/no-CORS

    try {
      const { hostname, protocol } = new URL(origin)

      // Dev locales
      if (hostname === 'localhost' || isPrivateIPv4(hostname)) return true

      // Whitelist por patrones (*.trycloudflare.com, *.pages.dev, dominios de .env)
      if (ALLOWED_PATTERNS.some((re) => re.test(hostname))) {
        // Si usas cookies/sesión entre orígenes, exige https
        if (protocol === 'https:' || hostname === 'localhost') return true
        // Permite http para túneles/lan en desarrollo
        if (protocol === 'http:' && (hostname === 'localhost' || isPrivateIPv4(hostname))) return true
      }

      // IP literal: solo si viene por http(s). (Para públicas, mejor listarla en .env)
      if (isIPv4(hostname) && protocol.startsWith('http')) return true

      return false
    } catch {
      return false
    }
  },

  methods: ['GET', 'HEAD', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],

  /**
   * headers:true => refleja los headers solicitados en el preflight.
   * Si sabes exactamente cuáles usará tu front, puedes poner un array fijo.
   */
  headers: true,

  exposeHeaders: ['content-disposition'],

  /**
   * credentials:true es clave si usas cookies/sesiones/JWT en header con fetch `credentials:'include'`.
   * OJO: para cookies cross-site necesitas SameSite=None; Secure y el origen en HTTPS.
   */
  credentials: true,

  maxAge: 600,
})
