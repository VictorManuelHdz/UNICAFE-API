import request from 'supertest';
import app from '../../src/app.js';
import jwt from 'jsonwebtoken';

describe('PI-07: Validación de Id durante la sesión (Anti-IDOR)', () => {

    const secreto = process.env.JWT_SECRET || '8f4e6d2a1b9c3d5e7f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e';

    it('Pasos 2 y 3: Debe bloquear a un Cliente que intente modificar un ID ajeno en la API', async () => {
        // Simulamos el inicio de sesión de un Cliente "Atacante" (Su ID real es el 15)
        const tokenAtacante = jwt.sign(
            { id: 15, email: 'brayan1@gmail.com', rol: 3 },
            secreto,
            { expiresIn: '1h' }
        );

        // El atacante intenta hacer un GET o PUT a la cuenta de la "Víctima" (ID 2)
        const respuesta = await request(app)
            .get('/api/usuarios/2') // Intentando ver el perfil 2
            .set('Authorization', `Bearer ${tokenAtacante}`);

        // Verificamos que el backend lo rechace rotundamente
        expect(respuesta.status).toBe(403);
        
        // Verificamos el mensaje de advertencia del sistema
        expect(respuesta.body.message).toContain('Uso indebido del sistema');
    });

    it('Extra: Debe permitir a un Cliente ver su propio ID', async () => {
        const tokenLegitimo = jwt.sign(
            { id: 15, email: 'brayan1@gmail.com', rol: 3 },
            secreto,
            { expiresIn: '1h' }
        );

        const respuesta = await request(app)
            .get('/api/usuarios/15')
            .set('Authorization', `Bearer ${tokenLegitimo}`);

        // Si la cuenta es suya, o el usuario no existe, pero NO debe dar 403.
        // Dará 200 o 404 (si el 15 no existe en la BD)
        expect(respuesta.status).not.toBe(403);
    });
});