import {Router} from 'express'
import * as ctrl from '../controllers/usuarios.controller.js'

const ruta= Router()

ruta.get('/', ctrl.getAllUsuarios)
ruta.get('/:id', ctrl.getUsuario)  
ruta.post('/', ctrl.crearUsuario)
ruta.put('/:id', ctrl.actualizarUsuario)
ruta.delete('/:id', ctrl.eliminarUsuario)

export default ruta