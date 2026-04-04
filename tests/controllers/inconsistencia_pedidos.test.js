import request from 'supertest';
import app from '../../src/app.js';
import { db } from '../../src/config/database.js'; 
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

describe('PI-10: Detección de Inconsistencia en Pedido (Trazabilidad)', () => {
    
    const secreto = process.env.JWT_SECRET || 'clave_secreta_de_prueba';

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('Pasos 3 y 4: Debe detectar un pedido alterado manualmente (sin artículos) y retornar Error 409', async () => {
        
        // 1. Simulamos un token de Admin QUE INCLUYE LA HUELLA DEL DISPOSITIVO (Para pasar el escudo PI-08)
        const tokenValido = jwt.sign(
            { 
                id: 1, 
                rol: 1,
                ip: '127.0.0.1',                 
                userAgent: 'Navegador-De-Prueba' 
            }, 
            secreto, 
            { expiresIn: '1h' }
        );

        // 2. SIMULACIÓN DEL ATAQUE A NIVEL SQL (Paso 2)
        jest.spyOn(db, 'query').mockImplementation((queryString) => {
            if (queryString.includes('FROM tblpedidos p')) {
                return Promise.resolve([[{ intIdPedido: 999, vchEstado: 'Pendiente', decTotal: 150 }]]);
            }
            if (queryString.includes('FROM tbldetalle_pedido')) {
                return Promise.resolve([[]]); // Inconsistencia simulada
            }
            return Promise.resolve([[]]);
        });

        // 3. Hacemos la consulta ENVIANDO LA HUELLA EXACTA en los encabezados
        const respuesta = await request(app)
            .get('/api/pedidos/999')
            .set('Authorization', `Bearer ${tokenValido}`)
            .set('x-forwarded-for', '127.0.0.1')         // Simulamos la IP
            .set('user-agent', 'Navegador-De-Prueba');   // Simulamos el navegador

        // 4. Verificamos que el sistema ahora sí pueda atrapar la inconsistencia
        expect(respuesta.status).toBe(409); // 409 Conflict
        expect(respuesta.body.error).toBe('Inconsistencia de datos detectada');
        expect(respuesta.body.message).toContain('La integridad del registro ha sido comprometida');
    });
});