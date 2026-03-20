import { Router } from 'express';
import * as ctrl from '../controllers/pedidos.controller.js';

const ruta = Router();

ruta.get('/', ctrl.getAllPedidos);
ruta.get('/usuario/:id', ctrl.getPedidosUsuario); // <-- NUEVA RUTA PARA EL ALUMNO
ruta.get('/:id', ctrl.getPedido);
ruta.post('/', ctrl.crearPedido);
ruta.patch('/:id/estado', ctrl.cambiarEstado);

export default ruta;