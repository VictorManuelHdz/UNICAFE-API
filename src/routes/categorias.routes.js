import { Router } from 'express'
import * as ctrl from '../controllers/categorias.controller.js'

const ruta = Router()

ruta.get('/', ctrl.getAllCategorias)
ruta.get('/:id', ctrl.getCategoria)
ruta.post('/', ctrl.crearCategoria)
ruta.put('/:id', ctrl.actualizarCategoria)
ruta.delete('/:id', ctrl.eliminarCategoria)

export default ruta