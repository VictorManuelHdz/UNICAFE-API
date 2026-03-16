import {Router} from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import * as ctrl from '../controllers/usuarios.controller.js'

const ruta= Router()

ruta.get('/', verificarToken, ctrl.getAllUsuarios)
// Ruta de prueba para verificar el hash de la contraseña
ruta.get('/test/verificar-hash', ctrl.verificarHashTest)

ruta.get('/:id', verificarToken, ctrl.getUsuario)  
ruta.post('/', verificarToken, ctrl.crearUsuario)
ruta.put('/:id', verificarToken, ctrl.actualizarUsuario)
ruta.delete('/:id', verificarToken, ctrl.eliminarUsuario)

export default ruta