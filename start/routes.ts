// start/routes.ts

import router from '@adonisjs/core/services/router'
import hash from '@adonisjs/core/services/hash'

// Controladores
const AuthController = () => import('#controllers/auth_controller')
const UsuariosController = () => import('#controllers/usuarios_controller')
const TicketsController = () => import('#controllers/tickets_controller')
const EstadosTicketsController = () => import('#controllers/estados_tickets_controller') // Corregido: EstadosTicketsController
const PrioridadesController = () => import('#controllers/Prioridades_Controller') // Corregido: PrioridadesController
const CategoriasController = () => import('#controllers/Categorias_Controller') // Corregido: CategoriasController
const ServiciosController = () => import('#controllers/servicios_controller') // Corregido: ServiciosController
const RolesController = () => import('#controllers/roles_controller')
const PermisosController = () => import('#controllers/permiso_controller') // Corregido: PermisosController
const ItemsController = () => import('#controllers/item_controller') // Corregido: ItemsController
const RolePermissionItemController = () => import('#controllers/roles_permisos_items_controller')
const EmpresasController = () => import('#controllers/empresas_controller')
const ProyectosController = () => import('#controllers/proyectos_controller')
const ComentarioController = () => import('#controllers/comentarios_controller')
const HistorialEstadosTicketsController = () =>
  import('#controllers/historial_estados_tickets_controller')
