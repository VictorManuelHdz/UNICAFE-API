// routes/reportes.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/reportes.controller.js';

const ruta = Router();

// Endpoint original: /api/reportes/dashboard
ruta.get('/dashboard', ctrl.obtenerDashboard);

// Ruta NUEVA para el modelo predictivo
ruta.post('/predictivo', ctrl.calcularModeloPredictivo);

export default ruta;