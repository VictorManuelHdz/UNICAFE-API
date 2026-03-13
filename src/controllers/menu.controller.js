import * as menuModelo from '../models/menu.model.js';

export const getAllMenu = async (req, res) => {
    try {
        const { categoria } = req.query;

        // Aplicamos la lógica de filtrado si existe el parámetro
        if (categoria) {
            const platillosFiltrados = await menuModelo.getPlatillosByCategoria(categoria);
            return res.status(200).json(platillosFiltrados);
        }

        const todos = await menuModelo.getPlatillos();
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPlatillo = async (req, res) => {
    try {
        const platillo = await menuModelo.getPlatillo(req.params.id);
        if (!platillo) return res.status(404).json({ message: 'Platillo no encontrado' });
        res.status(200).json(platillo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearPlatillo = async (req, res) => {
    try {
        const nuevo = await menuModelo.crearPlatillo(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarPlatillo = async (req, res) => {
    try {
        const resultado = await menuModelo.actualizarPlatillo(req.params.id, req.body);
        res.status(200).json({ message: 'Actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarPlatillo = async (req, res) => {
    try {
        await menuModelo.eliminarPlatillo(req.params.id);
        res.status(200).json({ message: 'Eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};