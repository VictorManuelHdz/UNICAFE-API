import {Router} from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import { verificarRolAdmin } from '../middlewares/auth.middleware.js'
import * as ctrl from '../controllers/usuarios.controller.js'

const ruta= Router()

// Rutas Públicas
ruta.post('/registro', ctrl.registrarCliente)
ruta.get('/test/verificar-hash', ctrl.verificarHashTest)

// Rutas Privadas (¡SOLO ADMIN!)
ruta.get('/', verificarToken, verificarRolAdmin, ctrl.getAllUsuarios)
ruta.post('/', verificarToken, verificarRolAdmin, ctrl.crearUsuario)
ruta.delete('/:id', verificarToken, verificarRolAdmin, ctrl.eliminarUsuario)
ruta.get('/:id', verificarToken, ctrl.getUsuario)  
ruta.put('/:id', verificarToken, ctrl.actualizarUsuario)

export default ruta