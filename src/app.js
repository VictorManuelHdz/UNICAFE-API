import express from 'express'
import cors from 'cors'
import productosRoutes from './routes/productos.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/productos', productosRoutes)

const PORT =3000

app.get('/',(req,res)=>{
    res.send("Api desde express")
})
app.listen(PORT,()=>{

    console.log(`Servidor corriendo en el puerto ${PORT}`)
})