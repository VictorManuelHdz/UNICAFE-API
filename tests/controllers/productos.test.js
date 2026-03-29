import request from 'supertest';
import app from '../../src/app.js';
import { db } from '../../src/config/database.js';  
import { jest } from '@jest/globals';

describe('PU-01: Manejo de excepción por fallo de conexión a BD', () => {
    
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Debe capturar la excepción y devolver status 500 con un mensaje controlado', async () => {
        
        // Cuando el controlador intente hacer un db.query, lanzará nuestro error falso
        jest.spyOn(db, 'query').mockRejectedValue(new Error('ECONNREFUSED: Database connection failed'));

        // PASO 3: Acción - Enviamos la petición a través de Supertest
        const productoPrueba = { nombre: 'Torta Cubana', precioVenta: 45 };
        
        const respuesta = await request(app)
            .post('/api/productos') 
            .send(productoPrueba);

        // Resultado Esperado
        expect(respuesta.status).toBe(500);
        expect(respuesta.body).toEqual({
            status: 'error',
            message: 'Ocurrió un error interno al intentar guardar el producto. Por favor, inténtelo más tarde.'
        });
        
        // Confirmamos que el sistema sí intentó hacer la consulta a la BD antes de fallar
        expect(db.query).toHaveBeenCalled();
    });
});