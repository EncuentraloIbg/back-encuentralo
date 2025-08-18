import { HttpContext } from '@adonisjs/core/http'
import Servicio from '../models/servicios.js' // Ruta relativa desde el controlador al modelo

export default class ServiciosController {
  // El nombre de la CLASE debe ser en PascalCase
  async index({ response }: HttpContext) {
    const servicios = await Servicio.all() // Obtiene todos los registros del modelo Servicio
    return response.ok(servicios) // Devuelve la lista de servicios en formato JSON con estado 200 OK
  }
}
