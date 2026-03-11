import { Router } from 'express';
import * as ctrl from '../controllers/roles.controller.js';

const ruta = Router();

ruta.get('/', ctrl.getAllRoles);
ruta.get('/:id', ctrl.getRol);

export default ruta;