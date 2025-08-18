import { HttpContext } from '@adonisjs/core/http'
import Prioridad from '../models/prioridades.js' // Ajusta la ruta

export default class PrioridadesController {
  async index({ response }: HttpContext) {
    const prioridades = await Prioridad.all()
    return response.ok(prioridades)
  }
}
