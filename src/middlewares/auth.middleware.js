import jwt from 'jsonwebtoken'

export const verificarToken = (req, res, next) =>{
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: "acesso denegado token requerido"})
    }

    const token = authHeader.split(' ')[1]

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET)
        
        const currentIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'IP_Desconocida';
        const currentUserAgent = req.headers['user-agent'] || 'Navegador_Desconocido';

        // Comparamos si coinciden con los que se sellaron el día del Login
        if (verificado.ip !== currentIp || verificado.userAgent !== currentUserAgent) {
            // Si no coinciden, es un clon o un robo de token. Rechazamos el acceso.
            return res.status(403).json({ 
                message: 'Anomalía de sesión detectada. Por seguridad, inicie sesión nuevamente.' 
            });
        }

        req.usuario = verificado
        next();
    } catch (error) {
        res.status(403).json({message: 'token no valido o expirado'})
    }
} 

// ... (Aquí dejas tus funciones verificarRolAdmin y verificarRolEmpleadoOAdmin tal como están) ...

export const verificarRolAdmin = (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ message: 'No autenticado' });
    
    if (req.usuario.rol !== 1) {
        return res.status(403).json({ message: 'Acceso denegado: Solo Administradores.' });
    }
    next();
};

export const verificarRolEmpleadoOAdmin = (req, res, next) => {
    if (!req.usuario) return res.status(401).json({ message: 'No autenticado' });
    
    if (req.usuario.rol !== 1 && req.usuario.rol !== 2) {
        return res.status(403).json({ message: 'Acceso denegado: Se requiere nivel de Empleado o Superior.' });
    }
    next();
};