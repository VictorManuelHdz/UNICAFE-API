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
import terminosRoutes from './routes/terminos.routes.js'
import avisoRoutes from './routes/avisoPrivacidad.routes.js'
import categoriaMenu from './routes/categoriaMenu.routes.js'
import authRoutes from './routes/auth.routes.js'
import pagosRoutes from './routes/pagos.routes.js'
import rutasReportes from './routes/reportes.routes.js'

const app = express()


app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/productos', productosRoutes)
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/categorias',categoriasRoutes )
app.use('/api/proveedores', proveedoresRoutes)
app.use('/api/roles', rolesRoutes)
app.use('/api/pedidos', pedidosRoutes)
app.use('/api/somos',somosRoutes)
app.use('/api/terminos', terminosRoutes)
app.use('/api/aviso', avisoRoutes)
app.use('/api/categorias-menu', categoriaMenu)
app.use('/api/pagos', pagosRoutes)
app.use('/api/reportes', rutasReportes)


const PORT =3000

app.get('/',(req,res)=>{
    res.send("Api desde express")
})
app.listen(PORT,()=>{

    console.log(`Servidor corriendo en el puerto ${PORT}`)
})