import { db } from '../config/database.js';

export const getAvisoPrivacidad = async () => {
    // Buscamos específicamente el registro que contiene el aviso legal
    const [rows] = await db.query(`
        SELECT 
            id, 
            contenido, 
            fecha_modificacion AS ultima_actualizacion 
        FROM tblconfiguracion 
        WHERE clave = 'aviso_privacidad'
    `);
    return rows[0];
};

export const agregarAviso =async()=>{

    
}

export const actualizarAvisoPrivacidad = async (id, { contenido }) => {
    const [result] = await db.query(
        'UPDATE tblconfiguracion SET contenido = ?, fecha_modificacion = CURRENT_TIMESTAMP WHERE id = ?',
        [contenido, id]
    );
    return result;
};