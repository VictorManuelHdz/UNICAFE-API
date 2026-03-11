import * as productosmodelo from '../models/productos.model.js'

export const getAllproductos = async (req, res) => {
    try {
        // Capturamos lo que viene después del '?' (ej: ?categoria=6)
        const { categoria } = req.query; 

        if (categoria) {
            // Llamamos a la función de filtrado en el modelo
            const productosFiltrados = await productosmodelo.getProductosByCategoria(categoria);
            return res.status(200).json(productosFiltrados);
        }

        // Si no hay categoría, ejecutamos la lógica normal de traer todo
        const todos = await productosmodelo.getproductos();
        res.status(200).json(todos);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getproducto = async(req, res)=>{
    try {
        const producto = await productosmodelo.getproducto(req.params.id)
        if(!producto) {
            return res.status(404).json({message: 'Producto no encontrado'})
        }
        res.status(200).json(producto)
    } catch(error) {
        res.status(500).json({error: error.message})
    }
}

export const crearProducto = async(req, res)=>{
    try {
        // Validamos con el nombre amigable que viene del body
        if (!req.body.nombre) {
            return res.status(400).json({message: 'El campo nombre es requerido'})
        }
        const nuevo = await productosmodelo.crearProducto(req.body)
        res.status(201).json(nuevo)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export const actualizarProducto = async(req, res)=>{
    try {
        const {id} = req.params
        // Validamos con el nombre amigable
        if (!id || !req.body.nombre) {
            return res.status(400).json({message: 'El ID y nombre son obligatorios'})
        }
        const actualizado = await productosmodelo.actualizarProducto(id, req.body)
        res.status(200).json(actualizado)
    } catch (error) {
        res.status(500).json({error: error.message}) 
    }
}

export const eliminarProducto = async(req, res)=>{
    try {
        const {id} = req.params
        if (!id) {
            return res.status(400).json({message: 'El id es obligatorio'})
        }
        const eliminar = await productosmodelo.eliminarProducto(id)
        res.status(200).json(eliminar)
    } catch (error) {
        res.status(500).json({error: error.message}) 
    }
}

export const getCategoriaProductos = async (req, res) => {
    try {
        const { categoria } = req.query; // Capturamos ?categoria=X de la URL
        
        let productos;
        if (categoria) {
            productos = await productosmodelo.getProductosByCategoria(categoria);
        } else {
            productos = await productosmodelo.getproductos();
        }
        
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};