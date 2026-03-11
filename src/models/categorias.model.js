import { db } from '../config/database.js';

export const getCategorias = async () => {
    const [rows] = await db.query(`
        SELECT 
            intIdCategoria AS id, 
            vchCategoria AS nombre 
        FROM tblcategorias
    `);
    return rows;
}

export const getCategoria = async (id) => {
    const [rows] = await db.query('SELECT * FROM tblcategorias WHERE intIdCategoria = ?', [id]);
    return rows[0];
}

export const crearCategoria = async ({ vchCategoria }) => {
    const [result] = await db.query(
        'INSERT INTO tblcategorias (vchCategoria) VALUES (?)',
        [vchCategoria || null]
    );
    return { id: result.insertId, vchCategoria };
}

export const actualizarCategoria = async (id, { vchCategoria }) => {
    const [result] = await db.query(
        'UPDATE tblcategorias SET vchCategoria=? WHERE intIdCategoria=?',
        [vchCategoria || null, id]
    );
    return result;
}

export const eliminarCategoria = async (id) => {
    const [result] = await db.query(
        'DELETE FROM tblcategorias WHERE intIdCategoria=?',
        [id]
    );
    return result;
}