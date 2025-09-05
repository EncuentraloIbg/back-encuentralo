// app/controllers/ordenes_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

import RazonSocial from '#models/razon_social'
import Cliente from '#models/cliente'
import Equipo from '#models/equipo'
import MetodoPago from '#models/metodo_pago'
import MotivoEstado from '#models/motivo_estado'
import Orden, { OrdenEstado } from '#models/orden'
import OrdenHistorial from '#models/orden_historial'
import OrdenAccesorio from '#models/orden_accesorio'
import OrdenFoto from '#models/orden_foto'
import OrdenArchivo from '#models/orden_archivo'

function buildCodigo(prefijo: string, consecutivo: number, pad: number = 6) {
  return `${prefijo}-${String(consecutivo).padStart(pad, '0')}`
}

export default class OrdenesController {
  public async store({ request, response, auth }: HttpContext) {
    const razonSocialId = Number(request.input('razon_social_id'))
    const clientePayload = request.input('cliente') || {}
    const equipoPayload = request.input('equipo') || {}
    const ordenPayload = request.input('orden') || {}
    if (!razonSocialId || Number.isNaN(razonSocialId))
      return response.badRequest({ message: 'razon_social_id inválido' })
    if (!clientePayload?.documento || !clientePayload?.nombre)
      return response.badRequest({ message: 'cliente requerido' })
    if (
      !equipoPayload?.tipo_equipo_id ||
      !equipoPayload?.marca ||
      !equipoPayload?.modelo ||
      !equipoPayload?.serie_imei
    ) {
      return response.badRequest({ message: 'equipo requerido' })
    }

    const rs = await RazonSocial.find(razonSocialId)
    if (!rs || !rs.activo)
      return response.badRequest({ message: 'Razón social inválida o inactiva' })
    const prefijo = rs.prefijoOrden!
    const userId = (auth.user as any)?.id ?? null

    const MAX_RETRIES = 5
    let lastErr: unknown = null

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      const trx = await db.transaction()
      try {
        const documento = String(clientePayload.documento).trim()
        let cliente = await Cliente.query()
          .useTransaction(trx)
          .where('razon_social_id', razonSocialId)
          .andWhere('documento', documento)
          .first()
        if (!cliente) {
          cliente = new Cliente()
          cliente.useTransaction(trx)
          cliente.razonSocialId = razonSocialId
          cliente.nombre = String(clientePayload.nombre).trim()
          cliente.documento = documento
          cliente.telefono = clientePayload.telefono ? String(clientePayload.telefono) : ''
          cliente.correo = clientePayload.correo
            ? String(clientePayload.correo).trim().toLowerCase()
            : ''
          cliente.whatsappOptIn = false
          await cliente.save()
        } else {
          cliente.useTransaction(trx)
          cliente.nombre = String(clientePayload.nombre).trim() || cliente.nombre
          cliente.telefono =
            clientePayload.telefono !== undefined
              ? String(clientePayload.telefono)
              : cliente.telefono
          cliente.correo =
            clientePayload.correo !== undefined
              ? String(clientePayload.correo).trim().toLowerCase()
              : cliente.correo
          await cliente.save()
        }

        const serie = String(equipoPayload.serie_imei).trim()
        let equipo = await Equipo.query()
          .useTransaction(trx)
          .where('cliente_id', cliente.id!)
          .andWhere('serie_imei', serie)
          .first()
        if (!equipo) {
          equipo = new Equipo()
          equipo.useTransaction(trx)
          equipo.clienteId = cliente.id!
          equipo.tipoEquipoId = Number(equipoPayload.tipo_equipo_id)
          equipo.marca = String(equipoPayload.marca).trim()
          equipo.modelo = String(equipoPayload.modelo).trim()
          equipo.serieImei = serie
          equipo.specs = equipoPayload.specs ? String(equipoPayload.specs) : null
          await equipo.save()
        } else {
          equipo.useTransaction(trx)
          equipo.tipoEquipoId =
            equipoPayload.tipo_equipo_id !== undefined
              ? Number(equipoPayload.tipo_equipo_id)
              : equipo.tipoEquipoId
          equipo.marca = equipoPayload.marca ? String(equipoPayload.marca).trim() : equipo.marca
          equipo.modelo = equipoPayload.modelo ? String(equipoPayload.modelo).trim() : equipo.modelo
          equipo.specs =
            equipoPayload.specs !== undefined ? String(equipoPayload.specs) : equipo.specs
          await equipo.save()
        }

        const rows = await trx
          .from('ordenes')
          .where('razon_social_id', razonSocialId)
          .max('consecutivo as maxConsecutivo')
        const maxConsecutivo = Number(
          (rows[0] as { maxConsecutivo: number | string | null })?.maxConsecutivo ?? 0
        )
        const consecutivo = maxConsecutivo + 1
        const codigo = buildCodigo(prefijo, consecutivo)

        let metodoPagoId: number | null = null
        if (ordenPayload?.metodo_pago_id) {
          const mp = await MetodoPago.query()
            .useTransaction(trx)
            .where('id', Number(ordenPayload.metodo_pago_id))
            .first()
          if (!mp || !mp.activo) throw new Error('Método de pago inválido o inactivo')
          metodoPagoId = mp.id!
        }

        const fechaEntregaAcordada = ordenPayload?.fecha_entrega_acordada
          ? DateTime.fromISO(String(ordenPayload.fecha_entrega_acordada))
          : null

        const orden = new Orden()
        orden.useTransaction(trx)
        orden.razonSocialId = razonSocialId
        orden.clienteId = cliente.id!
        orden.equipoId = equipo.id!
        orden.codigo = codigo
        orden.consecutivo = consecutivo
        orden.estado = 'recibido'
        orden.metodoPagoId = metodoPagoId
        orden.estadoEstetico =
          ordenPayload?.estado_estetico !== undefined ? String(ordenPayload.estado_estetico) : null
        orden.falloReportado =
          ordenPayload?.fallo_reportado !== undefined ? String(ordenPayload.fallo_reportado) : null
        orden.observacionesCliente =
          ordenPayload?.observaciones_cliente !== undefined
            ? String(ordenPayload.observaciones_cliente)
            : null
        orden.passDesbloqueo =
          ordenPayload?.pass_desbloqueo !== undefined ? String(ordenPayload.pass_desbloqueo) : null
        orden.autorizaRespaldo =
          ordenPayload?.autoriza_respaldo !== undefined
            ? Boolean(ordenPayload.autoriza_respaldo)
            : null
        orden.autorizaApertura =
          ordenPayload?.autoriza_apertura !== undefined
            ? Boolean(ordenPayload.autoriza_apertura)
            : null
        orden.mojado = ordenPayload?.mojado !== undefined ? Boolean(ordenPayload.mojado) : null
        orden.diagnosticoCosto =
          ordenPayload?.diagnostico_costo !== undefined
            ? Number(ordenPayload.diagnostico_costo)
            : null
        orden.anticipo = ordenPayload?.anticipo !== undefined ? Number(ordenPayload.anticipo) : null
        orden.fechaEntregaAcordada = fechaEntregaAcordada
        await orden.save()

        const historial = new OrdenHistorial()
        historial.useTransaction(trx)
        historial.ordenId = orden.id!
        historial.estado = 'recibido'
        historial.usuarioId = userId
        await historial.save()

        const accesoriosIn = (request.input('accesorios') as Array<any>) || []
        if (Array.isArray(accesoriosIn) && accesoriosIn.length > 0) {
          for (const a of accesoriosIn) {
            if (!a || !a.accesorio_id) continue
            const oa = new OrdenAccesorio()
            oa.useTransaction(trx)
            oa.ordenId = orden.id!
            oa.accesorioId = Number(a.accesorio_id)
            oa.detalle = a.detalle ? String(a.detalle) : null
            await oa.save()
          }
        }

        const fotosIn = (request.input('fotos') as Array<any>) || []
        if (Array.isArray(fotosIn) && fotosIn.length > 0) {
          for (const f of fotosIn) {
            if (!f || !f.url) continue
            const ofo = new OrdenFoto()
            ofo.useTransaction(trx)
            ofo.ordenId = orden.id!
            ofo.url = String(f.url)
            ofo.descripcion = f.descripcion ? String(f.descripcion) : null
            await ofo.save()
          }
        }

        const archivosIn = (request.input('archivos') as Array<any>) || []
        if (Array.isArray(archivosIn) && archivosIn.length > 0) {
          for (const f of archivosIn) {
            if (!f || !f.url || !f.nombre_archivo || !f.tipo) continue
            const oa = new OrdenArchivo()
            oa.useTransaction(trx)
            oa.ordenId = orden.id!
            oa.url = String(f.url)
            oa.nombreArchivo = String(f.nombre_archivo)
            oa.tipo = String(f.tipo)
            await oa.save()
          }
        }

        await trx.commit()
        return response.created({
          id: orden.id,
          codigo: orden.codigo,
          consecutivo: orden.consecutivo,
          estado: orden.estado,
        })
      } catch (err: any) {
        await (trx?.rollback?.() ?? Promise.resolve())
        lastErr = err
        if (
          err?.code === 'ER_DUP_ENTRY' ||
          String(err?.message || '')
            .toLowerCase()
            .includes('duplicate')
        )
          continue
        return response.internalServerError({
          message: 'No fue posible crear la orden',
          error: String(err?.message || err),
        })
      }
    }

