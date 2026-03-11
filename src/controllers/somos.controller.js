import * as somosModelo from '../models/somos.model.js';

export const getAllSomos = async (req, res) => {
    try {
        const datos = await somosModelo.getSomos();
        res.status(200).json(datos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearSomos = async (req, res) => {
    try {
        const { imagen, descripcion } = req.body;
        if (!imagen || !descripcion) {
            return res.status(400).json({ message: 'La imagen y la descripción son obligatorias' });
        }
        const nuevo = await somosModelo.crearSomos(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarSomos = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'ID y campos son requeridos' });
        }
        const resultado = await somosModelo.actualizarSomos(id, req.body);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }
        res.status(200).json({ message: 'Información actualizada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarSomos = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await somosModelo.eliminarSomos(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};