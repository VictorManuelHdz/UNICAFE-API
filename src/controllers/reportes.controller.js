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
        const C_global = parseFloat(req.body.ventasIniciales) || 26;
        const td = parseFloat(req.body.tiempoDuplicacion) || 2;
        const tProyeccion = parseFloat(req.body.tiempoProyeccion) || 6;

        // 1. Constante de proporcionalidad k basada en el tiempo de duplicación
        const k = Math.log(2) / td;

        // 2. Generar serie de tiempo global 
        const proyecciones = [];
        let ventasAnteriores = C_global;
        let totalAcumulado = 0;

        for (let mes = 0; mes <= tProyeccion; mes++) {
            const ventasExactas = C_global * Math.exp(k * mes);
            const ventas = Math.round(ventasExactas);
            const incremento = mes === 0 ? 0 : ventas - ventasAnteriores;
            const porcentajeK = mes === 0 ? 0 : k * 100;

            proyecciones.push({
                mes,
                ventas,
                incremento,
                porcentajeIncremento: porcentajeK
            });

            totalAcumulado += ventas;
            ventasAnteriores = ventas;
        }

        // 3. CÁLCULO INDIVIDUAL POR PRODUCTO (La nueva lógica que pediste)
        const todosLosProductos = await reportesmodelo.obtenerTodosLosProductosDB();
        
        const proyeccionInsumos = todosLosProductos.map(prod => {
            const Ci_producto = Number(prod.total_vendido); 
            const demandaIndividual = Ci_producto * Math.exp(k * tProyeccion);
            const demandaRedondeada = Math.round(demandaIndividual);

            return {
                articulo: prod.nombre_articulo,
                cantidadBase: Ci_producto,
                demandaProyectada: demandaRedondeada,
                incrementoNeto: demandaRedondeada - Ci_producto
            };
        });

        // 4. Enviar respuesta final
        res.status(200).json({
            success: true,
            parametros: { C_global, td, tProyeccion, k },
            resultados: { 
                ventasProyectadas: Math.round(C_global * Math.exp(k * tProyeccion)), 
                totalAcumulado 
            },
            proyecciones,
            insumos: proyeccionInsumos
        });

    } catch (error) {
        console.error("Error en el modelo predictivo:", error);
        res.status(500).json({ success: false, error: 'Error en el cálculo del modelo.' });
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