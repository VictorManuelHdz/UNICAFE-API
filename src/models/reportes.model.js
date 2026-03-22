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