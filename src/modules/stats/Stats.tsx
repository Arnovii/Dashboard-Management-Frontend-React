import React, { useEffect, useState } from "react";
import api from "../../api/dashboard/dashboard.axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Stats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpis, setKpis] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("GET → /stats/dashboard");
        const res = await api.get("/stats/dashboard");
        console.log("Stats Response:", res.data);

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

  if (loading) return <p style={{ padding: 20 }}>Cargando estadísticas...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
        📊 Panel de Estadísticas
      </h1>

      {/* KPIs */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <KPIBox title="Total Productos" value={kpis.totalProducts} />
        <KPIBox title="Total Stock" value={kpis.totalStock} />
        <KPIBox
          title="Valor del Inventario"
          value={`$${kpis.totalValue.toLocaleString()}`}
        />
        <KPIBox title="Alertas de Bajo Stock" value={kpis.lowStockAlerts} />
      </div>

      {/* Gráfico de Categorías */}
      <div
        style={{
          width: "100%",
          height: "350px",
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>Distribución por Categoría</h2>

        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={(entry) => `${entry.name} (${entry.value})`}
            >
              {chartData.map((_, index) => (
                <Cell key={index} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KPIBox({ title, value }: { title: string; value: any }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#444" }}>
        {title}
      </h3>
      <p style={{ fontSize: "26px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
