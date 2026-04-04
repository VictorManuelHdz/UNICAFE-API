import { Router } from 'express';
import * as ctrl from '../controllers/pedidos.controller.js';
import { verificarToken, verificarRolAdmin } from '../middlewares/auth.middleware.js';

const ruta = Router();

// Privadas para usuarios o empleados autenticados
ruta.get('/', verificarToken, ctrl.getAllPedidos);
ruta.get('/usuario/:id', verificarToken, ctrl.getPedidosUsuario);
ruta.post('/confirmar/:sessionId', verificarToken, ctrl.confirmarYRegistrarVenta);
ruta.get('/:id', verificarToken, ctrl.getPedido);
ruta.post('/', verificarToken, ctrl.crearPedido);

// Solo para administradores
ruta.patch('/:id/estado', verificarToken, verificarRolAdmin, ctrl.cambiarEstado);


export default ruta;