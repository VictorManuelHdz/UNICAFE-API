import { db } from '../config/database.js';

export const getproductos = async() => {
    // Usamos AS para renombrar cada columna en la respuesta JSON
    const [rows] = await db.query(`
        SELECT 
            intIdProducto AS id, 
            vchNombre AS nombre, 
            vchDescripcion AS descripcion, 
            intStock AS stock, 
            intIdCategoria AS idCategoria,
            vchRFCProveedor AS rfcProveedor,
            decPrecioCompra AS precioCompra,
            decPrecioVenta AS precioVenta,
            vchImagen AS imagen
        FROM tblproductos
    `);
    return rows;
}  

export const getproducto = async(id) => {
    const [rows] = await db.query(`
        SELECT 
            intIdProducto AS id, 
            vchNombre AS nombre, 
            vchDescripcion AS descripcion, 
            intStock AS stock, 
            intIdCategoria AS idCategoria,
            vchRFCProveedor AS rfcProveedor,
            decPrecioCompra AS precioCompra,
            decPrecioVenta AS precioVenta,
            vchImagen AS imagen
        FROM tblproductos WHERE intIdProducto = ?`, [id]);
    return rows[0];
}

// Mantenemos tu lógica de desestructuración original
export const crearProducto = async({nombre, descripcion, stock, idCategoria, rfcProveedor, precioCompra, precioVenta, imagen})=>{
    const [result] = await db.query(
        'INSERT INTO tblproductos (vchNombre, vchDescripcion, intStock, intIdCategoria, vchRFCProveedor, decPrecioCompra, decPrecioVenta, vchImagen) values (?,?,?,?,?,?,?,?)',
        [nombre, descripcion || null, stock || 0, idCategoria || null, rfcProveedor || null, precioCompra || 0.00, precioVenta || 0.00, imagen || null]
    );
    return {id: result.insertId, nombre, descripcion, stock, idCategoria, rfcProveedor, precioCompra, precioVenta, imagen}
}

export const actualizarProducto = async(id, {nombre, descripcion, stock, idCategoria, rfcProveedor, precioCompra, precioVenta, imagen})=>{
    const [result] = await db.query(
        'UPDATE tblproductos SET vchNombre=?, vchDescripcion=?, intStock=?, intIdCategoria=?, vchRFCProveedor=?, decPrecioCompra=?, decPrecioVenta=?, vchImagen=? WHERE intIdProducto=?',
        [nombre, descripcion || null, stock || 0, idCategoria || null, rfcProveedor || null, precioCompra || 0.00, precioVenta || 0.00, imagen || null, id]
    )
    return result
}

export const eliminarProducto = async(id)=>{
    const [result] = await db.query(
        'DELETE FROM tblproductos WHERE intIdProducto=?', [id]
    )
    return result
}