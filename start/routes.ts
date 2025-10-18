// start/routes.ts
import router from '@adonisjs/core/services/router'

/* ----------------------------------------
   ROOT (healthcheck)
----------------------------------------- */
router.get('/', async () => {
  return { message: 'API de Órdenes — OK' }
})

/* ----------------------------------------
   AUTH (públicas)
----------------------------------------- */
router.post('/api/v1/login', async (ctx) => {
  const { default: AuthController } = await import('#controllers/auth_controller')
  return new AuthController().login(ctx)
})

router.post('/api/v1/forgot-password', async (ctx) => {
  const { default: AuthController } = await import('#controllers/auth_controller')
  return new AuthController().forgotPassword(ctx)
})

router.post('/api/v1/reset-password', async (ctx) => {
  const { default: AuthController } = await import('#controllers/auth_controller')
  return new AuthController().resetPassword(ctx)
})

/* ----------------------------------------
   API v1 (protegida)
----------------------------------------- */
router
  .group(() => {
    /* ====== SESIÓN ====== */
    router.get('/me', async (ctx) => {
      const { default: AuthController } = await import('#controllers/auth_controller')
      return new AuthController().me(ctx)
    })

    /* ====== USUARIOS ====== */
    router.get('/usuarios', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().index(ctx)
    })
    router.post('/usuarios', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().store(ctx)
    })
    router.get('/usuarios/:id', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().show(ctx)
    })
    router.patch('/usuarios/:id', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().update(ctx)
    })
    router.patch('/usuarios/:id/activar', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().activate(ctx)
    })
    router.patch('/usuarios/:id/inactivar', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().inactivate(ctx)
    })
    router.delete('/usuarios/:id', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().destroy(ctx)
    })

    // 👇 RUTA QUE FALTABA: editar MI perfil
    router.put('/usuarios/me', async (ctx) => {
      const { default: UsuariosController } = await import('#controllers/usuarios_controller')
      return new UsuariosController().updateMe(ctx)
    })

    /* ====== RAZONES SOCIALES ====== */
    router.get('/mi-empresa', async (ctx) => {
      const { default: RazonesSocialesController } = await import(
        '#controllers/razones_sociales_controller'
      )
      return new RazonesSocialesController().me(ctx)
    })
    router.get('/razones-sociales', async (ctx) => {
      const { default: RazonesSocialesController } = await import(
        '#controllers/razones_sociales_controller'
      )
      return new RazonesSocialesController().index(ctx)
    })
    router.get('/razones-sociales/:id', async (ctx) => {
      const { default: RazonesSocialesController } = await import(
        '#controllers/razones_sociales_controller'
      )
      return new RazonesSocialesController().show(ctx)
    })
    router.patch('/razones-sociales/:id', async (ctx) => {
      const { default: RazonesSocialesController } = await import(
        '#controllers/razones_sociales_controller'
      )
      return new RazonesSocialesController().update(ctx)
    })

    /* ====== ÓRDENES ====== */
    router.post('/ordenes', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().store(ctx)
    })
    router.get('/ordenes', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().index(ctx)
    })
    router.get('/ordenes/historial', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().historial(ctx)
    })
    router.get('/ordenes/:id', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().show(ctx)
    })
    router.patch('/ordenes/:id', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().update(ctx)
    })
    router.post('/ordenes/:id/cerrar', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().close(ctx)
    })
    router.post('/ordenes/:id/accesorios', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().addAccesorios(ctx)
    })
    router.post('/ordenes/:id/fotos', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().addFotos(ctx)
    })
    router.post('/ordenes/:id/archivos', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().addArchivos(ctx)
    })
    router.get('/ordenes/siguiente-consecutivo', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().nextConsecutivo(ctx)
    })

    /* ====== UPLOADS ====== */
    router.post('/uploads/fotos', async (ctx) => {
      const { default: UploadsController } = await import('#controllers/uploads_controller')
      return new UploadsController().fotos(ctx)
    })

    /* ====== CATÁLOGOS ====== */
    router.get('/catalogos/tipos-equipo', async (ctx) => {
      const { default: CatalogosController } = await import('#controllers/catalogos_controller')
      return new CatalogosController().tiposEquipo(ctx)
    })
    router.get('/catalogos/accesorios', async (ctx) => {
      const { default: CatalogosController } = await import('#controllers/catalogos_controller')
      return new CatalogosController().accesorios(ctx)
    })
    router.get('/catalogos/metodos-pago', async (ctx) => {
      const { default: CatalogosController } = await import('#controllers/catalogos_controller')
      return new CatalogosController().metodosPago(ctx)
    })
    router.get('/catalogos/motivos-estado', async (ctx) => {
      const { default: CatalogosController } = await import('#controllers/catalogos_controller')
      return new CatalogosController().motivosEstado(ctx)
    })
    router.get('/catalogos/razones-sociales', async (ctx) => {
      const { default: CatalogosController } = await import('#controllers/catalogos_controller')
      return new CatalogosController().razonesSociales(ctx)
    })

    /* ====== 404 JSON SOLO PARA /api/v1 ====== */
    router.any('*', async ({ response, request }) => {
      response.status(404)
      return {
        message: 'Endpoint no encontrado',
        path: request.url(),
        method: request.method(),
      }
    })

    router.where('id', router.matchers.number())
  })
  .prefix('/api/v1')
