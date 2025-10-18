// app/controllers/catalogos_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import TipoEquipo from '#models/tipo_equipo'
import Accesorio from '#models/accesorio'
import MetodoPago from '#models/metodo_pago'
import MotivoEstado from '#models/motivo_estado'
import RazonSocial from '#models/razon_social'

export default class CatalogosController {
  // GET /catalogos/tipos-equipo
  public async tiposEquipo({ response }: HttpContext) {
    const data = await TipoEquipo.query().where('activo', true).orderBy('nombre', 'asc')
    return response.ok(data)
  }

  // GET /catalogos/accesorios
  public async accesorios({ response }: HttpContext) {
    const data = await Accesorio.query().where('activo', true).orderBy('nombre', 'asc')
    return response.ok(data)
  }

  // GET /catalogos/metodos-pago
  public async metodosPago({ response }: HttpContext) {
    const data = await MetodoPago.query().where('activo', true).orderBy('nombre', 'asc')
    return response.ok(data)
  }

  // GET /catalogos/motivos-estado?estado_aplicable=cancelada|rechazada
  public async motivosEstado({ request, response }: HttpContext) {
    const estado = request.input('estado_aplicable') as 'cancelada' | 'rechazada' | undefined
    const q = MotivoEstado.query().where('activo', true).orderBy('nombre', 'asc')
    if (estado) q.where('estado_aplicable', estado)
    const data = await q
    return response.ok(data)
  }

  // ✅ GET /catalogos/razones-sociales
  // Devuelve [{ id, nombre }] para poblar el select del historial
  public async razonesSociales({ response }: HttpContext) {
    const data = await RazonSocial.query()
      // si tu tabla no tiene 'activo', elimina la siguiente línea:
      .where('activo', true)
      .select(['id', 'nombre'])
      .orderBy('nombre', 'asc')
    return response.ok(data)
  }
}
