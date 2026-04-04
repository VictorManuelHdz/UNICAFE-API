import request from 'supertest';
import app from '../../src/app.js';
import { db } from '../../src/config/database.js';

describe('PA-04: Validación de transacciones concurrentes en registro (Estrés)', () => {
    
    // Al finalizar todas las pruebas, cerramos el pool de conexiones para que Jest termine bien
    afterAll(async () => {
        await db.end();
    });

    it('Pasos 1 al 4: Debe procesar 10 peticiones de registro simultáneas sin colapsar', async () => {
        
        // Creamos un arreglo con 10 promesas (10 peticiones HTTP concurrentes)
        const peticionesConcurrentes = [];

        for (let i = 1; i <= 10; i++) {
            // Generamos datos únicos para evitar errores de correos duplicados
            const usuarioSimulado = {
                nombres: `UsuarioTest${i}`,
                apellidoPaterno: 'Concurrente',
                apellidoMaterno: 'Stress',
                telefono: `771000000${i}`, // Simulamos teléfonos distintos
                correo: `stresstest${i}_${Date.now()}@test.com`, // Correo único garantizado
                direccion: 'Calle Falsa 123',
                password: 'PasswordSegura123',
                // Enviamos rol porque en tus pruebas anteriores vimos que lo requieres,
                // aunque en registro de clientes lo forzabas a 3.
                rol: 3 
            };

            // Preparamos la petición pero NO la ejecutamos todavía
            // Asumiendo que tu ruta de registro es /api/usuarios/registro
            const peticion = request(app)
                .post('/api/usuarios/registro') // Ajusta esto a tu endpoint real
                .send(usuarioSimulado);
            
            peticionesConcurrentes.push(peticion);
        }

        // ¡EL ATAQUE! Ejecutamos las 10 peticiones EXACTAMENTE AL MISMO TIEMPO
        const respuestas = await Promise.all(peticionesConcurrentes);

        // Verificamos el Resultado Esperado
        respuestas.forEach((respuesta, index) => {
            // Cada una de las 10 respuestas debió ser exitosa (201 Created)
            expect(respuesta.status).toBe(201);
            
            // Confirmamos que la base de datos generó un ID para cada uno
            expect(respuesta.body).toHaveProperty('id');
            expect(respuesta.body.nombres).toBe(`UsuarioTest${index + 1}`);
        });

        // Si llegamos hasta aquí, significa que el pool manejó las 10 conexiones simultáneas
        // sin bloquearse (Deadlocks) y aplicó los COMMITS correctamente.
    });
});