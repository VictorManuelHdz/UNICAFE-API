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

//Funcion para el modelo predictivo

export const calcularModeloPredictivo = (req, res) => {
    try {
        // Recibimos los datos del frontend 
        const x0 = parseFloat(req.body.ventasIniciales) || 26;
        const td = parseFloat(req.body.tiempoDuplicacion) || 2; // Tiempo en que se duplica
        const tProyeccion = parseFloat(req.body.tiempoProyeccion) || 6;

        // 1. Cálculo de la constante K
        const k = Math.log(2) / td;

        // 2. Cálculo de la proyección final
        const ventasProyectadas = x0 * Math.exp(k * tProyeccion);

        // 3. Generar el arreglo de datos (mes a mes hasta el mes 12 para mostrar la extrapolación)
        const proyecciones = [];
        let ventasAnteriores = x0;
        let totalAcumulado = 0;
        const maxMeses = Math.max(12, tProyeccion + 2); // Graficar al menos 12 meses

        for (let mes = 0; mes <= maxMeses; mes++) {
            const ventasExactas = x0 * Math.exp(k * mes);
            const ventas = Math.round(ventasExactas);
            const incremento = mes === 0 ? 0 : ventas - ventasAnteriores;
            const porcentaje = mes === 0 ? 0 : ((ventas - ventasAnteriores) / ventasAnteriores) * 100;

            proyecciones.push({
                mes,
                ventas,
                ventasExactas,
                incremento,
                porcentajeIncremento: porcentaje
            });

            totalAcumulado += ventas;
            ventasAnteriores = ventas;
        }

        // Responder con el JSON estructurado
        res.status(200).json({
            success: true,
            parametros: { x0, td, tProyeccion, k },
            resultados: {
                ventasProyectadas,
                totalAcumulado,
                promedioMensual: totalAcumulado / (maxMeses + 1),
                factorCrecimiento: proyecciones[maxMeses].ventas / x0
            },
            proyecciones
        });

    } catch (error) {
        console.error("Error en el modelo predictivo:", error);
        res.status(500).json({ success: false, error: 'Error al calcular la predicción.' });
    }
};