import * as pedidosModelo from '../models/pedidos.model.js';
import Stripe from 'stripe';
import { db } from '../config/database.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

        if (estado.toLowerCase() === 'listo' || estado.toLowerCase() === 'entregado') {
            try {
                const pedido = await pedidosModelo.getPedidoById(id);

                if (pedido && pedido.info.vchTelefono) {
                    const chatId = `+52${pedido.info.vchTelefono}@c.us`; 

                    const mensaje = `¡Hola ${pedido.info.vchNombres}! ☕ Tu pedido #${id} en Cafetería UTHH está ${estado.toUpperCase()}. Pasa a ventanilla a recogerlo.`;

                    const urlGreenApi = `${process.env.GREEN_API_URL}/waInstance${process.env.GREEN_API_ID}/sendMessage/${process.env.GREEN_API_TOKEN}`;

                    const greenRes = await fetch(urlGreenApi, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chatId: chatId,
                            message: mensaje
                        })
                    });

                    if (greenRes.ok) {
                        console.log(`WhatsApp enviado exitosamente al alumno: ${pedido.info.vchTelefono}`);
                    } else {
                        const errorData = await greenRes.json();
                        console.error("Fallo al enviar WhatsApp por Green API:", errorData);
                    }
                }
            } catch (whatsAppError) {
                console.error("Excepción al intentar enviar el WhatsApp:", whatsAppError.message);
            }
        }

        res.status(200).json({ message: 'Estado actualizado correctamente' });
    } catch (error) {
        console.error("Error al cambiar estado:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const getPedidosUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const pedidos = await pedidosModelo.getPedidosByUsuarioId(id);
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({
            error: 'Fallo en la conexión o consulta',
            mensajeOriginal: error.message,
            codigo: error.code
        });
    }
};

export const confirmarYRegistrarVenta = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const idUsuario = parseInt(session.metadata.idUsuario);
        const total = parseFloat(session.amount_total / 100);

        if (!idUsuario || isNaN(idUsuario) || idUsuario === 0) {
            return res.status(200).json({ 
                success: false, 
                detalle: `ID de usuario inválido recuperado: ${session.metadata.idUsuario}` 
            });
        }

        const sql = "INSERT INTO tblpedidos (intIdUsuario, decTotal, dtmFechaHora, vchEstado) VALUES (?, ?, NOW(), 'Preparando')";
        const [resultado] = await db.query(sql, [idUsuario, total]);

        res.json({ success: true, idPedido: resultado.insertId });
    } catch (error) {
        res.status(200).json({ success: false, detalle: error.message });
    }
};