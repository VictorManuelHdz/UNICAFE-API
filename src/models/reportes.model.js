import { db } from '../config/database.js';

export const getDashboardData = async () => {
    const [valorTotalRows] = await db.query('SELECT fn_ValorInventarioTotal() AS valorTotal');
    const [gananciaRows] = await db.query('SELECT fn_GananciaPotencialStock() AS ganancia');
    
    const [alertasRows] = await db.query('SELECT COUNT(*) AS alertas FROM vista_resurtir_urgente');

    const [historialRows] = await db.query(`
        SELECT 
            p.vchNombre AS producto,
            a.precio_viejo,
            a.precio_nuevo,
            a.fecha_cambio 
        FROM tblauditoria_precios a
        JOIN tblproductos p ON a.id_producto = p.intIdProducto
        ORDER BY a.fecha_cambio DESC
        LIMIT 5
    `);

    const [sugerenciasRows] = await db.query('CALL sp_GenerarSugerenciaCompra()');

    return {
        valorBodega: valorTotalRows[0].valorTotal || 0,
        gananciaProyectada: gananciaRows[0].ganancia || 0,
        alertas: alertasRows[0].alertas || 0,
        historialPrecios: historialRows,
        sugerenciasCompra: sugerenciasRows[0] 
    };
};

export const obtenerVentasActualesDB = async () => {
    // Contamos todos los pedidos exitosos para usarlos como x0
    const [rows] = await db.query(`
        SELECT COUNT(intIdPedido) as total_ventas 
        FROM tblpedidos 
        WHERE vchEstado = 'Entregado'
    `);
    return rows[0].total_ventas;
};

// reportes.model.js
export const obtenerTodosLosProductosDB = async () => {
    const [rows] = await db.query(`
        SELECT 
            COALESCE(p.vchNombre, m.vchNombre) AS nombre_articulo,
            SUM(dp.intCantidad) AS total_vendido
        FROM tbldetalle_pedido dp
        INNER JOIN tblpedidos ped ON dp.intIdPedido = ped.intIdPedido
        LEFT JOIN tblproductos p ON dp.intIdProducto = p.intIdProducto
        LEFT JOIN tblmenu m ON dp.intIdPlatillo = m.intIdPlatillo
        WHERE ped.vchEstado = 'Entregado'
        GROUP BY nombre_articulo
        ORDER BY total_vendido DESC
    `);
    return rows;
};