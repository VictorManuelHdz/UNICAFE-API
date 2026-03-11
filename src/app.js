import express from 'express'
import cors from 'cors'
import productosRoutes from './routes/productos.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import menuRoutes from './routes/menu.routes.js'
import categoriasRoutes from './routes/categorias.routes.js'
import proveedoresRoutes from './routes/proveedores.routes.js'
import rolesRoutes from './routes/roles.routes.js'
import pedidosRoutes from './routes/pedidos.routes.js'
import somosRoutes from './routes/somos.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/productos', productosRoutes)
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/categorias',categoriasRoutes )
app.use('/api/proveedores', proveedoresRoutes)
app.use('/api/roles', rolesRoutes)
app.use('/api/pedidos', pedidosRoutes)
app.use('/api/somos',somosRoutes)

const PORT =3000

app.get('/',(req,res)=>{
    res.send("Api desde express")
})
app.listen(PORT,()=>{

    console.log(`Servidor corriendo en el puerto ${PORT}`)
})