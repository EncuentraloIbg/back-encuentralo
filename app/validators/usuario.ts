// validators/usuario.ts
import vine from '@vinejs/vine'

/**
 * 🟢 Validación para crear un nuevo usuario
 */
export const crear = vine.compile(
  vine.object({
    nombre: vine.string().minLength(2).maxLength(50),
    apellido: vine.string().minLength(2).maxLength(50),
    telefono: vine.string().regex(/^3\d{9}$/),
    correo: vine.string().email(),
    password: vine.string().minLength(6),

    // ✨ ASEGÚRATE DE QUE ESTO ES ASÍ:
    rol_id: vine.number().positive(),
    empresa_id: vine.number().positive(),
  })
)

/**
 * 🟡 Validación para actualizar un usuario existente
 * Todos los campos son opcionales (editable parcialmente)
 */
export const actualizar = vine.compile(
  vine.object({
    nombre: vine.string().minLength(2).maxLength(50).optional(),
    apellido: vine.string().minLength(2).maxLength(50).optional(),
    telefono: vine
      .string()
      .regex(/^3\d{9}$/)
      .optional(),
    correo: vine.string().email().optional(),
    password: vine.string().minLength(6).optional(),

    // ✨ ASEGÚRATE DE QUE ESTO ES ASÍ:
    rol_id: vine.number().positive().optional(),
    empresa_id: vine.number().positive().optional(),
  })
)

/**
 * Exportamos ambos bajo un solo objeto para usar en el controlador
 */
export const usuarioValidator = {
  crear,
  actualizar,
}
