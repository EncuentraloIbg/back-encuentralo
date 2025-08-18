import type { HttpContext } from '@adonisjs/core/http'
import Permiso from '#models/permisos'

export default class PermisoController {
  async index({ response }: HttpContext) {
    const permisos = await Permiso.query()
    return response.ok(permisos)
  }
}
