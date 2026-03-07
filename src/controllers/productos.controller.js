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

export const crearProducto =async(req,res)=>{
    try {
        if (!req.body.vchNombre) {
            return res.status(400).json({message:'El campo nombre es requerido'})
        }
        const nuevo =await productosmodelo.crearProducto(req.body)
        res.status(201).json(nuevo)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const actualizarProducto = async(req,res)=>{

    try {
        const {id} =req.params

        if (!id||!req.body.vchNombre) {
            return res.status(400).json({message: 'El ID y nombre son obligatorios'})
        }
        const actualizado = await productosmodelo.actualizarProducto(id, req.body)
        res.status(200).json(actualizado)
    } catch (error) {
        res.status(500).json({error:error.message}) 
    }
}

export const eliminarProducto=async(req,res)=>{
    try {
        const {id}=req.params
        if (!id) {
            return res.status(400).json({message: 'El id es obligatorio para esta accion'})
        }
        const eliminar = await productosmodelo.eliminarProducto(id)
        res.status(200).json(eliminar)
    } catch (error) {
        res.status(500).json({error:error.message}) 
    }
}