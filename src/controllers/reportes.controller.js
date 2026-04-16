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
        // Dentro de calcularModeloPredictivo...

        // 1. Cambiar la llamada al modelo
        // reportes.controller.js
        const todosLosProductos = await reportesmodelo.obtenerTodosLosProductosDB(); // Verifica que el nombre coincida aquí

        // 2. Calcular el total global de unidades vendidas de todos los productos
        const totalGlobalVendido = todosLosProductos.reduce((acc, curr) => acc + Number(curr.total_vendido), 0);

        // 3. Generar el desglose para la lista completa
        const proyeccionInsumos = todosLosProductos.map(prod => {
            const cantidadActual = Number(prod.total_vendido);

            // Proporción de este producto respecto al total histórico
            const porcentajeParticipacion = cantidadActual / totalGlobalVendido;

            // Aplicamos el crecimiento exponencial basado en su peso en la demanda
            const demandaEstimada = Math.round(ventasProyectadas * porcentajeParticipacion);

            return {
                articulo: prod.nombre_articulo,
                cantidadBase: cantidadActual,
                porcentajePopularidad: (porcentajeParticipacion * 100).toFixed(1),
                demandaProyectada: demandaEstimada,
                // Estimación de cuánto pedir (Diferencia entre futuro y presente)
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