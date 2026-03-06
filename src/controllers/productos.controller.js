import * as productosmodelo from '../models/productos.model.js'

export const getAllproductos = async(req, res)=>{

    try{
        const productos = await productosmodelo.getproductos();
        res.status(200).json(productos);

    } catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getproducto = async(req, res)=>{
    try{
        const producto = await productosmodelo.getproducto(req.params.id)
        if(!producto){
            return res.status(404).json({message:'Producto no encontrado'})
        }
        res.status(200).json(producto)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}