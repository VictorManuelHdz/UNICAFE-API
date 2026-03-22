import { Router } from 'express'
import * as ctrl from '../controllers/reportes.controller.js'

const ruta = Router()

// Endpoint: /api/reportes/dashboard
ruta.get('/dashboard', ctrl.obtenerDashboard)

export default ruta