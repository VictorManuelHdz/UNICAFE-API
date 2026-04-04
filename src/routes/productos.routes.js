import {Router} from 'express'
import * as ctrl from '../controllers/productos.controller.js'
import { verificarToken, verificarRolAdmin } from '../middlewares/auth.middleware.js';

const ruta= Router()

// --- RUTAS PÚBLICAS ---
ruta.get('/', ctrl.getAllproductos);
ruta.get('/:id', ctrl.getproducto);

// --- RUTAS PRIVADAS (Solo Administrador) ---
ruta.post('/', verificarToken, verificarRolAdmin, ctrl.crearProducto);
ruta.put('/:id', verificarToken, verificarRolAdmin, ctrl.actualizarProducto);
ruta.delete('/:id', verificarToken, verificarRolAdmin, ctrl.eliminarProducto);

export default ruta