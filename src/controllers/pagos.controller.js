import stripe from 'stripe'
import dotnev from 'dotenv'

const stripe = new stripe(process.env.STRIPE_SECRET_KEY)

export const crearSessionPago = async(req,res)=>{
    try {
        const {productos}=req.body;
        const session = await stripe.Checkout.sessions.create({
            payment_method_types:['card'],
            line_items: productos.map(item=>({
                price_data: {
                    currency: 'mx',
                    prodct_data:{
                        name: item.name,
                        description: 'Pedido Unicafe'
                    },
                    unit_amout: Math.round(item.price *100),
                },
                quantity: item.cantidad,
            })),
            mode: 'payment',
            success_url:`${process.env.STRIPE_SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })
        res.json({url : session.url})

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const confirmarPago = async()=>{
    try {
        const session = await stripe.Checkout.session.retrieve(req.params.id)
        res.json({status: session.payment_status, cliente: session.customer_details.name})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}