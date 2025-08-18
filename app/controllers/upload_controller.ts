import type { HttpContext } from '@adonisjs/core/http'
import bucket from '#start/firebase'
import { v4 as uuidv4 } from 'uuid'
import fs from 'node:fs'

export default class UploadController {
  public async upload({ request, response }: HttpContext) {
    try {
      const file = request.file('file', {
        size: '2mb',
        extnames: ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'docx', 'xlsx', 'zip', 'txt'],
      })

      if (!file) {
        return response.badRequest('No se ha enviado ningún archivo.')
      }

      // Verifica que el archivo se haya guardado temporalmente
      if (!file.tmpPath) {
        console.error('No se encontró la ruta temporal del archivo.')
        return response.status(500).send('Error al procesar el archivo subido.')
      }

      console.log('Archivo recibido:', {
        nombre: file.clientName,
        tipo: file.type,
        tamaño: file.size,
        rutaTemporal: file.tmpPath,
      })

      const fileName = `${uuidv4()}-${file.clientName}`
      const fileUpload = bucket.file(fileName)

      // Subir a Firebase
      const fileBuffer = fs.readFileSync(file.tmpPath)

      await fileUpload.save(fileBuffer, {
        metadata: {
          contentType: file.type,
        },
        public: true,
      })

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

      return response.ok({ url: publicUrl })
    } catch (error) {
      console.error('❌ Error al subir archivo:', error)
      return response.status(500).send('Error interno al subir el archivo.')
    }
  }
}
