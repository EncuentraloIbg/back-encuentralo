// app/controllers/uploads_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

export default class UploadsController {
  private absUrl(request: HttpContext['request'], rel: string) {
    const base = `${request.protocol()}://${request.host() || 'localhost:3333'}`
    return `${base}/${rel.replace(/^\//, '')}`
  }

  /**
   * POST /api/v1/uploads/fotos
   * Campos aceptados:
   *  - "fotos" (múltiple) o "foto" (único)
   * Restricciones:
   *  - Máx 6MB por imagen
   *  - Extensiones: jpg, jpeg, png, webp, gif
   * Respuesta:
   *  - { data: [{ url, nombre_archivo, tipo, size }] } (url relativa para front)
   */
  public async fotos({ request, response }: HttpContext) {
    const many = request.files('fotos', {
      size: '6mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    })
    const single = request.file('foto', {
      size: '6mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    })

    const files = many.length ? many : single ? [single] : []
    if (!files.length) {
      return response.badRequest({
        message: 'No se recibieron archivos (campo "fotos" o "foto")',
      })
    }

    const now = new Date()
    const year = String(now.getFullYear())
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const destDir = app.publicPath(path.join('uploads', 'fotos', year, month))
    await fs.mkdir(destDir, { recursive: true })

    const out: Array<{ url: string; nombre_archivo: string; tipo: string; size: number }> = []

    for (const f of files) {
      if (!f.isValid) {
        return response.badRequest({ message: 'Archivo inválido', errors: f.errors })
      }
      const ext = f.extname || 'bin'
      const filename = `${randomUUID()}.${ext}`

      await f.move(destDir, { name: filename, overwrite: false })
      const rel = path.join('uploads', 'fotos', year, month, filename).replace(/\\/g, '/')

      out.push({
        url: `/${rel}`,
        nombre_archivo: f.clientName || filename,
        tipo: f.type || `image/${ext}`,
        size: f.size || 0,
      })
    }

    return response.ok({ data: out })
  }

  /**
   * POST /api/v1/uploads/avatar
   * Campo: avatar (único) — 4MB máx
   * Respuesta: { url, path }
   */
  public async avatar({ request, response }: HttpContext) {
    const file = request.file('avatar', {
      size: '4mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    })
    if (!file) return response.badRequest({ message: 'Archivo avatar requerido (campo "avatar")' })
    if (!file.isValid)
      return response.badRequest({ message: 'Archivo inválido', errors: file.errors })

    const now = new Date()
    const year = String(now.getFullYear())
    const destDir = app.publicPath(path.join('uploads', 'avatars', year))
    await fs.mkdir(destDir, { recursive: true })

    const filename = `${randomUUID()}.${file.extname || 'jpg'}`
    await file.move(destDir, { name: filename, overwrite: false })

    const rel = path.join('uploads', 'avatars', year, filename).replace(/\\/g, '/')
    return response.ok({ url: this.absUrl(request, rel), path: `/${rel}` })
  }
}
