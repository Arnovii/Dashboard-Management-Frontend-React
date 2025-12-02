import React, { useEffect, useState } from "react";
import api from "../../api/dashboard/dashboard.axios";
import "./Marketing.css";

type Campaign = {
  _id?: string;
  id?: string;
  title: string;
  discountPercentage: number;
  startDate?: string; // ISO
  endDate?: string;   // ISO
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function Marketing(): React.JSX.Element {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [discount, setDiscount] = useState<number>(10);
  const [startDate, setStartDate] = useState<string>(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const getId = (c: Campaign) => (c._id ? String(c._id) : c.id ? String(c.id) : "");

  async function fetchCampaigns() {
    setLoading(true);
    setError(null);
    try {
      console.log("%c[MARKETING] GET /marketing", "color: #0a66c2; font-weight: bold");
      const res = await api.get("/marketing");
      console.log("%c[MARKETING] GET response", "color: #0a8a00; font-weight: bold", res.status, res.data);
      setCampaigns(res.data || []);
    } catch (err: any) {
      console.error("%c[MARKETING] GET error", "color: #b00020; font-weight: bold", err);
      setError(err?.response?.data?.message || err.message || "Error al cargar campañas");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!title.trim()) return setError("Título requerido.");
    if (discount < 0 || discount > 100) return setError("El descuento debe estar entre 0 y 100.");
    if (!startDate || !endDate) return setError("Fechas de inicio y fin requeridas.");
    const s = new Date(startDate);
    const eDate = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(eDate.getTime())) return setError("Fechas inválidas.");
    if (s > eDate) return setError("La fecha de inicio debe ser antes de la fecha de fin.");

    const payload = {
      title: title.trim(),
      discountPercentage: Number(discount),
      startDate: s.toISOString(),
      endDate: eDate.toISOString(),
      isActive,
    };

    setCreating(true);
    try {
      console.log("%c[MARKETING] POST /marketing", "color: #0a66c2; font-weight: bold");
      console.log("→ Payload:", payload);

      const res = await api.post("/marketing", payload);

      console.log("%c[MARKETING] POST response", "color: #0a8a00; font-weight: bold", res.status, res.data);

      // Inserta la campaña creada (si backend la retorna) o refetch
      if (res.data && (res.data._id || res.data.id)) {
        setCampaigns((prev) => [res.data, ...prev]);
      } else {
        await fetchCampaigns();
      }

      // reset form
      setTitle("");
      setDiscount(10);
      setStartDate("");
      setEndDate("");
      setIsActive(true);
    } catch (err: any) {
      console.error("%c[MARKETING] POST error", "color: #b00020; font-weight: bold", err);
      setError(err?.response?.data?.message || err.message || "Error al crear campaña");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(id: string) {
    setError(null);
    try {
      console.log(`%c[MARKETING] PATCH /marketing/${id}/toggle`, "color: #0a66c2; font-weight: bold");
      const res = await api.patch(`/marketing/${id}/toggle`);
      console.log("%c[MARKETING] PATCH response", "color: #0a8a00; font-weight: bold", res.status, res.data);

      // update local state
      setCampaigns((prev) => prev.map((c) => (getId(c) === id ? res.data : c)));
    } catch (err: any) {
      console.error("%c[MARKETING] PATCH error", "color: #b00020; font-weight: bold", err);
      setError(err?.response?.data?.message || err.message || "Error al alternar campaña");
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm("¿Eliminar campaña?");
    if (!ok) return;
    setError(null);
    try {
      console.log(`%c[MARKETING] DELETE /marketing/${id}`, "color: #0a66c2; font-weight: bold");
      const res = await api.delete(`/marketing/${id}`);
      console.log("%c[MARKETING] DELETE response", "color: #0a8a00; font-weight: bold", res.status, res.data);

      setCampaigns((prev) => prev.filter((c) => getId(c) !== id));
    } catch (err: any) {
      console.error("%c[MARKETING] DELETE error", "color: #b00020; font-weight: bold", err);
      setError(err?.response?.data?.message || err.message || "Error al eliminar campaña");
    }
  }

  return (
    <div className="marketing-page">
      <header className="marketing-header">
        <h1>Campañas de Marketing</h1>
        <div>
          <button onClick={fetchCampaigns}>Refrescar</button>
        </div>
      </header>

      {error && <div className="marketing-error">{error}</div>}

      <section className="marketing-create">
        <h3>Crear campaña</h3>
        <form onSubmit={handleCreate} className="marketing-form">
          <label>Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Descuento (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            required
          />

          <label>Fecha inicio</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />

          <label>Fecha fin</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

          <label>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Activa
          </label>

          <div className="marketing-actions">
            <button type="submit" disabled={creating}>{creating ? "Creando..." : "Crear"}</button>
            <button type="button" onClick={() => { setTitle(""); setDiscount(10); setStartDate(""); setEndDate(""); setIsActive(true); }}>Limpiar</button>
          </div>
        </form>
      </section>

      <section className="marketing-list">
        <h3>Listado</h3>

        {loading ? (
          <div>Cargando campañas...</div>
        ) : campaigns.length === 0 ? (
          <div>No hay campañas.</div>
        ) : (
          <table className="marketing-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descuento</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => {
                const id = getId(c);
                return (
                  <tr key={id || Math.random()}>
                    <td>{c.title}</td>
                    <td>{c.discountPercentage}%</td>
                    <td>{c.startDate ? new Date(c.startDate).toLocaleDateString() : "-"}</td>
                    <td>{c.endDate ? new Date(c.endDate).toLocaleDateString() : "-"}</td>
                    <td>
                      <span className={`badge ${c.isActive ? "active" : "inactive"}`}>
                        {c.isActive ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td>{c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}</td>
                    <td>
                      <div className="row-actions">
                        <button onClick={() => { const realId = id; if (!realId) return alert("Campaña sin ID"); handleToggle(realId); }}>
                          {c.isActive ? "Desactivar" : "Activar"}
                        </button>
                        <button className="delete" onClick={() => { const realId = id; if (!realId) return alert("Campaña sin ID"); handleDelete(realId); }}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
