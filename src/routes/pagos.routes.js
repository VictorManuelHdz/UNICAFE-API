// pagos.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/pagos.controller.js';
// CORRECCIÓN: Importa la función correcta del archivo correcto
import { verificarToken } from '../middlewares/auth.middleware.js'; 

const ruta = Router();

// Usa verificarToken para que req.usuario tenga el ID del alumno
ruta.post('/checkout', verificarToken, ctrl.crearSessionPago); 
ruta.post('/confirmar/:id', ctrl.confirmarPago);

export default ruta;