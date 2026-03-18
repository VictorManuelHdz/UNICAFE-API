import {Router} from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import * as ctrl from '../controllers/usuarios.controller.js'

const ruta= Router()

// Rutas Públicas
ruta.post('/registro', ctrl.registrarCliente)
ruta.get('/test/verificar-hash', ctrl.verificarHashTest)

// Rutas Privadas con autenticación
ruta.get('/', verificarToken, ctrl.getAllUsuarios)
ruta.get('/:id', verificarToken, ctrl.getUsuario)  
ruta.post('/', verificarToken, ctrl.crearUsuario)
ruta.put('/:id', verificarToken, ctrl.actualizarUsuario)
ruta.delete('/:id', verificarToken, ctrl.eliminarUsuario)

export default ruta