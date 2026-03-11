import { Router } from 'express';
import * as ctrl from '../controllers/terminos.controller.js';

const ruta = Router();

ruta.get('/', ctrl.getAllTerminos);
ruta.post('/', ctrl.crearTermino);
ruta.put('/:id', ctrl.actualizarTermino);
ruta.delete('/:id', ctrl.eliminarTermino);

export default ruta;