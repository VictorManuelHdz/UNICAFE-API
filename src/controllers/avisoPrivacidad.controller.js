import * as avisoModelo from '../models/avisoPrivacidad.model.js';

export const getAllAvisos = async (req, res) => {
    try {
        const avisos = await avisoModelo.getAvisos();
        res.status(200).json(avisos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearAviso = async (req, res) => {
    try {
        const { contenido } = req.body;
        if (!contenido) {
            return res.status(400).json({ message: 'El contenido del aviso es requerido' });
        }
        
        const nuevo = await avisoModelo.crearAviso(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editarAviso = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenido } = req.body;

        if (!id || !contenido) {
            return res.status(400).json({ message: 'El ID y el contenido son obligatorios' });
        }

        const resultado = await avisoModelo.actualizarAviso(id, req.body);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Aviso no encontrado' });
        }
        res.status(200).json({ message: 'Aviso actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarAviso = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await avisoModelo.eliminarAviso(id);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'ID no encontrado' });
        }
        res.status(200).json({ message: 'Aviso eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};