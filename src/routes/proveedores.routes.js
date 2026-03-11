import { Router } from 'express';
import * as ctrl from '../controllers/proveedores.controller.js';

const ruta = Router();

ruta.get('/', ctrl.getAllProveedores);
ruta.get('/:rfc', ctrl.getProveedor);
ruta.post('/', ctrl.crearProveedor);
ruta.put('/:rfc', ctrl.actualizarProveedor);
ruta.delete('/:rfc', ctrl.eliminarProveedor);

export default ruta;