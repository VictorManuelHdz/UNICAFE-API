import * as reportesmodelo from '../models/reportes.model.js'

export const obtenerDashboard = async (req, res) => {
    try {
        const data = await reportesmodelo.getDashboardData();
        res.status(200).json(data);
    } catch (error) {
        // Usamos tu mismo formato de manejo de errores
        res.status(500).json({ error: error.message });
    }
};