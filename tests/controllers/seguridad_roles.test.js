import request from 'supertest';
import app from '../../src/app.js'; // Ajusta la ruta a tu app.js si es necesario
import jwt from 'jsonwebtoken';

describe('PI-05: Validación de Acceso por Rol (Seguridad e Integración)', () => {

    // Necesitamos la misma clave secreta que usa tu servidor para crear tokens válidos
    const secreto = process.env.JWT_SECRET || 'clave_secreta_de_prueba';

    it('Paso 1 y 5: Debe bloquear a un CLIENTE (Rol 3) al intentar eliminar un producto', async () => {
        // Simulamos el inicio de sesión creando un token falso pero válido de Cliente
        const tokenCliente = jwt.sign(
            { id: 99, email: 'cliente@test.com', rol: 3 },
            secreto,
            { expiresIn: '1h' }
        );

        // El cliente intenta inyectar una petición DELETE hacia los productos
        const respuesta = await request(app)
            .delete('/api/productos/1')
            .set('Authorization', `Bearer ${tokenCliente}`); // Enviamos el token

        // Verificamos que el servidor reaccione con el Error 403
        expect(respuesta.status).toBe(403);
        // Verificamos que los datos permanecen intactos devolviendo el mensaje de rechazo
        expect(respuesta.body.message).toContain('Acceso denegado');
    });

    it('Extra: Debe bloquear a un EMPLEADO (Rol 2) al intentar ver la tabla de Usuarios', async () => {
        // Simulamos un token de Empleado
        const tokenEmpleado = jwt.sign(
            { id: 88, email: 'empleado@test.com', rol: 2 },
            secreto,
            { expiresIn: '1h' }
        );

        // El empleado intenta entrar a la ruta exclusiva de Administradores
        const respuesta = await request(app)
            .get('/api/usuarios')
            .set('Authorization', `Bearer ${tokenEmpleado}`);

        // Verificamos que el servidor lo rebote con Error 403
        expect(respuesta.status).toBe(403);
        expect(respuesta.body.message).toContain('Solo Administradores');
    });
});