import { Router } from 'express';
import * as ctrl from '../controllers/somos.controller.js';

const ruta = Router();

ruta.get('/', ctrl.getAllSomos);
ruta.post('/', ctrl.crearSomos);
ruta.put('/:id', ctrl.actualizarSomos);
ruta.delete('/:id', ctrl.eliminarSomos);

export default ruta;