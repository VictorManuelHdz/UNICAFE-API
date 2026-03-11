import * as pedidosModelo from '../models/pedidos.model.js';

export const getAllPedidos = async (req, res) => {
    try {
        const pedidos = await pedidosModelo.getPedidos();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearPedido = async (req, res) => {
    try {
        const { cliente, detalle, total, idUsuario } = req.body;
        
        if (!cliente || !detalle || total === undefined || !idUsuario) {
            return res.status(400).json({ message: 'Cliente, detalle, total e idUsuario son obligatorios' });
        }

        const nuevo = await pedidosModelo.crearPedido(req.body);
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};