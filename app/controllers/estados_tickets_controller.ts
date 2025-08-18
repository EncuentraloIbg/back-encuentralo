import { HttpContext } from '@adonisjs/core/http'
import EstadoTicket from '../models/estados_ticket.js'
// Ajusta la ruta si es diferente, ej. 'App/Models/EstadoTicket'

export default class EstadosController {
  async index({ response }: HttpContext) {
    const estados = await EstadoTicket.all()
    return response.ok(estados)
  }
}
