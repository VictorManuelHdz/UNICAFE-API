// routes/reportes.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/reportes.controller.js';
import { verificarToken, verificarRolEmpleadoOAdmin } from '../middlewares/auth.middleware.js';

const ruta = Router();

// Rutas protegidas para empleados y administradores
ruta.get('/dashboard', verificarToken, verificarRolEmpleadoOAdmin, ctrl.obtenerDashboard);
ruta.post('/predictivo', verificarToken, verificarRolEmpleadoOAdmin, ctrl.calcularModeloPredictivo);
ruta.get('/ventas-actuales', verificarToken, verificarRolEmpleadoOAdmin, ctrl.obtenerVentasReales);

export default ruta;