const NotificacionesController = () => import('#controllers/notificacions_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const UploadController = () => import('#controllers/upload_controller') // Asegúrate de importar UploadController

// ¡Importa tu NotificationStreamController!
const NotificationStreamController = () => import('#controllers/notification_stream_controller')

// ======================== RUTAS GLOBALES ========================
router.get('/', async () => {
  return { hello: 'world' }
})

router.post('/login', [AuthController, 'login'])
router.put('/usuarios/profile-picture-url', [UsuariosController, 'updateProfilePictureUrlNoAuth'])
router.post('/upload', [UploadController, 'upload']) // Usar la forma estándar con array [Controller, 'method']

router.post('/forgot-password', [AuthController, 'forgotPassword'])
router.post('/reset-password', [AuthController, 'resetPassword'])

router.get('/test-password', async () => {
  const password = '1'
  const hashed =
    '$scrypt$n=16384,r=8,p=1$KCOc6mHQZHdIAvH4Z5F0A$MA72/3CwHAzLvsoBFb/X03/85V+DjeRT0S65UcLg+tKizrNEgeViEALBbsnOh/teGTIzXv88lNFuPqRZfI1KkA'
  const result = await hash.verify(hashed, password)
  return { result }
})

router.get('/prueba-conexion-roles', async ({ response }) => {
  console.log('********** Ruta /prueba-conexion-roles **********')
  return response.ok({ message: 'Ruta de prueba de roles OK' })
})
router.get('/prueba-conexion-empresas', async ({ response }) => {
  console.log('********** Ruta /prueba-conexion-empresas **********')
  return response.ok({ message: 'Ruta de prueba de empresas OK' })
})

// ======================== RUTAS API ========================
router
  .group(() => {
    // === RUTA DASHBOARD ===
    router.get('/dashboard', [DashboardController, 'index'])

    // === RUTAS DE USUARIOS ===
    router.resource('usuarios', UsuariosController).apiOnly().where('id', router.matchers.number()) // Opcional: Validar que el ID sea numérico

    // Rutas específicas de usuarios
    router.get('usuarios/obtener-empresas', [UsuariosController, 'getEmpresas'])
    router.get('usuarios/obtener-roles', [UsuariosController, 'getRoles'])
    router.get('usuarios/tecnicos-lista', [UsuariosController, 'getTecnicos'])

    // === RUTAS DE TICKETS ===
    router.resource('tickets', TicketsController).apiOnly().where('id', router.matchers.number())

    router.post('tickets/:id/comentarios', [ComentarioController, 'store'])
    router.get('tickets/:id/trazabilidad', [HistorialEstadosTicketsController, 'porTicket'])
    router.get('tickets/historial', [TicketsController, 'historial']) // Ruta específica
    router.get('tickets/:id/attachment', [TicketsController, 'downloadAttachment'])

    // === RUTAS DE NOTIFICACIONES ===
    router
      .resource('notificaciones', NotificacionesController)
      .apiOnly()
      .where('id', router.matchers.number())
    router.put('notificaciones/:id/leida', [NotificacionesController, 'marcarComoLeida'])

    // --- ¡AQUÍ SE AGREGA LA RUTA PARA SERVER-SENT EVENTS (SSE)! ---
    // Esta ruta establecerá la conexión SSE para las notificaciones en tiempo real.
    router
      .get('notifications/stream', [NotificationStreamController, 'stream'])
      .as('notification.stream')
    // -----------------------------------------------------------

    // === ENTIDADES MAESTRAS (solo lectura) ===
    router.get('/estados', [EstadosTicketsController, 'index'])
    router.get('/prioridades', [PrioridadesController, 'index'])
    router.get('/categorias', [CategoriasController, 'index'])
    router.get('/servicios', [ServiciosController, 'index'])

    // === RUTAS DE ROLES ===
    router.resource('roles', RolesController).apiOnly().where('id', router.matchers.number())
    // Rutas personalizadas para activar/inactivar/eliminar permanentemente roles
    router.patch('roles/:id/inactivar', [RolesController, 'inactivate']) // Asumo que el método se llama 'inactivate' en tu controlador
    router.patch('roles/:id/activar', [RolesController, 'activate']) // Necesitas un método 'activate' en RolesController
    router.delete('roles/:id/permanente', [RolesController, 'forceDestroy']) // Método para eliminación permanente
    // Si no quieres que 'DELETE /api/roles/:id' haga un hard delete (por defecto de resource),
    // puedes redefinirla para que haga un soft delete si es necesario:
    // router.delete('roles/:id', [RolesController, 'inactivate'])

    // --- AÑADIENDO LA RUTA DE UNICIDAD PARA ROLES ---
    router.get('roles/check-unique-name', [RolesController, 'checkUniqueName']) // <--- ¡Esta es la línea clave!

    // === RUTAS DE PERMISOS ===
    router.resource('permisos', PermisosController).apiOnly().where('id', router.matchers.number())

    // === RUTAS DE ÍTEMS ===
    router.resource('items', ItemsController).apiOnly().where('id', router.matchers.number())

    // === RUTAS DE EMPRESAS ===
    router.resource('empresas', EmpresasController).apiOnly().where('id', router.matchers.number())
    // Rutas personalizadas para activar/inactivar/eliminar permanentemente empresas
    router.patch('empresas/:id/inactivar', [EmpresasController, 'inactivate'])
    router.patch('empresas/:id/activar', [EmpresasController, 'activate'])
    router.delete('empresas/:id/permanente', [EmpresasController, 'destroyPermanently'])
    // **NUEVA RUTA para verificar unicidad del nombre de empresa**
    router.get('empresas/check-unique-name', [EmpresasController, 'checkUniqueName'])

    // === RUTAS DE PROYECTOS ===
    router
      .resource('proyectos', ProyectosController)
      .apiOnly()
      .where('id', router.matchers.number())
    // --- AÑADIENDO LA RUTA DE UNICIDAD PARA PROYECTOS ---
    router.get('proyectos/check-unique-name', [ProyectosController, 'checkUniqueName']) // <--- ¡Nueva ruta para Proyectos!

    // === RUTAS DE ASIGNACIONES (roles_permisos_items) ===
    // No usar resource aquí si el CRUD es no estándar o usa IDs compuestos
    router.get('/asignaciones', [RolePermissionItemController, 'index'])
    router.post('/asignaciones', [RolePermissionItemController, 'store'])
    router.put('/asignaciones/actualizar-por-rol-item', [
      RolePermissionItemController,
      'updateByRolItem',
    ])
    router.delete('/asignaciones/rol/:rolId/item/:itemId', [
      RolePermissionItemController,
      'eliminarPorRolItem',
    ])
    router.delete('/asignaciones/:id', [RolePermissionItemController, 'destroy'])
  })
  .prefix('/api')
