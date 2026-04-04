import { Router } from 'express';
import * as ctrl from '../controllers/productos.controller.js';
import { verificarToken, verificarRolEmpleadoOAdmin } from '../middlewares/auth.middleware.js';

const ruta = Router();

// Públicas
ruta.get('/', ctrl.getAllproductos);
ruta.get('/:id', ctrl.getproducto);

// Operativas (Admin y Empleados)
ruta.post('/', verificarToken, verificarRolEmpleadoOAdmin, ctrl.crearProducto);
ruta.put('/:id', verificarToken, verificarRolEmpleadoOAdmin, ctrl.actualizarProducto);
ruta.delete('/:id', verificarToken, verificarRolEmpleadoOAdmin, ctrl.eliminarProducto);

export default ruta;