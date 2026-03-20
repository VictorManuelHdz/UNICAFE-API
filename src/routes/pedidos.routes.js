import { Router } from 'express';
import * as ctrl from '../controllers/pedidos.controller.js';

const ruta = Router();

ruta.get('/', ctrl.getAllPedidos);
ruta.get('/:id', ctrl.getPedido); 
ruta.post('/', ctrl.crearPedido);

export default ruta;