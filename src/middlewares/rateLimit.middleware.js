import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Tiempo de ventana: 15 minutos
    max: 5, // Límite estricto: 5 peticiones por IP
    message: { 
        message: 'Demasiados intentos de inicio de sesión. Cuenta bloqueada temporalmente. Por favor, inténtelo de nuevo en 15 minutos.' 
    },
    standardHeaders: true, // Devuelve información del límite en los headers
    legacyHeaders: false, 
});