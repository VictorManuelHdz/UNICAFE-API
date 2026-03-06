import { db } from '../config/database.js';

export const getproductos = async() => {
    const [rows] = await db.query('SELECT * FROM tblproductos');
    return rows;
}  

export const getproducto = async(id) => {
    const [rows] = await db.query('SELECT * FROM tblproductos WHERE id = ?', [id]);
    return rows[0];
}

