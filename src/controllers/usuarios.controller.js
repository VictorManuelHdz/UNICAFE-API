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

export const crearUsuario =async(req,res)=>{
    try {
        // 1. Extraemos todos los campos del cuerpo de la petición
        const { 
            vchNombres, 
            vchApaterno, 
            vchAmaterno, 
            vchTelefono, 
            vchCorreo, 
            vchDireccion, 
            vchPassword, 
            intIdRol 
        } = req.body;

        if (!vchNombres||!vchApaterno||!vchAmaterno||!vchTelefono||!vchCorreo||!vchDireccion||!vchPassword||!intIdRol) {
            return res.status(400).json({message:'Todos los campos son requeridos'})
        }
        const nuevo =await usuariosmodelo.crearUsuario(req.body)
        res.status(201).json(nuevo)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const actualizarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const datosActualizar = req.body;

        // Validamos que haya algo que actualizar
        if (!id || Object.keys(datosActualizar).length === 0) {
            return res.status(400).json({ 
                message: 'Se requiere el ID y al menos un campo para modificar.' 
            });
        }

        // Llamamos al modelo dinámico que pusimos arriba
        const resultado = await usuariosmodelo.actualizarUsuario(id, datosActualizar);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Datos actualizados correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const eliminarUsuario =async(req,res)=>{
    try {
        const {id}=req.params
        if (!id) {
            return res.status(400).json({message: 'El id es obligatorio para esta accion'})
        }
        const eliminar = await usuariosmodelo.elimianrUsuario(id)
        res.status(200).json(eliminar)
    } catch (error) {
        res.status(500).json({error:error.message}) 
    }
}