import type { HttpContext } from '@adonisjs/core/http'
import Rol from '#models/roles'

export default class RoleController {
  async index({ response }: HttpContext) {
    const roles = await Rol.query().where('estado', 'activo')
    return response.ok(roles)
  }
}
