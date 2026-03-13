import { db } from '../config/database.js';

export const getCategorias = async () => {
    const [rows] = await db.query(`
        SELECT 
            intIdCategoria AS id, 
            vchCategoria AS nombre 
        FROM tblcategorias_menu
    `);
    return rows;
};

export const getCategoriaById = async (id) => {
    const [rows] = await db.query(`
        SELECT 
            intIdCategoria AS id, 
            vchCategoria AS nombre 
        FROM tblcategorias_menu 
        WHERE intIdCategoria = ?`, [id]);
    return rows[0];
};

export const crearCategoria = async ({ nombre }) => {
    const [result] = await db.query(
        'INSERT INTO tblcategorias_menu (vchCategoria) VALUES (?)',
        [nombre]
    );
    return { id: result.insertId, nombre };
};

export const actualizarCategoria = async (id, { nombre }) => {
    const [result] = await db.query(
        'UPDATE tblcategorias_menu SET vchCategoria = ? WHERE intIdCategoria = ?',
        [nombre, id]
    );
    return result;
};

export const eliminarCategoria = async (id) => {
    const [result] = await db.query(
        'DELETE FROM tblcategorias_menu WHERE intIdCategoria = ?', 
        [id]
    );
    return result;
};