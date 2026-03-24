// routes/reportes.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/reportes.controller.js';

const ruta = Router();


ruta.get('/dashboard', ctrl.obtenerDashboard);
ruta.post('/predictivo', ctrl.calcularModeloPredictivo);
ruta.get('/ventas-actuales', ctrl.obtenerVentasReales);

export default ruta;