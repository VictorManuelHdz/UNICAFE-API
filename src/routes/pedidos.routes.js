import { Router } from 'express';
import * as ctrl from '../controllers/pedidos.controller.js';

const ruta = Router();

ruta.get('/', ctrl.getAllPedidos);
ruta.post('/', ctrl.crearPedido);

export default ruta;