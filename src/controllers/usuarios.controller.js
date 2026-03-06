import * as usuariosmodelo from '../models/usuarios.model.js'

export const getAllUsuarios = async(req, res)=>{

    try{
        const usuarios = await usuariosmodelo.getUsuarios();
        res.status(200).json(usuarios);
    }catch(error){
        res.status(500).json({error:error.message})
    }
}

export const getUsuario = async(req, res)=>{
    try {
        const usuario= await usuariosmodelo.getUsuario(req.params.id)
        if(!usuario)
        {
            return res.status(404).json({message:'Usuario no encontrado'})
        }
        res.status(200).json(usuario)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}