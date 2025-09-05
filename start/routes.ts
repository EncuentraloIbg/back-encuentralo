// start/routes.ts
import router from '@adonisjs/core/services/router'

/* ---------- ROOT ---------- */
router.get('/', async () => {
  return { message: 'API de Órdenes — OK' }
})

/* ---------- AUTH (públicas) ---------- */
router.post('/api/login', async (ctx) => {
  const { default: AuthController } = await import('#controllers/auth_controller')
  return new AuthController().login(ctx)
})

router.post('/api/forgot-password', async (ctx) => {
  const { default: AuthController } = await import('#controllers/auth_controller')
  return new AuthController().forgotPassword(ctx)
})

router.post('/api/reset-password', async (ctx) => {
  const { default: AuthController } = await import('#controllers/auth_controller')
  return new AuthController().resetPassword(ctx)
})

/* ---------- API ---------- */
router
  .group(() => {
    /* ====== SESIÓN (auth sólo aquí, SIN middleware) ====== */
    router.get('/me', async (ctx) => {
      const { auth, response } = ctx
      try {
        const user = await auth.use('api').authenticate()
        return { user: user.serialize() }
      } catch {
        return response.unauthorized({ message: 'No autenticado' })
      }
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

    /* ====== ÓRDENES ====== */
    router.post('/ordenes', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().store(ctx)
    })

    router.get('/ordenes', async (ctx) => {
      const { default: OrdenesController } = await import('#controllers/ordenes_controller')
      return new OrdenesController().index(ctx)
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
  })
  .prefix('/api')
