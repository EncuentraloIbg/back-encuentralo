// app/controllers/dashboard_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import Orden from '#models/orden'
import OrdenHistorial from '#models/orden_historial'

/** Convierte el resultado de .count('* as total') en número seguro */
function toCount(rows: any[]): number {
  const v = rows?.[0]?.$extras?.total
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function parseDateOrNull(v?: string) {
  if (!v) return null
  const d = DateTime.fromISO(String(v))
  return d.isValid ? d : null
}

export default class DashboardController {
  /**
   * GET /api/v1/dashboard
   * Query opcionales:
   *  - razon_social_id: number
   *  - desde: ISO (YYYY-MM-DD)
   *  - hasta: ISO (YYYY-MM-DD)
   */
  public async index({ request, response }: HttpContext) {
    try {
      const rsId = request.input('razon_social_id')
        ? Number(request.input('razon_social_id'))
        : undefined

      const desde = parseDateOrNull(request.input('desde'))
      const hasta = parseDateOrNull(request.input('hasta'))
      const rangoDesde = desde ? desde.startOf('day') : null
      const rangoHasta = hasta ? hasta.endOf('day') : null

      // Helper para aplicar filtros comunes a queries de Orden
      const withOrdenFilters = <QB extends ReturnType<typeof Orden.query>>(q: QB): QB => {
        q.if(!!rsId, (qb) => qb.where('razon_social_id', rsId!))
        q.if(!!rangoDesde || !!rangoHasta, (qb) => {
          if (rangoDesde && rangoHasta) {
            qb.whereBetween('created_at', [rangoDesde.toSQL()!, rangoHasta.toSQL()!])
          } else if (rangoDesde) {
            qb.where('created_at', '>=', rangoDesde.toSQL()!)
          } else if (rangoHasta) {
            qb.where('created_at', '<=', rangoHasta.toSQL()!)
          }
        })
        return q
      }

      // ===== MÉTRICAS =====
      const pendientesRows = await withOrdenFilters(
        Orden.query().where('estado', 'recibido').count('* as total')
      )
      const pendientes = toCount(pendientesRows)

      const hoyIni = DateTime.now().startOf('day')
      const hoyFin = DateTime.now().endOf('day')
      const recibidasHoyRows = await withOrdenFilters(
        Orden.query()
          .whereBetween('created_at', [hoyIni.toSQL()!, hoyFin.toSQL()!])
          .count('* as total')
      )
      const recibidasHoy = toCount(recibidasHoyRows)

      const mesIni = DateTime.now().startOf('month')
      const mesFin = DateTime.now().endOf('month')
      const recibidasMesRows = await withOrdenFilters(
        Orden.query()
          .whereBetween('created_at', [mesIni.toSQL()!, mesFin.toSQL()!])
          .count('* as total')
      )
      const recibidasMes = toCount(recibidasMesRows)

      const hace30 = DateTime.now().minus({ days: 30 })
      const entregadas30Rows = await withOrdenFilters(
        Orden.query()
          .where('estado', 'entregado')
          .where('updated_at', '>=', hace30.toSQL())
          .count('* as total')
      )
      const entregadasUlt30 = toCount(entregadas30Rows)

      const canceladas30Rows = await withOrdenFilters(
        Orden.query()
          .where('estado', 'cancelada')
          .where('updated_at', '>=', hace30.toSQL())
          .count('* as total')
      )
      const canceladasUlt30 = toCount(canceladas30Rows)

      const rechazadas30Rows = await withOrdenFilters(
        Orden.query()
          .where('estado', 'rechazada')
          .where('updated_at', '>=', hace30.toSQL())
          .count('* as total')
      )
      const rechazadasUlt30 = toCount(rechazadas30Rows)

      // ===== ACTIVIDAD RECIENTE (historial) =====
      const actividadReciente = await OrdenHistorial.query()
        .preload('orden', (o) => {
          o.select(['id', 'codigo', 'estado', 'razon_social_id', 'cliente_id', 'created_at'])
          o.preload('cliente', (c) => c.select(['id', 'nombre', 'documento']))
          o.preload('razonSocial', (r) => r.select(['id', 'nombre']))
          if (rsId) o.where('razon_social_id', rsId)
        })
        .orderBy('id', 'desc')
        .limit(10)

      // ===== ÚLTIMAS ÓRDENES =====
      const ultimasOrdenes = (await withOrdenFilters(
        Orden.query()
          .select(['id', 'codigo', 'estado', 'created_at', 'razon_social_id', 'cliente_id'])
          .preload('cliente', (c) => c.select(['id', 'nombre', 'documento']))
          .preload('razonSocial', (r) => r.select(['id', 'nombre']))
          .orderBy('id', 'desc')
          .limit(5)
      )) as Orden[] // <-- tip explícito para evitar "unknown"

      return response.ok({
        filters: {
          razon_social_id: rsId ?? null,
          desde: rangoDesde?.toISO() ?? null,
          hasta: rangoHasta?.toISO() ?? null,
        },
        metrics: {
          pendientes, // 'recibido'
          recibidasHoy,
          recibidasMes,
          entregadasUlt30,
          canceladasUlt30,
          rechazadasUlt30,
        },
        actividadReciente: actividadReciente.map((h) => ({
          id: h.id,
          estado: h.estado,
          createdAt: h.createdAt?.toISO() ?? null,
          createdAtRelative: h.createdAt ? h.createdAt.toRelative() : null,
          orden: h.orden
            ? {
                id: h.orden.id,
                codigo: h.orden.codigo,
                estado: h.orden.estado,
                createdAt: h.orden.createdAt?.toISO() ?? null,
                // Usa relaciones preloaded directamente; si tus modelos no están tipados, fallback a $preloaded
                razonSocial:
                  (h.orden as any)?.razonSocial?.nombre ??
                  (h.orden as any)?.$preloaded?.razonSocial?.nombre ??
                  null,
                cliente:
                  (h.orden as any)?.cliente?.nombre ??
                  (h.orden as any)?.$preloaded?.cliente?.nombre ??
                  null,
              }
            : null,
        })),
        ultimasOrdenes: ultimasOrdenes.map((o: Orden) => ({
          id: o.id,
          codigo: o.codigo,
          estado: o.estado,
          createdAt: o.createdAt?.toISO() ?? null,
          razonSocial:
            (o as any)?.razonSocial?.nombre ?? (o as any)?.$preloaded?.razonSocial?.nombre ?? null,
          cliente: (o as any)?.cliente?.nombre ?? (o as any)?.$preloaded?.cliente?.nombre ?? null,
        })),
      })
    } catch (error) {
      console.error('Error en dashboard:', error)
      return response.internalServerError({
        message: 'Error al obtener datos del dashboard',
      })
    }
  }
}
