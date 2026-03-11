import * as categoriasModelo from '../models/categorias.model.js'

export const getAllCategorias = async(req, res)=>{
    try{
        const categorias = await categoriasModelo.getCategorias();
        res.status(200).json(categorias);
    } catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getCategoria = async(req, res)=>{
    try{
        const categoria = await categoriasModelo.getCategoria(req.params.id)
        if(!categoria){
            return res.status(404).json({message:'Categoría no encontrada'})
        }
        res.status(200).json(categoria)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export const crearCategoria = async(req,res)=>{
    try {
        if (!req.body.vchCategoria) {
            return res.status(400).json({message:'El nombre de la categoría es requerido'})
        }
        const nueva = await categoriasModelo.crearCategoria(req.body)
        res.status(201).json(nueva)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const actualizarCategoria = async(req,res)=>{
    try {
        const {id} = req.params
        if (!id || !req.body.vchCategoria) {
            return res.status(400).json({message: 'El ID y el nombre de la categoría son obligatorios'})
        }
        const actualizada = await categoriasModelo.actualizarCategoria(id, req.body)
        res.status(200).json(actualizada)
    } catch (error) {
        res.status(500).json({error:error.message}) 
    }
}

export const eliminarCategoria = async(req,res)=>{
    try {
        const {id} = req.params
        if (!id) {
            return res.status(400).json({message: 'El ID es obligatorio para esta acción'})
        }
        const eliminar = await categoriasModelo.eliminarCategoria(id)
        res.status(200).json(eliminar)
    } catch (error) {
        res.status(500).json({error:error.message}) 
    }
}