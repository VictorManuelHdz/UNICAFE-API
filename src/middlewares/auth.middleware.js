import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) =>{
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: "acesso denegado token requerido"})
    }

    const token = authHeader.split(' ')[1]

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = verificado
        next();
    } catch (error) {
        res.status(403).json({message: 'token no valido o expirado'})
    }
} 

export const verificarRolAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    // El rol 1 es Admin. Si no es 1, le negamos la entrada
    if (req.usuario.rol !== 1) {
        return res.status(403).json({ message: 'Acceso denegado: Se requieren permisos de Administrador.' });
    }

    next();
};