import vine from '@vinejs/vine'

/**
 * 🟢 Validación para crear un nuevo ticket
 */
export const crear = vine.compile(
  vine.object({
    titulo: vine.string().minLength(3).maxLength(100),
    descripcion: vine.string().minLength(5).maxLength(1000),

    estado_id: vine.number().positive(),
    prioridad_id: vine.number().positive(),
    empresas_id: vine.number().positive(),
    categoria_id: vine.number().positive(),
    servicio_id: vine.number().positive(),
    userId: vine.number().positive(), // creadorId

    usuario_asignado_id: vine.number().positive().nullable().optional(), // puede no venir

    // ✨ Archivo adjunto es OPCIONAL al crear un ticket
    archivo_adjunto: vine
      .file({
        size: '5mb', // Tamaño máximo permitido de 5MB
        extnames: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xlsx', 'txt'], // Extensiones permitidas
      })
      .optional(),
  })
)

/**
 * 🟡 Validación para actualizar un ticket existente
 * Todos los campos son opcionales, para edición parcial
 */
export const actualizar = vine.compile(
  vine.object({
    titulo: vine.string().minLength(3).maxLength(100).optional(),
    descripcion: vine.string().minLength(5).maxLength(1000).optional(),

    estado_id: vine.number().positive().optional(),
    prioridad_id: vine.number().positive().optional(),
    empresas_id: vine.number().positive().optional(),
    categoria_id: vine.number().positive().optional(),
    servicio_id: vine.number().positive().optional(),
    usuario_asignado_id: vine.number().positive().nullable().optional(),

    clear_adjunto: vine.boolean().optional(), // Campo para indicar si se quiere eliminar el adjunto
    usuario_id: vine.number().positive().optional(), // Quien actualiza (para el historial)

    // ✨ Archivo adjunto es OPCIONAL al actualizar un ticket
    // Si se envía, VineJS lo validará. Si no se envía, no causará error.
    archivo_adjunto: vine
      .file({
        size: '5mb', // Tamaño máximo permitido de 5MB
        extnames: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xlsx', 'txt'], // Extensiones permitidas
      })
      .optional(),
  })
)

/**
 * Exportamos ambos validadores para su uso en los controladores
 */
export const ticketValidator = {
  crear,
  actualizar,
}
