// pagos.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/pagos.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js'; //

const ruta = Router();

// Agregamos verificarToken para llenar req.usuario
ruta.post('/checkout', verificarToken, ctrl.crearSessionPago); 
ruta.post('/confirmar/:id', ctrl.confirmarPago);

export default ruta;