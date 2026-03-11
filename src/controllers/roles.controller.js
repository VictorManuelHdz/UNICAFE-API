import * as rolesModelo from '../models/roles.model.js';

export const getAllRoles = async (req, res) => {
    try {
        const roles = await rolesModelo.getRoles();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRol = async (req, res) => {
    try {
        const { id } = req.params;
        const rol = await rolesModelo.getRolById(id);
        
        if (!rol) {
            return res.status(404).json({ message: 'Rol no encontrado' });
        }
        
        res.status(200).json(rol);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};