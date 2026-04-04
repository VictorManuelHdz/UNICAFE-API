import request from 'supertest';
import app from '../../src/app.js'; 
import { db } from '../../src/config/database.js'; 
import { jest } from '@jest/globals';

describe('PU-07: Validación de sanitización de entradas (Anti-XSS)', () => {
    
    afterEach(() => {
        jest.restoreAllMocks(); 
    });

    it('Debe eliminar etiquetas <script> antes de guardar en la base de datos', async () => {
        
        // Espiamos la base de datos para ver qué intenta guardar exactamente
        const dbSpy = jest.spyOn(db, 'query').mockResolvedValue([{ affectedRows: 1 }]);

        // Payload Malicioso según tu Caso de Prueba
        const ataqueXSS = {
            contenido: "<h1>Aviso importante</h1><script>alert('XSS');</script><p>Venta al 2x1</p>"
        };
        
        // PASO 2 y 3: Enviamos el ataque a la ruta de creación (o edición)
        const respuesta = await request(app)
            .post('/api/aviso') // Ajusta tu ruta según app.js
            .send(ataqueXSS);

        // Verificamos que la API responda con éxito
        expect(respuesta.status).toBe(201);
        
        // PASO 5: Verificamos el registro que intentó ir a la base de datos (SQL)
        // Obtenemos los valores con los que se llamó a la base de datos
        const llamadaBD = dbSpy.mock.calls[0][1]; 
        const textoGuardado = llamadaBD[1]; // El contenido es el segundo parámetro en tu query

        // RESULTADO ESPERADO: El texto debe estar limpio del script
        expect(textoGuardado).not.toContain('<script>');
        expect(textoGuardado).not.toContain("alert('XSS')");
        
        // Pero sí debe conservar el HTML válido
        expect(textoGuardado).toContain('<h1>Aviso importante</h1>');
        expect(textoGuardado).toContain('<p>Venta al 2x1</p>');
    });
});