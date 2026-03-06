import {Router} from 'express'
import * as ctrl from '../controllers/usuarios.controller.js'

const ruta= Router()

ruta.get('/', ctrl.getAllUsuarios)
ruta.get('/:id', ctrl.getUsuario)  

export default ruta