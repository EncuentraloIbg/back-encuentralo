import { HttpContext } from '@adonisjs/core/http'
import Categoria from '../models/categorias.js' // <-- ¡Verifica esta ruta!

export default class CategoriasController {
  async index({ response }: HttpContext) {
    try {
      const categorias = await Categoria.all()
      return response.ok(categorias)
    } catch (error) {
      console.error('Error al obtener categorías:', error) // Añade un log aquí
      return response.internalServerError({
        message: 'Error al obtener categorías',
        error: error.message,
      })
    }
  }
}
