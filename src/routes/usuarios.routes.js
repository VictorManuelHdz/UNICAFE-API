import {Router} from 'express'
import { verificarToken } from '../middlewares/auth.middleware.js'
import * as ctrl from '../controllers/usuarios.controller.js'

const ruta= Router()

ruta.get('/', ctrl.getAllUsuarios)
ruta.get('/:id', ctrl.getUsuario)  
ruta.post('/', verificarToken, ctrl.crearUsuario)
ruta.put('/:id', ctrl.actualizarUsuario)
ruta.delete('/:id', ctrl.eliminarUsuario)

export default ruta