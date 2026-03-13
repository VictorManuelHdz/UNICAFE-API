import { Router } from 'express';
import * as ctrl from '../controllers/categoriaMenu.controller.js';

const ruta = Router();

ruta.get('/', ctrl.getAllCategorias);
ruta.post('/', ctrl.crearCategoria);
ruta.put('/:id', ctrl.actualizarCategoria);
ruta.delete('/:id', ctrl.eliminarCategoria);

export default ruta;