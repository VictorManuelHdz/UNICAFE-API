import { Router } from 'express';
import * as ctrl from '../controllers/pagos.controller.js';
// 1. IMPORTA TU MIDDLEWARE DE AUTENTICACIÓN
import { validarJWT } from '../middlewares/validar-jwt.js'; 

const ruta = Router();

// 2. AGREGA EL MIDDLEWARE AQUÍ
ruta.post('/checkout', validarJWT, ctrl.crearSessionPago); 
ruta.post('/confirmar/:id', ctrl.confirmarPago);

export default ruta;