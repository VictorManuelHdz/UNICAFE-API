import { Router } from 'express'
import * as ctrl from '../controllers/reportes.controller.js'

const ruta = Router()

// Endpoint: /api/reportes/dashboard
ruta.get('/dashboard', ctrl.obtenerDashboard)

// routes/reportes.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/reportes.controller.js';

// Ruta POST para conectarse con el frontend
ruta.post('/predictivo', ctrl.calcularModeloPredictivo);


export default ruta