import * as usuariosmodelo from '../models/usuarios.model.js';

export const getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await usuariosmodelo.getUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUsuario = async (req, res) => {
    try {
        const usuario = await usuariosmodelo.getUsuario(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearUsuario = async (req, res) => {
    try {
        const { nombres, apellidoPaterno, apellidoMaterno, telefono, correo, direccion, password, rol } = req.body;

        // Mantenemos tu lógica de validación exacta
        if (!nombres || !apellidoPaterno || !apellidoMaterno || !telefono || !correo || !direccion || !password || !rol) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const nuevo = await usuariosmodelo.crearUsuario(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        // Validación de que al menos un campo venga en el body
        if (!id || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: 'ID y al menos un campo son requeridos' });
        }

        const resultado = await usuariosmodelo.actualizarUsuario(id, req.body);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Datos actualizados correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'El id es obligatorio' });
        
        const eliminar = await usuariosmodelo.eliminarUsuario(id);
        res.status(200).json(eliminar);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};