    return response.conflict({
      message: `No fue posible generar un consecutivo único después de ${MAX_RETRIES} intentos.`,
      error: String(lastErr ?? ''),
    })
  }

  public async index({ request, response }: HttpContext) {
    const estado = request.input('estado') as OrdenEstado | undefined
    const rsId = request.input('razon_social_id')
      ? Number(request.input('razon_social_id'))
      : undefined
    const fechaDesde = request.input('fecha_desde')
    const fechaHasta = request.input('fecha_hasta')
    const page = Number(request.input('page') || 1)
    const perPage = Math.min(Number(request.input('perPage') || 20), 100)

    const q = Orden.query()
      .if(estado, (qb) => qb.where('estado', estado!))
      .if(rsId, (qb) => qb.where('razon_social_id', rsId!))
      .if(fechaDesde || fechaHasta, (qb) => {
        const desde = fechaDesde ? DateTime.fromISO(String(fechaDesde)).startOf('day') : null
        const hasta = fechaHasta ? DateTime.fromISO(String(fechaHasta)).endOf('day') : null
        if (desde && hasta) qb.whereBetween('created_at', [desde.toSQL()!, hasta.toSQL()!])
        else if (desde) qb.where('created_at', '>=', desde.toSQL()!)
        else if (hasta) qb.where('created_at', '<=', hasta.toSQL()!)
      })
      .orderBy('id', 'desc')

    const result = await q.paginate(page, perPage)
    return response.ok(result)
  }

  public async show({ params, response }: HttpContext) {
    const orden = await Orden.query()
      .where('id', Number(params.id))
      .preload('razonSocial')
      .preload('cliente')
      .preload('equipo')
      .preload('metodoPago')
      .preload('motivoEstado')
      .preload('fotos')
      .preload('archivos')
      .preload('historial', (h) => h.preload('motivoEstado').orderBy('id', 'asc'))
      .preload('accesorios')
      .first()

    if (!orden) return response.notFound({ message: 'Orden no encontrada' })
    return response.ok(orden)
  }

  public async update({ params, request, response }: HttpContext) {
    const orden = await Orden.find(Number(params.id))
    if (!orden) return response.notFound({ message: 'Orden no encontrada' })

    const mpId = request.input('metodo_pago_id')
    if (mpId !== undefined && mpId !== null) {
      if (Number.isNaN(Number(mpId)))
        return response.badRequest({ message: 'metodo_pago_id inválido' })
      if (mpId) {
        const mp = await MetodoPago.query().where('id', Number(mpId)).first()
        if (!mp || !mp.activo)
          return response.badRequest({ message: 'Método de pago inválido o inactivo' })
        orden.metodoPagoId = mp.id!
      } else {
        orden.metodoPagoId = null
      }
    }

    const fechaEntrega = request.input('fecha_entrega_acordada')
      ? DateTime.fromISO(String(request.input('fecha_entrega_acordada')))
      : undefined
    if (fechaEntrega !== undefined) orden.fechaEntregaAcordada = fechaEntrega

    orden.merge({
      estadoEstetico:
        request.input('estado_estetico') !== undefined
          ? String(request.input('estado_estetico'))
          : orden.estadoEstetico,
      falloReportado:
        request.input('fallo_reportado') !== undefined
          ? String(request.input('fallo_reportado'))
          : orden.falloReportado,
      observacionesCliente:
        request.input('observaciones_cliente') !== undefined
          ? String(request.input('observaciones_cliente'))
          : orden.observacionesCliente,
      passDesbloqueo:
        request.input('pass_desbloqueo') !== undefined
          ? String(request.input('pass_desbloqueo'))
          : orden.passDesbloqueo,
      autorizaRespaldo:
        request.input('autoriza_respaldo') !== undefined
          ? Boolean(request.input('autoriza_respaldo'))
          : orden.autorizaRespaldo,
      autorizaApertura:
        request.input('autoriza_apertura') !== undefined
          ? Boolean(request.input('autoriza_apertura'))
          : orden.autorizaApertura,
      mojado:
        request.input('mojado') !== undefined ? Boolean(request.input('mojado')) : orden.mojado,
      diagnosticoCosto:
        request.input('diagnostico_costo') !== undefined
          ? Number(request.input('diagnostico_costo'))
          : orden.diagnosticoCosto,
      anticipo:
        request.input('anticipo') !== undefined
          ? Number(request.input('anticipo'))
          : orden.anticipo,
    } as Partial<Orden>)

    await orden.save()
    return response.ok(orden)
  }

  public async close({ params, request, response, auth }: HttpContext) {
    const orden = await Orden.find(Number(params.id))
    if (!orden) return response.notFound({ message: 'Orden no encontrada' })

    const nuevoEstado = String(request.input('estado') || '') as OrdenEstado
    if (!['entregado', 'cancelada', 'rechazada'].includes(nuevoEstado)) {
      return response.badRequest({ message: 'estado inválido' })
    }

    const fechaCierreRaw = request.input('fecha_cierre')
    if (!fechaCierreRaw) return response.badRequest({ message: 'fecha_cierre obligatoria' })
    const fechaCierre = DateTime.fromISO(String(fechaCierreRaw))
    if (!fechaCierre.isValid) return response.badRequest({ message: 'fecha_cierre inválida' })

    let motivoEstadoId: number | null = null
    let motivoEstadoTexto: string | null = null
    if (nuevoEstado === 'cancelada' || nuevoEstado === 'rechazada') {
      const motivoId = request.input('motivo_estado_id')
      const motivoTexto = request.input('motivo_estado_texto')
      if (!motivoId && !motivoTexto) return response.badRequest({ message: 'motivo requerido' })
      if (motivoId) {
        const motivo = await MotivoEstado.find(Number(motivoId))
        if (!motivo || motivo.estadoAplicable !== nuevoEstado)
          return response.badRequest({ message: 'motivo inválido' })
        motivoEstadoId = motivo.id!
      }
      motivoEstadoTexto = motivoTexto ? String(motivoTexto) : null
    }

    const userId = (auth.user as any)?.id ?? null
    const trx = await db.transaction()
    try {
      orden.useTransaction(trx)
      orden.estado = nuevoEstado
      orden.fechaCierre = fechaCierre
      orden.motivoEstadoId = motivoEstadoId
      orden.motivoEstadoTexto = motivoEstadoTexto
      orden.cerradoPorUsuarioId = userId
      await orden.save()

      const historial = new OrdenHistorial()
      historial.useTransaction(trx)
      historial.ordenId = orden.id!
      historial.estado = nuevoEstado
      historial.motivoEstadoId = motivoEstadoId
      historial.motivoTexto = motivoEstadoTexto
      historial.usuarioId = userId
      await historial.save()

      await trx.commit()
      return response.ok({ message: 'Orden cerrada', id: orden.id, estado: orden.estado })
    } catch (err: any) {
      await trx.rollback()
      return response.internalServerError({
        message: 'No fue posible cerrar la orden',
        error: String(err?.message || err),
      })
    }
  }

  public async addAccesorios({ params, request, response }: HttpContext) {
    const orden = await Orden.find(Number(params.id))
    if (!orden) return response.notFound({ message: 'Orden no encontrada' })
    const accesoriosIn = (request.input('accesorios') as Array<any>) || []
    if (!Array.isArray(accesoriosIn) || accesoriosIn.length === 0)
      return response.badRequest({ message: 'accesorios vacío' })
    const trx = await db.transaction()
    try {
      for (const a of accesoriosIn) {
        if (!a || !a.accesorio_id) continue
        const oa = new OrdenAccesorio()
        oa.useTransaction(trx)
        oa.ordenId = orden.id!
        oa.accesorioId = Number(a.accesorio_id)
        oa.detalle = a.detalle ? String(a.detalle) : null
        await oa.save()
      }
      await trx.commit()
      return response.ok({ message: 'Accesorios agregados' })
    } catch (e: any) {
      await trx.rollback()
      return response.internalServerError({
        message: 'Error agregando accesorios',
        error: String(e?.message || e),
      })
    }
  }

  public async addFotos({ params, request, response }: HttpContext) {
    const orden = await Orden.find(Number(params.id))
    if (!orden) return response.notFound({ message: 'Orden no encontrada' })
    const fotosIn = (request.input('fotos') as Array<any>) || []
    if (!Array.isArray(fotosIn) || fotosIn.length === 0)
      return response.badRequest({ message: 'fotos vacío' })
    const trx = await db.transaction()
    try {
      for (const f of fotosIn) {
        if (!f || !f.url) continue
        const ofo = new OrdenFoto()
        ofo.useTransaction(trx)
        ofo.ordenId = orden.id!
        ofo.url = String(f.url)
        ofo.descripcion = f.descripcion ? String(f.descripcion) : null
        await ofo.save()
      }
      await trx.commit()
      return response.ok({ message: 'Fotos agregadas' })
    } catch (e: any) {
      await trx.rollback()
      return response.internalServerError({
        message: 'Error agregando fotos',
        error: String(e?.message || e),
      })
    }
  }

  public async addArchivos({ params, request, response }: HttpContext) {
    const orden = await Orden.find(Number(params.id))
    if (!orden) return response.notFound({ message: 'Orden no encontrada' })
    const archivosIn = (request.input('archivos') as Array<any>) || []
    if (!Array.isArray(archivosIn) || archivosIn.length === 0)
      return response.badRequest({ message: 'archivos vacío' })
    const trx = await db.transaction()
    try {
      for (const f of archivosIn) {
        if (!f || !f.url || !f.nombre_archivo || !f.tipo) continue
        const oa = new OrdenArchivo()
        oa.useTransaction(trx)
        oa.ordenId = orden.id!
        oa.url = String(f.url)
        oa.nombreArchivo = String(f.nombre_archivo)
        oa.tipo = String(f.tipo)
        await oa.save()
      }
      await trx.commit()
      return response.ok({ message: 'Archivos agregados' })
    } catch (e: any) {
      await trx.rollback()
      return response.internalServerError({
        message: 'Error agregando archivos',
        error: String(e?.message || e),
      })
    }
  }
}
