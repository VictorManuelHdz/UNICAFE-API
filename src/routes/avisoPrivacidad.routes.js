import { Router } from 'express';
import * as ctrl from '../controllers/avisoPrivacidad.controller.js';

const ruta = Router();

// Endpoint semántico para el frontend
ruta.get('/', ctrl.obtenerAviso);
ruta.put('/:id', ctrl.editarAviso);

export default ruta;