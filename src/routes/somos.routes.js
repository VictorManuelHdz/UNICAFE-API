import { Router } from 'express';
import * as ctrl from '../controllers/somos.controller.js';
import { verificarToken, verificarRolAdmin } from '../middlewares/auth.middleware.js';

const ruta = Router();

// Pública 
ruta.get('/', ctrl.getAllSomos);

// Privadas (Solo admin edita)
ruta.post('/', verificarToken, verificarRolAdmin, ctrl.crearSomos);
ruta.put('/:id', verificarToken, verificarRolAdmin, ctrl.actualizarSomos);
ruta.delete('/:id', verificarToken, verificarRolAdmin, ctrl.eliminarSomos);

export default ruta;