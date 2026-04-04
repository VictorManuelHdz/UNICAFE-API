import request from 'supertest';
import app from '../../src/app.js';
import jwt from 'jsonwebtoken';

describe('PI-08: Validación de sesión única por dispositivo', () => {

    const secreto = process.env.JWT_SECRET || 'clave_secreta_de_prueba';

    it('Pasos 4 y 5: Debe invalidar un token si cambia el dispositivo (Robo de Sesión)', async () => {
        
        // 1. Simulamos un token creado legítimamente desde un iPhone (Safari)
        const tokenOriginal = jwt.sign(
            { 
                id: 1, 
                rol: 3,
                ip: '192.168.1.5',
                userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit' 
            },
            secreto,
            { expiresIn: '1h' }
        );

        // 2. El "Atacante" robó el token e intenta usarlo desde una PC con Windows (Chrome)
        const respuesta = await request(app)
            .get('/api/usuarios/1') // Intentamos acceder a una ruta protegida
            .set('Authorization', `Bearer ${tokenOriginal}`)
            .set('x-forwarded-for', '200.150.10.2') // IP distinta
            .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0'); // Navegador distinto

        // 3. Verificamos que el servidor bloquee el acceso
        expect(respuesta.status).toBe(403);
        
        // 4. Verificamos que exija un nuevo inicio de sesión (Paso 5 del documento)
        expect(respuesta.body.message).toContain('Anomalía de sesión detectada');
    });

    it('Debe permitir el acceso si el dispositivo es el original', async () => {
        // Token desde Chrome en Windows
        const tokenOriginal = jwt.sign(
            { 
                id: 1, rol: 3, 
                ip: '127.0.0.1', 
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0' 
            }, secreto, { expiresIn: '1h' }
        );

        // La petición viene del mismo navegador y la misma IP
        const respuesta = await request(app)
            .get('/api/usuarios/1')
            .set('Authorization', `Bearer ${tokenOriginal}`)
            .set('x-forwarded-for', '127.0.0.1') 
            .set('user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/115.0.0.0');

        // El servidor NO debe bloquearlo con Error 403 por anomalía
        expect(respuesta.status).not.toBe(403);
    });
});