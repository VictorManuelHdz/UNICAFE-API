import * as categoriasModelo from '../models/categoriaMenu.model.js';

export const getAllCategorias = async (req, res) => {
    try {
        const categorias = await categoriasModelo.getCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ message: 'El nombre de la categoría es obligatorio' });
        }
        const nueva = await categoriasModelo.crearCategoria(req.body);
        res.status(201).json(nueva);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;
        if (!id || !nombre) {
            return res.status(400).json({ message: 'ID y nombre son requeridos' });
        }
        const resultado = await categoriasModelo.actualizarCategoria(id, req.body);
        if (resultado.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.status(200).json({ message: 'Categoría actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarCategoria = async (req, res) => {
    try {
        const resultado = await categoriasModelo.eliminarCategoria(req.params.id);
        if (resultado.affectedRows === 0) return res.status(404).json({ message: 'ID no válido' });
        res.status(200).json({ message: 'Categoría eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};