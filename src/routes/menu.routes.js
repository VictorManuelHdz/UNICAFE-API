import { Router } from 'express'
import * as ctrl from '../controllers/menu.controller.js'

const ruta = Router()

ruta.get('/', ctrl.getAllPlatillos)
ruta.get('/:id', ctrl.getPlatillo)
ruta.post('/', ctrl.crearPlatillo)
ruta.put('/:id', ctrl.actualizarPlatillo)
ruta.delete('/:id', ctrl.eliminarPlatillo)

export default ruta