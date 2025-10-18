// app/controllers/razones_sociales_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import RazonSocial from '#models/razon_social'

export default class RazonesSocialesController {
  /**
   * GET /api/v1/razones-sociales
   * Filtros: ?q=texto&activo=true|false&page=1&perPage=20
   */
  public async index({ request, response }: HttpContext) {
    const q = String(request.input('q') || '').trim()

    const activoRaw = request.input('activo')
    const activo =
      activoRaw === undefined
        ? undefined
        : String(activoRaw) === 'true'
          ? true
          : String(activoRaw) === 'false'
            ? false
            : undefined

    const page = Number(request.input('page') || 1)
    const perPage = Math.min(Number(request.input('perPage') || 20), 100)

    const result = await RazonSocial.query()
      .if(q, (qb) => qb.whereILike('nombre', `%${q}%`))
      .if(activo !== undefined, (qb) => qb.where('activo', activo!))
      .orderBy('nombre', 'asc')
      .paginate(page, perPage)

    return response.ok(result)
  }

  /** GET /api/v1/razones-sociales/:id */
  public async show({ params, response }: HttpContext) {
    const rs = await RazonSocial.find(params.id)
    if (!rs) return response.notFound({ message: 'Razón social no encontrada' })
    return response.ok(rs)
  }

  /**
   * PATCH /api/v1/razones-sociales/:id
   * Body opcional:
   * { nombre?, prefijo_orden?, activo?, avatar_url?, telefono?, correo?, direccion?, sitio_web?, color_hex?, descripcion? }
   */
  public async update({ params, request, response }: HttpContext) {
    const rs = await RazonSocial.find(params.id)
    if (!rs) return response.notFound({ message: 'Razón social no encontrada' })

    const nombre = request.input('nombre') as string | undefined
    const prefijoOrden = request.input('prefijo_orden') as string | undefined
    const activo = request.input('activo') as boolean | undefined

    // alias aceptado por compatibilidad: logo_url
    const avatarUrl =
      (request.input('avatar_url') as string | undefined) ??
      (request.input('logo_url') as string | undefined)

    const telefono = request.input('telefono') as string | undefined
    const correo = request.input('correo') as string | undefined
    const direccion = request.input('direccion') as string | undefined
    const sitioWeb = request.input('sitio_web') as string | undefined
    const colorHex = request.input('color_hex') as string | undefined
    const descripcion = request.input('descripcion') as string | undefined

    if (nombre !== undefined) rs.nombre = String(nombre).trim()
    if (prefijoOrden !== undefined) rs.prefijoOrden = String(prefijoOrden).trim()
    if (activo !== undefined) rs.activo = !!activo

    if (avatarUrl !== undefined) rs.avatarUrl = avatarUrl || null
    if (telefono !== undefined) rs.telefono = telefono || null
    if (correo !== undefined) rs.correo = correo || null
    if (direccion !== undefined) rs.direccion = direccion || null
    if (sitioWeb !== undefined) rs.sitioWeb = sitioWeb || null
    if (colorHex !== undefined) rs.colorHex = colorHex || null
    if (descripcion !== undefined) rs.descripcion = descripcion || null

    await rs.save()
    return response.ok(rs)
  }

  /**
   * GET /api/v1/mi-empresa
   * Sin auth: si llega ?razon_social_id lo usa; si no, devuelve la primera activa.
   * Respuesta: { data: RazonSocialDTO }
   */
  public async me({ request, response }: HttpContext) {
    const idRaw = request.input('razon_social_id')
    if (idRaw) {
      const rs = await RazonSocial.find(Number(idRaw))
      if (!rs) return response.notFound({ message: 'Razón social no encontrada' })
      return response.ok({ data: rs })
    }

    const rs = await RazonSocial.query().where('activo', true).orderBy('id', 'asc').first()
    if (!rs) return response.notFound({ message: 'No hay razón social disponible' })
    return response.ok({ data: rs })
  }
}
