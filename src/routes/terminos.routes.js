import { Router } from 'express';
import * as ctrl from '../controllers/terminos.controller.js';
import { verificarToken, verificarRolAdmin } from '../middlewares/auth.middleware.js';

const ruta = Router();

// Pública
ruta.get('/', ctrl.getAllTerminos);

// Privadas (Solo admin edita)
ruta.post('/', verificarToken, verificarRolAdmin, ctrl.crearTermino);
ruta.put('/:id', verificarToken, verificarRolAdmin, ctrl.actualizarTermino);
ruta.delete('/:id', verificarToken, verificarRolAdmin, ctrl.eliminarTermino);

export default ruta;