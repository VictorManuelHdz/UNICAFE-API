import * as menuModelo from '../models/menu.model.js'

export const getAllPlatillos = async(req, res)=>{
    try{
        const platillos = await menuModelo.getPlatillos();
        res.status(200).json(platillos);
    } catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getPlatillo = async(req, res)=>{
    try{
        const platillo = await menuModelo.getPlatillo(req.params.id)
        if(!platillo){
            return res.status(404).json({message:'Platillo no encontrado'})
        }
        res.status(200).json(platillo)
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export const crearPlatillo = async(req,res)=>{
    try {
        // Validación basada en tu tabla tblPlatillos
        if (!req.body.vchNombre) {
            return res.status(400).json({message:'El campo nombre es requerido'})
        }
        const nuevo = await menuModelo.crearPlatillo(req.body)
        res.status(201).json(nuevo)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const actualizarPlatillo = async(req,res)=>{
    try {
        const {id} = req.params

        if (!id || !req.body.vchNombre) {
            return res.status(400).json({message: 'El ID y nombre son obligatorios'})
        }
        const actualizado = await menuModelo.actualizarPlatillo(id, req.body)
        res.status(200).json(actualizado)
    } catch (error) {
        res.status(500).json({error:error.message}) 
    }
}

export const eliminarPlatillo = async(req,res)=>{
    try {
        const {id} = req.params
        if (!id) {
            return res.status(400).json({message: 'El id es obligatorio para esta accion'})
        }
        const eliminar = await menuModelo.eliminarPlatillo(id)
        res.status(200).json(eliminar)
    } catch (error) {
        res.status(500).json({error:error.message}) 
    }
}