import request from 'supertest';
import app from '../../src/app.js';

describe('PSIS-01: Resistencia a ataques de Fuerza Bruta', () => {

    it('Pasos 1, 2 y 3: Debe bloquear la IP (HTTP 429) después de 5 intentos de login', async () => {
        
        // Credenciales que simulan el ataque de tu documento
        const credencialesAtaque = {
            email: 'angel@gmail.com',
            password: '123'
        };

        // PASO 1: Disparamos los primeros 5 intentos fallidos
        for (let i = 0; i < 5; i++) {
            const respuesta = await request(app)
                .post('/api/auth/login') // Ajusta esto si tu ruta es distinta
                .send(credencialesAtaque);
                
            // El servidor contesta 401 (Unauthorized) porque la contraseña es falsa
            expect(respuesta.status).toBe(401);
        }

        // PASOS 2 y 3: Disparamos el intento número 6 (El que rebasa el límite)
        const respuestaBloqueada = await request(app)
            .post('/api/auth/login')
            .send(credencialesAtaque);

        // Verificamos que el servidor reaccione con el código HTTP 429 (Too Many Requests)
        expect(respuestaBloqueada.status).toBe(429);
        
        // Verificamos el mensaje de tu tabla
        expect(respuestaBloqueada.body.message).toContain('Cuenta bloqueada temporalmente');
    });
});