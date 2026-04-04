import { Router } from 'express';
import * as ctrl from '../controllers/avisoPrivacidad.controller.js';
import { sanitizarContenido } from '../middlewares/xss.middleware.js';

const ruta = Router();

ruta.get('/', ctrl.getAllAvisos);
ruta.post('/', sanitizarContenido, ctrl.crearAviso);
ruta.put('/:id', sanitizarContenido, ctrl.editarAviso);
ruta.delete('/:id', ctrl.eliminarAviso);

export default ruta;