import { Router } from 'express';
import * as ctrl from '../controllers/menu.controller.js';
import { verificarToken, verificarRolEmpleadoOAdmin } from '../middlewares/auth.middleware.js';

const ruta = Router();

// Públicas
ruta.get('/', ctrl.getAllMenu);
ruta.get('/:id', ctrl.getPlatillo);

// Operativas (Admin y Empleados)
ruta.post('/', verificarToken, verificarRolEmpleadoOAdmin, ctrl.crearPlatillo);
ruta.put('/:id', verificarToken, verificarRolEmpleadoOAdmin, ctrl.actualizarPlatillo);
ruta.delete('/:id', verificarToken, verificarRolEmpleadoOAdmin, ctrl.eliminarPlatillo);

export default ruta;