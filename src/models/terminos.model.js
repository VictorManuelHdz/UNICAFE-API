import { db } from '../config/database.js';

export const getTerminos = async () => {
    const [rows] = await db.query(`
        SELECT 
            intIdTermino AS id, 
            vchTitulo AS titulo, 
            txtDescripcion AS contenido 
        FROM tblterminos
    `);
    return rows;
};

export const crearTermino = async ({ titulo, contenido }) => {
    const [result] = await db.query(
        'INSERT INTO tblterminos (vchTitulo, txtDescripcion) VALUES (?, ?)',
        [titulo || null, contenido || null]
    );
    return { id: result.insertId, titulo, contenido };
};

export const actualizarTermino = async (id, camposAmigables) => {
    const diccionario = {
        titulo: 'vchTitulo',
        contenido: 'txtDescripcion'
    };

    const keys = Object.keys(camposAmigables);
    const camposSql = keys.map(key => `${diccionario[key] || key} = ?`).join(', ');
    const valores = [...Object.values(camposAmigables), id];

    const sql = `UPDATE tblterminos SET ${camposSql} WHERE intIdTermino = ?`;
    const [result] = await db.query(sql, valores);
    return result;
};

export const eliminarTermino = async (id) => {
    const [result] = await db.query('DELETE FROM tblterminos WHERE intIdTermino = ?', [id]);
    return result;
};