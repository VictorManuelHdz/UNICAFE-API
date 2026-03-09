import { db } from '../config/database.js';

export const getPlatillos = async() => {
    const [rows] = await db.query('SELECT * FROM tblmenu');
    return rows;
}  

export const getPlatillo = async(id) => {
    const [rows] = await db.query('SELECT * FROM tblmenu WHERE intIdPlatillo = ?', [id]);
    return rows[0];
}

export const crearPlatillo = async({ vchCategoria, vchNombre, decPrecio, vchImagen }) => {
    const [result] = await db.query(
        'INSERT INTO tblmenu (vchCategoria, vchNombre, decPrecio, vchImagen) VALUES (?, ?, ?, ?)',
        [vchCategoria, vchNombre || null, decPrecio || 0.00, vchImagen || null]
    );
    return { id: result.insertId, vchCategoria, vchNombre, decPrecio, vchImagen };
}

export const actualizarPlatillo = async(id, { vchCategoria, vchNombre, decPrecio, vchImagen }) => {
    const [result] = await db.query(
        'UPDATE tblmenu SET vchCategoria=?, vchNombre=?, decPrecio=?, vchImagen=? WHERE intIdPlatillo=?',
        [vchCategoria, vchNombre || null, decPrecio || 0.00, vchImagen || null, id]
    );
    return result;
}

export const eliminarPlatillo = async(id) => {
    const [result] = await db.query(
        'DELETE FROM tblmenu WHERE intIdPlatillo=?', 
        [id]
    );
    return result;
}