import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import * as usuarioModel from '../models/usuarios.model.js'

export const login = async(req, res)=>{
    try{
        const{email, password} = req.body
        if(!email|| !password) return res.status(400).json({message:'Todos los campos son obligatorios'})
            
        const usuario = await usuarioModel.findUsuarioByEmai(email)
        if (!usuario) return res.status(401).json({message:'Credenciales invalidas'})
        
        const pass = await bcrypt.compare(password, usuario.pass)
        if(!pass) return res.status(401).json({message: 'Credenciales invalidas'})

        // Capturamos la IP y el Navegador del usuario en el momento del login
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'IP_Desconocida';
        const userAgent = req.headers['user-agent'] || 'Navegador_Desconocido';

        // Sellamos la huella dentro del token
        const token = jwt.sign(
            {
                id: usuario.id, 
                email: usuario.correo, 
                rol: usuario.rol,
                ip: ip,             
                userAgent: userAgent
            },
            process.env.JWT_SECRET,
            {expiresIn: '8h'}
        )
        
        res.json({token, usuario:{id:usuario.id, nombre: usuario.nombres, rol: usuario.rol}})
    }catch(error){
        res.status(500).json({error: 'Error en el proceso de inicio de sesion'})
    }
}