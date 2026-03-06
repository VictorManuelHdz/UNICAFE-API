import {db} from '../config/database.js'

export const getUsuarios = async()=>{
    const [rows] = await db.query('SELECT * FROM tblusuario')
    return rows
}

export const getUsuario = async(id)=>{
    const [rows] = await db.query('SELECT * FROM tblusuario WHERE id = ?',[id])
    return rows[0]
}