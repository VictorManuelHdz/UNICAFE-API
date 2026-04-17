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
export const calcularModeloPredictivo = async (req, res) => {
    try {
        const C = parseFloat(req.body.ventasIniciales) || 26;
        const td = parseFloat(req.body.tiempoDuplicacion) || 2;
        const tProyeccion = parseFloat(req.body.tiempoProyeccion) || 6;

        const k = Math.log(2) / td;
        const ventasProyectadas = C * Math.exp(k * tProyeccion);

        const proyecciones = [];
        let ventasAnteriores = C;
        let totalAcumulado = 0;
        const maxMeses = tProyeccion;

        for (let mes = 0; mes <= maxMeses; mes++) {
            const ventasExactas = C * Math.exp(k * mes);
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

       // reportes.controller.js

const proyeccionInsumos = todosLosProductos.map(prod => {
    // 1. C inicial para este producto específico
    const cantidadActual = Number(prod.total_vendido); 
    
    // 2. Aplicamos la fórmula de crecimiento individual: x(t) = C * e^(k*t)
    // k es la misma constante de proporcionalidad calculada arriba (ln(2)/td)
    const demandaEstimada = Math.round(cantidadActual * Math.exp(k * tProyeccion));

    // 3. Calculamos su participación actual solo para fines informativos
    const porcentajeParticipacion = totalGlobalVendido > 0 ? (cantidadActual / totalGlobalVendido) * 100 : 0;

    return {
        articulo: prod.nombre_articulo,
        cantidadBase: cantidadActual,
        porcentajePopularidad: porcentajeParticipacion.toFixed(1),
        demandaProyectada: demandaEstimada, // Resultado de la fórmula de Malthus por producto
        incrementoNeto: demandaEstimada - cantidadActual
    };
});

    } catch (error) {
        console.error("Error en el modelo predictivo:", error);
        res.status(500).json({ success: false, error: 'Error al calcular la predicción.' });
    }
};
export const obtenerVentasReales = async (req, res) => {
    try {
        const totalVentas = await reportesmodelo.obtenerVentasActualesDB();
        res.status(200).json({ success: true, ventasBase: totalVentas });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error al consultar BD' });
    }
};