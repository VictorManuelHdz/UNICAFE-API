import { db } from '../config/database.js';

export const getPedidos = async () => {
    const [rows] = await db.query(`
        SELECT 
            id, 
            nombre_cliente AS cliente, 
            detalle_pedido AS detalle, 
            hora_entrega AS hora, 
            cantidad, 
            total, 
            intIdUsuario AS idUsuario 
        FROM tblhistorial
    `);
    return rows;
};

export const getPedidoById = async (id) => {
    const [rows] = await db.query(`
        SELECT 
            id, 
            nombre_cliente AS cliente, 
            detalle_pedido AS detalle, 
            hora_entrega AS hora, 
            cantidad, 
            total, 
            intIdUsuario AS idUsuario 
        FROM tblhistorial
        WHERE id = ?`, [id]);
    return rows[0];
};

export const crearPedido = async ({ cliente, detalle, hora, cantidad, total, idUsuario }) => {
    const [result] = await db.query(
        'INSERT INTO tblhistorial (nombre_cliente, detalle_pedido, hora_entrega, cantidad, total, intIdUsuario) VALUES (?,?,?,?,?,?)',
        [cliente, detalle, hora, cantidad, total, idUsuario]
    );
    return { id: result.insertId, cliente, detalle, total };
};