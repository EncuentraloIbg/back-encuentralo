// app/Controllers/Http/NotificationStreamController.ts

import { EventEmitter } from 'node:events'
import type { HttpContext } from '@adonisjs/core/http'

// Este EventEmitter se usa como un bus de eventos interno para comunicar
// los cambios de notificaciones a las conexiones SSE abiertas.
// Es importante que sea una única instancia global para que todos los controladores
// puedan emitir y este controlador pueda escuchar.
export const notificationEmitter = new EventEmitter()

export default class NotificationStreamController {
  /**
   * Maneja la conexión Server-Sent Events (SSE).
   * Mantiene la conexión abierta y envía eventos a los clientes cuando se emiten notificaciones.
   */
  public async stream({ response }: HttpContext) {
    // Configura los encabezados HTTP necesarios para una conexión SSE
    response.response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    })

    /**
     * Función auxiliar para enviar un evento SSE.
     * El formato es 'data: <JSON_DEL_EVENTO>\n\n'.
     */
    const sendEvent = (data: any) => {
      // JSON.stringify para convertir el objeto a string y reemplazar saltos de línea
      // para evitar problemas con el formato SSE.
      const dataString = JSON.stringify(data).replace(/\n/g, '\\n')
      response.response.write(`data: ${dataString}\n\n`)
    }

    /**
     * Listener que reacciona a los eventos emitidos por `notificationEmitter`.
     * Cuando se recibe un 'newNotification', se envía a través de la conexión SSE.
     */
    const listener = (notificationData: {
      id: number
      ticketId: number
      userId: number
      message: string
      title: string
      statusId?: number
    }) => {
      // Envía la data de la notificación a través de la conexión SSE.
      // El frontend deberá usar `userId` para filtrar y mostrar notificaciones relevantes.
      sendEvent({
        type: 'new_notification',
        id: notificationData.id,
        ticketId: notificationData.ticketId,
        userId: notificationData.userId,
        message: notificationData.message,
        title: notificationData.title,
        statusId: notificationData.statusId,
        timestamp: new Date().toISOString(),
      })
    }

    // Suscribe este listener al evento 'newNotification' del emisor global
    notificationEmitter.on('newNotification', listener)

    // --- Lógica para enviar Heartbeats ---
    // Envía un comentario SSE (':\n\n') cada X segundos para mantener la conexión viva
    // y evitar timeouts de proxies o balanceadores de carga.
    const heartbeatInterval = setInterval(() => {
      response.response.write(':\n\n')
    }, 25000)

    // Maneja la desconexión del cliente:
    // Cuando la conexión se cierra (por ejemplo, el usuario cierra la pestaña o actualiza),
    // se elimina el listener para evitar fugas de memoria y se finaliza la respuesta.
    response.response.on('close', () => {
      notificationEmitter.off('newNotification', listener)
      clearInterval(heartbeatInterval)
      response.response.end()
    })
  }
}
