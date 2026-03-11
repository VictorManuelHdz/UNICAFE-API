import * as proveedoresModelo from '../models/proveedores.model.js';

export const getAllProveedores = async (req, res) => {
    try {
        const proveedores = await proveedoresModelo.getProveedores();
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProveedor = async (req, res) => {
    try {
        const proveedor = await proveedoresModelo.getProveedor(req.params.rfc);
        if (!proveedor) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.status(200).json(proveedor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearProveedor = async (req, res) => {
    try {
        const { rfc, nombre } = req.body;
        if (!rfc || !nombre) {
            return res.status(400).json({ message: 'El RFC y el nombre son obligatorios' });
        }
        const nuevo = await proveedoresModelo.crearProveedor(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const actualizarProveedor = async (req, res) => {
    try {
        const { rfc } = req.params;
        if (!rfc || !req.body.nombre) {
            return res.status(400).json({ message: 'El RFC y el nombre son obligatorios' });
        }
        const resultado = await proveedoresModelo.actualizarProveedor(rfc, req.body);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.status(200).json({ message: 'Proveedor actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarProveedor = async (req, res) => {
    try {
        const { rfc } = req.params;
        const resultado = await proveedoresModelo.eliminarProveedor(rfc);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'RFC no encontrado' });
        }
        res.status(200).json({ message: 'Proveedor eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};