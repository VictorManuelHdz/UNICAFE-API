import { Router } from 'express';
import * as ctrl from '../controllers/avisoPrivacidad.controller.js';

const ruta = Router();

ruta.get('/', ctrl.getAllAvisos);
ruta.post('/', ctrl.crearAviso);
ruta.put('/:id', ctrl.editarAviso);
ruta.delete('/:id', ctrl.eliminarAviso);

export default ruta;