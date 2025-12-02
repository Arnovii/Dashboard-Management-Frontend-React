import React, { useEffect, useState } from "react";
import api from "../../api/dashboard/dashboard.axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// 1. Paleta de colores "Sobria" (Tonos Slate/Gris Azulado)
const COLORS = ["#334155", "#475569", "#64748b", "#94a3b8", "#cbd5e1"];

export default function Stats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // console.log("GET → /stats/dashboard"); // Comentado para producción
        const res = await api.get("/stats/dashboard");
        setKpis(res.data.kpis);
        setChartData(res.data.chartData);
      } catch (err: any) {
        console.error("Error fetching stats:", err);
        setError("No se pudieron cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Estilos base para contenedores de carga y error
  const messageStyle: React.CSSProperties = {
    padding: "40px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.9rem",
    fontFamily: "sans-serif",
  };

  if (loading) return <div style={messageStyle}>Cargando panel...</div>;
  if (error) return <div style={{ ...messageStyle, color: "#ef4444" }}>{error}</div>;

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <header style={styles.header}>
        <h1 style={styles.title}>Panel General</h1>
        <p style={styles.subtitle}>Visión general del inventario y métricas</p>
      </header>

      {/* Grid de KPIs */}
      <div style={styles.grid}>
        <KPIBox title="Total Productos" value={kpis?.totalProducts} />
        <KPIBox title="Total Stock" value={kpis?.totalStock} />
        <KPIBox
          title="Valor Inventario"
          value={`$${kpis?.totalValue?.toLocaleString()}`}
          highlight // Prop opcional para destacar este KPI
        />
        <KPIBox 
          title="Alertas Stock Bajo" 
          value={kpis?.lowStockAlerts} 
          isAlert={kpis?.lowStockAlerts > 0}
        />
      </div>

      {/* Sección del Gráfico */}
      <div style={styles.chartCard}>
        <h2 style={styles.cardTitle}>Distribución por Categoría</h2>
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                dataKey="value"
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60} // Hace que sea un Donut Chart (más moderno)
                outerRadius={85}
                paddingAngle={5} // Espacio entre secciones
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="none" // Elimina bordes para un look plano
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: "12px", color: "#64748b" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// --- Componentes Auxiliares ---

function KPIBox({ title, value, highlight, isAlert }: { title: string; value: any; highlight?: boolean, isAlert?: boolean }) {
  return (
    <div style={styles.kpiCard}>
      <h3 style={styles.kpiTitle}>{title}</h3>
      <p style={{
        ...styles.kpiValue,
        color: isAlert ? "#ef4444" : (highlight ? "#0f172a" : "#334155")
      }}>
        {value}
      </p>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={styles.tooltip}>
        <p style={styles.tooltipLabel}>{payload[0].name}</p>
        <p style={styles.tooltipValue}>Cant: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

// --- Estilos en Objeto (CSS-in-JS simple) ---

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "40px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif", // Fuente moderna recomendada
    backgroundColor: "#f8fafc", // Gris muy claro de fondo
    minHeight: "100vh",
    color: "#1e293b",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#0f172a", // Slate oscuro
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b", // Slate medio
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  kpiCard: {
    background: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", // Sombra suave
    border: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s ease",
  },
  kpiTitle: {
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#94a3b8", // Texto gris suave
    marginBottom: "12px",
    fontWeight: "600",
  },
  kpiValue: {
    fontSize: "32px",
    fontWeight: "700",
    margin: 0,
    lineHeight: "1",
  },
  chartCard: {
    background: "#ffffff",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f1f5f9",
    maxWidth: "500px", // Limitamos ancho para mantener elegancia
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "24px",
    color: "#334155",
  },
  // Tooltip personalizado
  tooltip: {
    backgroundColor: "#1e293b",
    padding: "8px 12px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    border: "none",
  },
  tooltipLabel: {
    color: "#e2e8f0",
    fontSize: "12px",
    margin: "0 0 4px 0",
  },
  tooltipValue: {
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    margin: 0,
  },
};