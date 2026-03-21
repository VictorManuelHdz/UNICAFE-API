// pagos.routes.js
import { Router } from 'express';
import * as ctrl from '../controllers/pagos.controller.js';
// REVISA: ¿Tu middleware se llama validarJWT o verifyToken? 
// El nombre del archivo y la función deben ser exactos.
import { validarJWT } from '../middlewares/validar-jwt.js'; 

const ruta = Router();

// Si agregaste validarJWT aquí pero no existe el archivo, Vercel truena.
ruta.post('/checkout', validarJWT, ctrl.crearSessionPago); 
ruta.post('/confirmar/:id', ctrl.confirmarPago);

export default ruta;