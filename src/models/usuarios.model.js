import { db } from '../config/database.js';

export const getUsuarios = async () => {
    const [rows] = await db.query(`
        SELECT 
            intIdUsuario AS id, 
            vchNombres AS nombres, 
            vchApaterno AS apellidoPaterno, 
            vchAmaterno AS apellidoMaterno, 
            vchTelefono AS telefono, 
            vchCorreo AS correo, 
            vchDireccion AS direccion, 
            intIdRol AS rol 
        FROM tblusuario
    `);
    return rows;
};

export const getUsuario = async (id) => {
    const [rows] = await db.query(`
        SELECT 
            intIdUsuario AS id, 
            vchNombres AS nombres, 
            vchApaterno AS apellidoPaterno, 
            vchAmaterno AS apellidoMaterno, 
            vchTelefono AS telefono, 
            vchCorreo AS correo, 
            vchDireccion AS direccion, 
            intIdRol AS rol 
        FROM tblusuario 
        WHERE intIdUsuario = ?`, [id]);
    return rows[0];
};

export const crearUsuario = async ({ nombres, apellidoPaterno, apellidoMaterno, telefono, correo, direccion, password, rol }) => {
    const conexion = await db.getConnection(); 
    
    try {
        await conexion.beginTransaction(); 
        
        const [result] = await conexion.query(
            'INSERT INTO tblusuario (vchNombres, vchApaterno, vchAmaterno, vchTelefono, vchCorreo, vchDireccion, vchPassword, intIdRol) values(?,?,?,?,?,?,?,?)',
            [nombres, apellidoPaterno, apellidoMaterno, telefono, correo, direccion, password, rol]
        );
        
        await conexion.commit(); 
        
        return { id: result.insertId, nombres, apellidoPaterno, correo };
    } catch (error) {
        await conexion.rollback(); 
        throw error;
    } finally {
        conexion.release(); 
    }
};

// Mantenemos la lógica dinámica pero traduciendo las llaves para proteger la DB
export const actualizarUsuario = async (id, camposAmigables) => {
    const diccionario = {
        nombres: 'vchNombres',
        apellidoPaterno: 'vchApaterno',
        apellidoMaterno: 'vchAmaterno',
        telefono: 'vchTelefono',
        correo: 'vchCorreo',
        direccion: 'vchDireccion',
        password: 'vchPassword',
        rol: 'intIdRol'
    };

    const keys = Object.keys(camposAmigables);
    const camposSql = keys.map(key => `${diccionario[key] || key} = ?`).join(', ');
    const valores = [...Object.values(camposAmigables), id];

    const sql = `UPDATE tblusuario SET ${camposSql} WHERE intIdUsuario = ?`;
    const [result] = await db.query(sql, valores);
    return result;
};

export const eliminarUsuario = async (id) => {
    const [result] = await db.query('DELETE FROM tblusuario WHERE intIdUsuario = ?', [id]);
    return result;
};

export const findUsuarioByEmai =async(email)=>{
    const [row]= await db.query(
        'SELECT intIdUsuario AS id, vchCorreo AS correo, vchpassword AS pass,  vchNombres AS nombres, intIdRol AS rol FROM tblusuario WHERE vchCorreo=? ',
        [email]
    )
    return row[0]
}