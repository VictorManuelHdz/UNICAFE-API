import { db } from '../config/database.js';

export const getAvisos = async () => {
    const [rows] = await db.query(`
        SELECT 
            id, 
            clave, 
            contenido, 
            fecha_modificacion AS ultima_actualizacion 
        FROM tblconfiguracion
    `);
    return rows;
};

export const getAvisoById = async (id) => {
    const [rows] = await db.query(`
        SELECT 
            id, 
            clave, 
            contenido, 
            fecha_modificacion AS ultima_actualizacion 
        FROM tblconfiguracion 
        WHERE id = ?`, [id]);
    return rows[0];
};

export const crearAviso = async ({ clave, contenido }) => {
    const [result] = await db.query(
        'INSERT INTO tblconfiguracion (clave, contenido) VALUES (?, ?)',
        [clave || 'aviso_privacidad', contenido]
    );
    return { id: result.insertId, clave, contenido };
};

export const actualizarAviso = async (id, { contenido }) => {
    const [result] = await db.query(
        'UPDATE tblconfiguracion SET contenido = ?, fecha_modificacion = CURRENT_TIMESTAMP WHERE id = ?',
        [contenido, id]
    );
    return result;
};

export const eliminarAviso = async (id) => {
    const [result] = await db.query('DELETE FROM tblconfiguracion WHERE id = ?', [id]);
    return result;
};