import { db } from '../config/database.js';

// 1. Obtener todos los pedidos (Para el panel de empleados/admins)
export const getPedidos = async () => {
    const [rows] = await db.query(`
        SELECT 
            p.intIdPedido AS idPedido, 
            p.dtmFechaHora AS fecha, 
            p.decTotal AS total, 
            p.vchEstado AS estado, 
            p.vchNotas AS notas,
            u.intIdUsuario AS idUsuario,
            u.vchNombres AS nombreCliente,
            u.vchApaterno AS apellidoCliente
        FROM tblpedidos p
        JOIN tblusuario u ON p.intIdUsuario = u.intIdUsuario
        ORDER BY p.dtmFechaHora DESC
    `);
    return rows;
};

// 2. Obtener un pedido específico con TODO su detalle
export const getPedidoById = async (id) => {
    const [pedidoInfo] = await db.query(`
        SELECT p.*, u.vchNombres, u.vchApaterno, u.vchTelefono
        FROM tblpedidos p
        JOIN tblusuario u ON p.intIdUsuario = u.intIdUsuario
        WHERE p.intIdPedido = ?`, [id]);

    if (pedidoInfo.length === 0) return null;

    const [articulos] = await db.query(`
        SELECT d.*, 
                pr.vchNombre AS nombreProducto, 
                m.vchNombre AS nombrePlatillo
        FROM tbldetalle_pedido d
        LEFT JOIN tblproductos pr ON d.intIdProducto = pr.intIdProducto
        LEFT JOIN tblmenu m ON d.intIdPlatillo = m.intIdPlatillo
        WHERE d.intIdPedido = ?`, [id]);

    return {
        info: pedidoInfo[0],
        articulos: articulos
    };
};

// 3. Crear el pedido usando nuestro Procedimiento Almacenado
export const crearPedido = async (idUsuario, total, notas, carrito) => {
    // Convertimos el carrito en texto JSON
    const carritoJSON = JSON.stringify(carrito);

    // Llamamos al procedimiento almacenado de MySQL
    const [result] = await db.query(
        'CALL sp_crear_pedido(?, ?, ?, ?)',
        [idUsuario, total, notas || null, carritoJSON]
    );

    // MySQL nos devuelve el folio generado
    return result[0][0].folio;
};