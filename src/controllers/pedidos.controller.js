import twilio from 'twilio';
import * as pedidosModelo from '../models/pedidos.model.js';
import Stripe from 'stripe';
import { db } from '../config/database.js'; // O como se llame tu conexión
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

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
                    const telefonoAlumno = `+52${pedido.info.vchTelefono}`;

                    const mensaje = `¡Hola ${pedido.info.vchNombres}! ☕ Tu pedido #${id} en Cafetería UTHH está ${estado.toUpperCase()}. Pasa a ventanilla a recogerlo.`;

                    await client.messages.create({
                        body: mensaje,
                        from: 'whatsapp:+14155238886',
                        to: `whatsapp:${telefonoAlumno}`
                    });

                    console.log(`WhatsApp enviado exitosamente a ${telefonoAlumno}`);
                }
            } catch (twilioError) {
                // Si Twilio falla (ej. número no válido), no rompemos la API, solo avisamos en consola
                console.error("Error al enviar el WhatsApp:", twilioError.message);
            }
        }
        // -------------------------------------------------------------

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
        // CAMBIA ESTO PARA VER EL ERROR REAL:
        res.status(500).json({
            error: 'Fallo en la conexión o consulta',
            mensajeOriginal: error.message, // <--- Esto te dirá la verdad
            codigo: error.code
        });
    }
};


// pedidos.controller.js
// pedidos.controller.js
export const confirmarYRegistrarVenta = async (req, res) => {
    const { sessionId } = req.params;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        // Convertimos explícitamente a número para evitar errores de tipo en MySQL
        const idUsuario = parseInt(session.metadata.idUsuario);
        const total = parseFloat(session.amount_total / 100);

        // Verificamos que no sea un ID inválido antes de insertar
        if (!idUsuario || idUsuario === 0) {
            throw new Error("El ID de usuario recuperado de Stripe no es válido (0 o null)");
        }

        const sql = "INSERT INTO tblpedidos (intIdUsuario, decTotal, dtmFechaHora, vchEstado) VALUES (?, ?, NOW(), 'Preparando')";
        const [resultado] = await db.query(sql, [idUsuario, total]);

        res.json({ success: true, idPedido: resultado.insertId });
    } catch (error) {
        res.status(200).json({ success: false, detalle: error.message }); //
    }
};