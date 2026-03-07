import { db } from '../config/database.js';

export const getproductos = async() => {
    const [rows] = await db.query('SELECT * FROM tblproductos');
    return rows;
}  

export const getproducto = async(id) => {
    const [rows] = await db.query('SELECT * FROM tblproductos WHERE id = ?', [id]);
    return rows[0];
}

export const crearProducto = async({vchNombre,vchDescripcion, intStock, intIdCategoria,vchRFCProveedor, decPrecioCompra, decPrecioVenta, vchImagen})=>{
    const [result] =await db.query(
        'INSERT INTO tblproductos (vchNombre,vchDescripcion, intStock, intIdCategoria,vchRFCProveedor, decPrecioCompra, decPrecioVenta, vchImagen) values (?,?,?,?,?,?,?,?)',
        [vchNombre,vchDescripcion||null, intStock||0, intIdCategoria||null,vchRFCProveedor||null, decPrecioCompra||0.00, decPrecioVenta||0.00, vchImagen||null]
    );
    return {id: result.insertId, vchNombre,vchDescripcion, intStock, intIdCategoria,vchRFCProveedor, decPrecioCompra, decPrecioVenta, vchImagen}
}

export const actualizarProducto = async(id,{vchNombre,vchDescripcion, intStock, intIdCategoria,vchRFCProveedor, decPrecioCompra, decPrecioVenta, vchImagen})=>{
    const [result]=await db.query(
        'UPDATE tblProductos SET vchNombre=?,vchDescripcion=?, intStock=?, intIdCategoria=?,vchRFCProveedor=?, decPrecioCompra=?, decPrecioVenta=?, vchImagen=? WHERE intIdProducto=?',
        [vchNombre,vchDescripcion||null, intStock||0, intIdCategoria||null,vchRFCProveedor||null, decPrecioCompra||0.00, decPrecioVenta||0.00, vchImagen||null, id]
    )
    return result
}

export const eliminarProducto =async(id)=>{
    const [result]=await db.query(
        'DELETE FROM tblProductos WHERE intIdProducto=?',[id]
    )
    return result
}