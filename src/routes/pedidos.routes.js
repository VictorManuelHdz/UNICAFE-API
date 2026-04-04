import { Router } from 'express';
import * as ctrl from '../controllers/pedidos.controller.js';
import { verificarToken, verificarRolEmpleadoOAdmin } from '../middlewares/auth.middleware.js';

const ruta = Router();

// Privadas para usuarios o empleados autenticados
ruta.get('/usuario/:id', verificarToken, ctrl.getPedidosUsuario);
ruta.post('/confirmar/:sessionId', verificarToken, ctrl.confirmarYRegistrarVenta);
ruta.get('/:id', verificarToken, ctrl.getPedido);

// Operativas Admin y Empleados
ruta.get('/', verificarToken, verificarRolEmpleadoOAdmin, ctrl.getAllPedidos);
ruta.post('/', verificarToken, verificarRolEmpleadoOAdmin, ctrl.crearPedido);
ruta.patch('/:id/estado', verificarToken, verificarRolEmpleadoOAdmin, ctrl.cambiarEstado);


export default ruta;