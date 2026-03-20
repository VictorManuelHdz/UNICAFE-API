import * as pedidosModelo from '../models/pedidos.model.js';

export const getAllPedidos = async (req, res) => {
    try {
        const pedidos = await pedidosModelo.getPedidos();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPedido = async (req, res) => {
    try {
        const { id } = req.params;
        const pedido = await pedidosModelo.getPedidoById(id);

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }
        res.status(200).json(pedido);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const crearPedido = async (req, res) => {
    try {
        const { idUsuario, total, notas, carrito } = req.body;

        // Verificamos que no nos manden un carrito fantasma
        if (!idUsuario || total === undefined || !carrito || carrito.length === 0) {
            return res.status(400).json({ message: 'Faltan datos obligatorios o el carrito está vacío' });
        }

        const folio = await pedidosModelo.crearPedido(idUsuario, total, notas, carrito);

        res.status(201).json({
            message: 'Pedido registrado con éxito',
            folio: folio
        });
    } catch (error) {
        console.error("Error al crear pedido:", error);
        res.status(500).json({ error: 'Ocurrió un error al procesar el pedido' });
    }
};

export const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!estado) return res.status(400).json({ message: 'El estado es requerido' });

        const actualizado = await pedidosModelo.actualizarEstadoPedido(id, estado);

        if (!actualizado) return res.status(404).json({ message: 'Pedido no encontrado' });

        res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};