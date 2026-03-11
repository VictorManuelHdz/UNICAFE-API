import { db } from '../config/database.js';

export const getProveedores = async () => {
    const [rows] = await db.query(`
        SELECT 
            vchRFC AS rfc, 
            vchNombres AS nombre, 
            vchApaterno AS apellido_paterno,
            vchAmaterno AS apellido_materno,
            vchTelefono AS telefono,  
            vchCorreo AS correo, 
            vchDireccion AS direccion,
            vchEmpresa AS empresa 
        FROM tblproveedores
    `);
    return rows;
};

export const getProveedor = async (rfc) => {
    const [rows] = await db.query(`
        SELECT 
            vchRFC AS rfc, 
            vchNombres AS nombre, 
            vchApaterno AS apellido_paterno,
            vchAmaterno AS apellido_materno,
            vchTelefono AS telefono,  
            vchCorreo AS correo, 
            vchDireccion AS direccion,
            vchEmpresa AS empresa 
        FROM tblproveedores 
        WHERE vchRFC = ?`, [rfc]);
    return rows[0];
};

export const crearProveedor = async ({ rfc, nombre, apellido_paterno, apellido_materno,  telefono, correo, direccion, empresa }) => {
    await db.query(
        'INSERT INTO tblproveedores (vchRFC, vchNombres, vchApaterno, vchAmaterno, vchTelefono, vchCorreo, vchDireccion, vchEmpresa) VALUES (?,?,?,?,?,?,?,?)',
        [rfc, nombre, apellido_paterno||null, apellido_materno||null,  telefono||null, correo||null, direccion||null, empresa||null]
    );
    return { rfc, nombre, apellido_paterno, apellido_materno,  telefono, correo, direccion, empresa };
};

export const actualizarProveedor = async (rfc, { nombre, apellido_paterno, apellido_materno,  telefono, correo, direccion, empresa}) => {
    const [result] = await db.query(
        'UPDATE tblproveedores SET vchNombres=?, vchApaterno=?, vchAmaterno=?, vchTelefono=?, vchCorreo=?, vchDireccion=?, vchEmpresa=? WHERE vchRFC=?',
        [nombre, apellido_paterno||null, apellido_materno||null,  telefono||null, correo||null, direccion||null, empresa||null, rfc]
    );
    return result;
};

export const eliminarProveedor = async (rfc) => {
    const [result] = await db.query('DELETE FROM tblproveedores WHERE vchRFC = ?', [rfc]);
    return result;
};