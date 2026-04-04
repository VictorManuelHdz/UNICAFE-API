import request from 'supertest';
import app from '../../src/app.js';
import jwt from 'jsonwebtoken';

describe('PI-09: Seguridad Especial - Prevención de Escalamiento de Privilegios', () => {

    it('Paso 2, 3 y 4: Debe detectar la alteración manual del token (cambio de IdRol) y retornar 403 para forzar cierre de sesión', async () => {
        
        // 1. Un Cliente inicia sesión legítimamente
        const claveRealDelServidor = process.env.JWT_SECRET || 'clave_secreta_de_prueba';
        const tokenLegitimoCliente = jwt.sign({ id: 10, email: 'cliente@test.com', rol: 3 }, claveRealDelServidor);

        // 2. EL ATAQUE: El cliente entra al LocalStorage, extrae el texto del token, 
        // lo decodifica y cambia su rol a "1" (Admin).
        // Al intentar volver a firmarlo, como no tiene la clave de tu servidor, 
        // usa cualquier otra clave falsa.
        const tokenAlteradoManualmente = jwt.sign({ id: 10, email: 'cliente@test.com', rol: 1 }, "clave_falsa_del_hacker");

        // 3. El atacante intenta acceder al panel de Administrador de Usuarios
        const respuesta = await request(app)
            .get('/api/usuarios')
            .set('Authorization', `Bearer ${tokenAlteradoManualmente}`);

        // 4. Verificación del Sistema
        // El backend detecta la firma falsa y retorna el código de rechazo (403) 
        // que nuestro frontend atrapará para cerrar la sesión (localStorage.clear())
        expect(respuesta.status).toBe(403);
        expect(respuesta.body.message).toContain('token no valido'); // O el mensaje que tengas en auth.middleware.js
    });
});