import {Router} from 'express'
import * as ctrl from '../controllers/pagos.controller.js'

const ruta =Router()

ruta.post('/checkout', ctrl.crearSessionPago)
ruta.post('/confirmar/:id', ctrl.confirmarPago)

export default ruta