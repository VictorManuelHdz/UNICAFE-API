import Stripe from 'stripe'; // Stripe va con S mayúscula en el import
import dotenv from 'dotenv'; // Se escribe dotenv, no dotnev

dotenv.config();

// Inicialización corregida
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const crearSessionPago = async (req, res) => {
    try {
        const { productos } = req.body;

        // Stripe usa minúsculas para checkout: stripe.checkout, no stripe.Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: productos.map(item => ({
                price_data: {
                    currency: 'mxn', // Es 'mxn', no 'mx'
                    product_data: { // Se escribe product_data, no prodct_data
                        name: item.nombre, // Asegúrate que sea item.nombre (como en tu carrito.js)
                        images: [item.imagen], // Era item.imagen, no p.imagen
                    },
                    unit_amount: Math.round(item.precio * 100), // Se escribe unit_amount, no unit_amout
                },
                quantity: item.cantidad,
            })),
            mode: 'payment',
           // pagos.controller.js
// pagos.controller.js
// Dentro de crearSessionPago en pagos.controller.js
// Dentro de crearSessionPago en pagos.controller.js
metadata: { 
    // Asegúrate de que el nombre coincida con tu Login. 
    // Si tu tabla usa intIdUsuario, lo más probable es que en el token se llame igual.
    idUsuario: String(req.usuario?.intIdUsuario || req.usuario?.id || '0'), 
    carrito: JSON.stringify(productos)
},
            success_url: `https://victormanuelhdz.github.io/UNICAFE-FRONTEND/public/mis_pedidos.html?pago=exitoso&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: 'https://victormanuelhdz.github.io/UNICAFE-FRONTEND/public/menu.html'
        });

        res.json({ url: session.url });

    } catch (error) {
        console.error("Error en Stripe:", error.message);
        res.status(500).json({ error: error.message });
    }
}

export const confirmarPago = async (req, res) => { // Agregamos req y res que faltaban
    try {
        // Es sessions (en plural) y session (en singular) para retrieve
        const session = await stripe.checkout.sessions.retrieve(req.params.id);
        res.json({
            status: session.payment_status,
            cliente: session.customer_details.name
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}