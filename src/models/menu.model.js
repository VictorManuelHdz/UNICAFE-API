import { db } from '../config/database.js';

// Usamos la lógica de filtrado por categoría que proporcionaste
export const getPlatillosByCategoria = async (idCategoria) => {
    const [rows] = await db.query(`
        SELECT 
            intIdPlatillo AS id, 
            intIdCategoria AS idCategoria, 
            vchNombre AS nombre, 
            decPrecio AS precio, 
            vchImagen AS imagen 
        FROM tblmenu 
        WHERE intIdCategoria = ?`, [idCategoria]);
    return rows;
};

export const getPlatillos = async () => {
    const [rows] = await db.query(`
        SELECT 
            intIdPlatillo AS id, 
            intIdCategoria AS idCategoria, 
            vchNombre AS nombre, 
            decPrecio AS precio, 
            vchImagen AS imagen 
        FROM tblmenu
    `);
    return rows;
}

export const getPlatillo = async (id) => {
    const [rows] = await db.query(`
        SELECT 
            intIdPlatillo AS id, 
            intIdCategoria AS idCategoria, 
            vchNombre AS nombre, 
            decPrecio AS precio, 
            vchImagen AS imagen 
        FROM tblmenu WHERE intIdPlatillo = ?`, [id]);
    return rows[0];
}

export const crearPlatillo = async ({ idCategoria, nombre, precio, imagen }) => {
    const [result] = await db.query(
        'INSERT INTO tblmenu (intIdCategoria, vchNombre, decPrecio, vchImagen) VALUES (?, ?, ?, ?)',
        [idCategoria, nombre || null, precio || 0.00, imagen || null]
    );
    return { id: result.insertId, idCategoria, nombre, precio, imagen };
}

export const actualizarPlatillo = async (id, { idCategoria, nombre, precio, imagen }) => {
    const [result] = await db.query(
        'UPDATE tblmenu SET intIdCategoria=?, vchNombre=?, decPrecio=?, vchImagen=? WHERE intIdPlatillo=?',
        [idCategoria, nombre || null, precio || 0.00, imagen || null, id]
    );
    return result;
}

export const eliminarPlatillo = async (id) => {
    const [result] = await db.query(
        'DELETE FROM tblmenu WHERE intIdPlatillo=?', 
        [id]
    );
    return result;
}