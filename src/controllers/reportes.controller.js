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
        // Se declaran los datos requeridos deacuedo a lo que envia el usuarios, de o contrario se agregan datos por defecto
        const C = parseFloat(req.body.ventasIniciales) || 26;
        const td = parseFloat(req.body.tiempoDuplicacion) || 2;
        const tProyeccion = parseFloat(req.body.tiempoProyeccion) || 6;

        //Cálculo de la constante K (ln(2) / tiempo de duplicación)
        const k = Math.log(2) / td;

        //Cálculo de la proyección usando x = C * e^(kt)
        const ventasProyectadas = C * Math.exp(k * tProyeccion);

        const proyecciones = [];
        let ventasAnteriores = C;
        let totalAcumulado = 0;
        const maxMeses = Math.max(12, tProyeccion + 2);

        //Utiliza el ciclo para predecir el aumento de las ventas en meses posteriores
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
        //llama a la base de datos
        const topProductos = await reportesmodelo.obtenerTopProductosDB();

        // Calcular el total de artículos individuales vendidos en ese top 5
        const totalTopVendidos = topProductos.reduce((acc, curr) => acc + Number(curr.total_vendido), 0);

        // Generar el desglose calculando su proyección proporcional
        const proyeccionInsumos = topProductos.map(prod => {
            const cantidadActual = Number(prod.total_vendido);
            const porcentaje = cantidadActual / totalTopVendidos;

            return {
                articulo: prod.nombre_articulo,
                cantidadBase: cantidadActual,
                porcentajePopularidad: (porcentaje * 100).toFixed(1),
                // Aplicamos el crecimiento exponencial de la cafetería a este producto específico
                demandaProyectada: Math.round(ventasProyectadas * porcentaje),
                incrementoNeto: Math.round(ventasProyectadas * porcentaje) - cantidadActual
            };
        });

        // Responder con el JSON estructurado 
        res.status(200).json({
            success: true,
            parametros: { C, td, tProyeccion, k },
            resultados: {
                ventasProyectadas,
                totalAcumulado,
                promedioMensual: totalAcumulado / (maxMeses + 1),
                factorCrecimiento: proyecciones[maxMeses].ventas / C
            },
            proyecciones,
            insumos: proyeccionInsumos
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