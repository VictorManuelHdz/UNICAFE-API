import * as terminosModelo from '../models/terminos.model.js';

export const getAllTerminos = async (req, res) => {
    try {
        const terminos = await terminosModelo.getTerminos();
        res.status(200).json(terminos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearTermino = async (req, res) => {
    try {
        const { titulo, contenido } = req.body;
        if (!titulo || !contenido) {
            return res.status(400).json({ message: 'El título y el contenido son requeridos' });
        }
        const nuevo = await terminosModelo.crearTermino(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarTermino = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'ID y al menos un campo son necesarios' });
        }
        const resultado = await terminosModelo.actualizarTermino(id, req.body);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Término no encontrado' });
        }
        res.status(200).json({ message: 'Término actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarTermino = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await terminosModelo.eliminarTermino(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};