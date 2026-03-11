import { db } from '../config/database.js';

export const getSomos = async () => {
    const [rows] = await db.query(`
        SELECT 
            intIdSomos AS id, 
            vchImagen AS imagen, 
            txtDescripcion AS descripcion 
        FROM tblsomos
    `);
    return rows;
};

export const crearSomos = async ({ imagen, descripcion }) => {
    const [result] = await db.query(
        'INSERT INTO tblsomos (vchImagen, txtDescripcion) VALUES (?, ?)',
        [imagen || null, descripcion || null]
    );
    return { id: result.insertId, imagen, descripcion };
};

export const actualizarSomos = async (id, camposAmigables) => {
    const diccionario = {
        imagen: 'vchImagen',
        descripcion: 'txtDescripcion'
    };

    const keys = Object.keys(camposAmigables);
    const camposSql = keys.map(key => `${diccionario[key] || key} = ?`).join(', ');
    const valores = [...Object.values(camposAmigables), id];

    const sql = `UPDATE tblsomos SET ${camposSql} WHERE intIdSomos = ?`;
    const [result] = await db.query(sql, valores);
    return result;
};

export const eliminarSomos = async (id) => {
    const [result] = await db.query('DELETE FROM tblsomos WHERE intIdSomos = ?', [id]);
    return result;
};