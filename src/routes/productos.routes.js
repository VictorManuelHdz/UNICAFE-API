import {Router} from 'express'
import * as ctrl from '../controllers/productos.controller.js'

const ruta= Router()

ruta.get('/', ctrl.getAllproductos)
ruta.get('/:id', ctrl.getproducto)
ruta.post('/', ctrl.crearProducto)
ruta.put('/:id', ctrl.actualizarProducto)
ruta.delete('/:id', ctrl.eliminarProducto)

export default ruta