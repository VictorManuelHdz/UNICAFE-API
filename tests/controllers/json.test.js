import request from 'supertest';
import app from '../../src/app.js';

describe('PU-08: Validación de integridad de trama JSON (AJAX)', () => {
    
    it('Debe rechazar peticiones con JSON malformado y retornar Error 400', async () => {
        
        const jsonCorrupto = '{ "usuario": "admin", "accion": "login" ';

        // Enviamos la petición POST
        // Mandamos el string puro, y forzamos el Content-Type a JSON
        // para que body-parser intente procesarlo y explote.
        const respuesta = await request(app)
            .post('/api/usuarios/login') // Ajusta esto a tu endpoint real de login
            .set('Content-Type', 'application/json')
            .send(jsonCorrupto);

        // El servidor no debe crashear, debe responder con 400 (Bad Request)
        expect(respuesta.status).toBe(400);
        
        // Debe contener el mensaje informativo
        expect(respuesta.body).toEqual({
            status: 'error',
            message: 'Invalid JSON. La estructura de los datos enviados es incorrecta o está malformada.'
        });
    });
});