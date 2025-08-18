import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/items'

export default class ItemController {
  async index({ response }: HttpContext) {
    const items = await Item.query()
    return response.ok(items)
  }
}
