import * as usuariosmodelo from '../models/usuarios.model.js';
import bcrypt from 'bcryptjs';

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

        if (!nombres || !apellidoPaterno || !apellidoMaterno || !telefono || !correo || !direccion || !password || !rol) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const datosConHash = {
            ...req.body,
            password: passwordEncriptada
        };

        const nuevo = await usuariosmodelo.crearUsuario(datosConHash);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = { ...req.body };

        // Validación inicial
        if (!id || Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ message: 'ID y al menos un campo son requeridos' });
        }

        if (datosActualizar.password && datosActualizar.password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            datosActualizar.password = await bcrypt.hash(datosActualizar.password, salt);
        } else {
            delete datosActualizar.password;
        }

        if (Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ message: 'No hay datos válidos para actualizar' });
        }

        const resultado = await usuariosmodelo.actualizarUsuario(id, datosActualizar);

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

export const verificarHashTest = async (req, res) => {
    try {
        const { correo } = req.query;
        if (!correo) return res.status(400).json({ message: 'Se requiere el correo' });

        const usuario = await usuariosmodelo.findUsuarioByEmai(correo);

        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.status(200).json({ hash: usuario.pass });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const registrarCliente = async (req, res) => {
    try {
        const { nombres, apellidoPaterno, apellidoMaterno, telefono, correo, direccion, password } = req.body;

        if (!nombres || !apellidoPaterno || !apellidoMaterno || !telefono || !correo || !direccion || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // FORZAMOS EL ROL A 3 (Cliente) EN EL BACKEND PARA EVITAR HACKEOS
        const datosConHash = {
            ...req.body,
            password: passwordEncriptada,
            rol: 3 
        };

        const nuevo = await usuariosmodelo.crearUsuario(datosConHash);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};