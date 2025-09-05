// app/models/orden.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

import RazonSocial from '#models/razon_social'
import Cliente from '#models/cliente'
import Equipo from '#models/equipo'
import MetodoPago from '#models/metodo_pago'
import MotivoEstado from '#models/motivo_estado'
import OrdenHistorial from '#models/orden_historial'
import OrdenFoto from '#models/orden_foto'
import OrdenArchivo from '#models/orden_archivo'
import Accesorio from '#models/accesorio'

export type OrdenEstado = 'recibido' | 'entregado' | 'cancelada' | 'rechazada'

export default class Orden extends BaseModel {
  public static table = 'ordenes'
  public static primaryKey = 'id'

  /** ===== Identificación ===== */
  @column({ isPrimary: true })
  declare public id: number

  // Código legible (UNIQUE global)
  @column()
  declare public codigo: string

  // Consecutivo por razón social (UNIQUE junto con razon_social_id)
  @column()
  declare public consecutivo: number

  /** ===== FKs ===== */
  @column({ columnName: 'razon_social_id' })
  declare public razonSocialId: number

  @column({ columnName: 'cliente_id' })
  declare public clienteId: number

  @column({ columnName: 'equipo_id' })
  declare public equipoId: number

  @column({ columnName: 'metodo_pago_id' })
  declare public metodoPagoId: number | null

  @column({ columnName: 'motivo_estado_id' })
  declare public motivoEstadoId: number | null

  /** ===== Estado y negocio ===== */
  @column()
  declare public estado: OrdenEstado // 'recibido' | 'entregado' | 'cancelada' | 'rechazada'

  @column({ columnName: 'estado_estetico' })
  declare public estadoEstetico: string | null

  @column({ columnName: 'fallo_reportado' })
  declare public falloReportado: string | null

  @column({ columnName: 'observaciones_cliente' })
  declare public observacionesCliente: string | null

  @column({ columnName: 'pass_desbloqueo' })
  declare public passDesbloqueo: string | null

  // Flags
  @column({ columnName: 'autoriza_respaldo' })
  declare public autorizaRespaldo: boolean | null

  @column({ columnName: 'autoriza_apertura' })
  declare public autorizaApertura: boolean | null

  @column()
  declare public mojado: boolean | null

  // Valores
  @column({ columnName: 'diagnostico_costo' })
  declare public diagnosticoCosto: number | null

  @column()
  declare public anticipo: number | null

  // Fechas
  @column.dateTime({ columnName: 'fecha_entrega_acordada' })
  declare public fechaEntregaAcordada: DateTime | null

  @column.dateTime({ columnName: 'fecha_cierre' })
  declare public fechaCierre: DateTime | null

  // Texto libre de motivo (si no se usa catálogo)
  @column({ columnName: 'motivo_estado_texto' })
  declare public motivoEstadoTexto: string | null

  /** ===== Auditoría futura ===== */
  @column({ columnName: 'cerrado_por_usuario_id' })
  declare public cerradoPorUsuarioId: number | null

  /** ===== Timestamps ===== */
  @column.dateTime({ autoCreate: true })
  declare public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare public updatedAt: DateTime

  /** ===== Relaciones ===== */
  @belongsTo(() => RazonSocial, { foreignKey: 'razonSocialId' })
  declare public razonSocial: BelongsTo<typeof RazonSocial>

  @belongsTo(() => Cliente, { foreignKey: 'clienteId' })
  declare public cliente: BelongsTo<typeof Cliente>

  @belongsTo(() => Equipo, { foreignKey: 'equipoId' })
  declare public equipo: BelongsTo<typeof Equipo>

  @belongsTo(() => MetodoPago, { foreignKey: 'metodoPagoId' })
  declare public metodoPago: BelongsTo<typeof MetodoPago>

  @belongsTo(() => MotivoEstado, { foreignKey: 'motivoEstadoId' })
  declare public motivoEstado: BelongsTo<typeof MotivoEstado>

  @hasMany(() => OrdenHistorial, { foreignKey: 'ordenId' })
  declare public historial: HasMany<typeof OrdenHistorial>

  @hasMany(() => OrdenFoto, { foreignKey: 'ordenId' })
  declare public fotos: HasMany<typeof OrdenFoto>

  @hasMany(() => OrdenArchivo, { foreignKey: 'ordenId' })
  declare public archivos: HasMany<typeof OrdenArchivo>

  @manyToMany(() => Accesorio, {
    pivotTable: 'orden_accesorios',
    localKey: 'id',
    pivotForeignKey: 'orden_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'accesorio_id',
  })
  declare public accesorios: ManyToMany<typeof Accesorio>

  /** ===== Utilidades ===== */
  public static ESTADOS: OrdenEstado[] = ['recibido', 'entregado', 'cancelada', 'rechazada']
}
