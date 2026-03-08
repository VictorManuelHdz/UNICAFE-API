import {db} from '../config/database.js'

export const getUsuarios = async()=>{
    const [rows] = await db.query('SELECT * FROM tblusuario')
    return rows
}

export const getUsuario = async(id)=>{
    const [rows] = await db.query('SELECT * FROM tblusuario WHERE id = ?',[id])
    return rows[0]
}

export const crearUsuario = async({vchNombres, vchApaterno, vchAmaterno, vchTelefono, vchCorreo, vchDireccion, vchPassword, intIdRol})=>{
    const [result]= await db.query(
        'INSERT INTO tblUsuario (vchNombres, vchApaterno, vchAmaterno, vchTelefono, vchCorreo, vchDireccion, vchPassword, intIdRol) values(?,?,?,?,?,?,?,?)',
        [vchNombres, vchApaterno, vchAmaterno, vchTelefono, vchCorreo, vchDireccion, vchPassword, intIdRol]
    )
    return {id: result.insertId, vchNombres, vchApaterno, vchAmaterno, vchTelefono, vchCorreo, vchDireccion, vchPassword, intIdRol}
}


export const actualizarUsuario = async (id, campos) => {

    const keys = Object.keys(campos);
    
    const camposSql = keys.map(key => `${key} = ?`).join(', ');

    const valores = Object.values(campos);
    valores.push(id);

    const sql = `UPDATE tblUsuario SET ${camposSql} WHERE intIdUsuario = ?`;

    const [result] = await db.query(sql, valores);
    return result;
};

export const elimianrUsuario = async(id)=>{
    const [result]=await db.query(
        'DELETE FROM tblUsuario WHERE intIdUsuario=?',[id]
    )
    return result
}