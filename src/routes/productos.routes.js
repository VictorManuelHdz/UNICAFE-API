import {Router} from 'express'
import * as ctrl from '../controllers/productos.controller.js'

const ruta= Router()

ruta.get('/', ctrl.getAllproductos)
ruta.get('/', ctrl.getproducto)

export default ruta