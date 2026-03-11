import { db } from '../config/database.js';

// Solo lectura y consulta individual
export const getRoles = async () => {
    const [rows] = await db.query(`
        SELECT 
            intIdRol AS id, 
            vchRol AS nombre_rol 
        FROM tblroles
    `);
    return rows;
};

export const getRolById = async (id) => {
    const [rows] = await db.query(`
        SELECT 
            intIdRol AS id, 
            vchRol AS nombre_rol 
        FROM tblroles 
        WHERE intIdRol = ?`, [id]);
    return rows[0];
};