import { db } from '../config/database.js';

// Obtener todos los pedidos (Para el panel de empleados/admins)
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

// Obtener un pedido específico con TODO su detalle
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

// Crear el pedido usando nuestro Procedimiento Almacenado
export const crearPedido = async (idUsuario, total, notas, carrito) => {
    // Convertimos el carrito en texto JSON
    const carritoJSON = JSON.stringify(carrito);

    // Llamamos al procedimiento almacenado de la DB para crear el pedido
    const [result] = await db.query(
        'CALL sp_crear_pedido(?, ?, ?, ?)',
        [idUsuario, total, notas || null, carritoJSON]
    );

    // El procedimiento devuelve el folio del nuevo pedido en la primera fila del primer resultado
    return result[0][0].folio;
};

export const actualizarEstadoPedido = async (idPedido, nuevoEstado) => {
    const [result] = await db.query(
        'UPDATE tblpedidos SET vchEstado = ? WHERE intIdPedido = ?',
        [nuevoEstado, idPedido]
    );
    return result.affectedRows > 0;
};

export const getPedidosByUsuarioId = async (idUsuario) => {
    const [rows] = await db.query(`
        SELECT 
            intIdPedido AS idPedido, 
            dtmFechaHora AS fecha, 
            decTotal AS total, 
            vchEstado AS estado 
        FROM tblpedidos 
        WHERE intIdUsuario = ?
        ORDER BY dtmFechaHora DESC
    `, [idUsuario]);
    return rows;
};