import * as avisoModelo from '../models/avisoPrivacidad.model.js';

export const obtenerAviso = async (req, res) => {
    try {
        const aviso = await avisoModelo.getAvisoPrivacidad();
        if (!aviso) {
            return res.status(404).json({ message: 'Aviso de privacidad no encontrado' });
        }
        res.status(200).json(aviso);
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

        const resultado = await avisoModelo.actualizarAvisoPrivacidad(id, req.body);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'No se pudo encontrar el aviso para actualizar' });
        }

        res.status(200).json({ message: 'Aviso de privacidad actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};