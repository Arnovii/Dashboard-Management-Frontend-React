import React, { useEffect, useState } from "react";
import api from "../../api/dashboard/dashboard.axios";
import "./Marketing.css";

type Campaign = {
  _id?: string;
  id?: string;
  title: string;
  discountPercentage: number;
  startDate?: string;
  endDate?: string;
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
  const [startDate, setStartDate] = useState<string>("");
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
      // console.log eliminados para limpieza en producción, puedes descomentarlos si necesitas debug
      const res = await api.get("/marketing");
      setCampaigns(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Error al cargar campañas");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);

    if (!title.trim()) return setError("El título es requerido.");
    if (discount < 0 || discount > 100) return setError("Descuento inválido (0-100).");
    if (!startDate || !endDate) return setError("Fechas requeridas.");
    
    const s = new Date(startDate);
    const eDate = new Date(endDate);
    
    if (isNaN(s.getTime()) || isNaN(eDate.getTime())) return setError("Fechas inválidas.");
    if (s > eDate) return setError("La fecha de inicio debe ser anterior al fin.");

    const payload = {
      title: title.trim(),
      discountPercentage: Number(discount),
      startDate: s.toISOString(),
      endDate: eDate.toISOString(),
      isActive,
    };

    setCreating(true);
    try {
      const res = await api.post("/marketing", payload);
      if (res.data && (res.data._id || res.data.id)) {
        setCampaigns((prev) => [res.data, ...prev]);
      } else {
        await fetchCampaigns();
      }
      resetForm();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Error al crear campaña");
    } finally {
      setCreating(false);
    }
  }

  const resetForm = () => {
    setTitle("");
    setDiscount(10);
    setStartDate("");
    setEndDate("");
    setIsActive(true);
  };

  async function handleToggle(id: string) {
    setError(null);
    try {
      const res = await api.patch(`/marketing/${id}/toggle`);
      setCampaigns((prev) => prev.map((c) => (getId(c) === id ? res.data : c)));
    } catch (err: any) {
      setError("No se pudo actualizar el estado.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("¿Estás seguro de eliminar esta campaña?")) return;
    setError(null);
    try {
      await api.delete(`/marketing/${id}`);
      setCampaigns((prev) => prev.filter((c) => getId(c) !== id));
    } catch (err: any) {
      setError("No se pudo eliminar la campaña.");
    }
  }

  return (
    <div className="mkt-container">
      {/* Header */}
      <header className="mkt-header">
        <div>
          <h1 className="mkt-title">Marketing</h1>
          <p className="mkt-subtitle">Gestiona tus campañas y descuentos activos.</p>
        </div>
        <button onClick={fetchCampaigns} className="mkt-btn mkt-btn-ghost">
          Actualizar lista
        </button>
      </header>

      {error && <div className="mkt-alert">{error}</div>}

      {/* Create Section */}
      <section className="mkt-card mkt-create-section">
        <h3 className="mkt-section-title">Nueva Campaña</h3>
        <form onSubmit={handleCreate} className="mkt-form">
          <div className="mkt-grid">
            <div className="mkt-field span-2">
              <label>Título de campaña</label>
              <input 
                type="text" 
                placeholder="Ej: Black Friday 2025" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            
            <div className="mkt-field">
              <label>Descuento (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>

            <div className="mkt-field checkbox-field">
               <label className="mkt-checkbox-label">
                <input 
                  type="checkbox" 
                  checked={isActive} 
                  onChange={(e) => setIsActive(e.target.checked)} 
                />
                <span className="checkbox-custom"></span>
                Campaña activa
              </label>
            </div>

            <div className="mkt-field">
              <label>Inicio</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            <div className="mkt-field">
              <label>Fin</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="mkt-actions">
            <button type="button" onClick={resetForm} className="mkt-btn mkt-btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={creating} className="mkt-btn mkt-btn-primary">
              {creating ? "Guardando..." : "Crear Campaña"}
            </button>
          </div>
        </form>
      </section>

      {/* List Section */}
      <section className="mkt-card mkt-list-section">
        {loading ? (
          <div className="mkt-loading">Cargando datos...</div>
        ) : campaigns.length === 0 ? (
          <div className="mkt-empty">No hay campañas registradas.</div>
        ) : (
          <div className="mkt-table-wrapper">
            <table className="mkt-table">
              <thead>
                <tr>
                  <th>Estado</th>
                  <th>Campaña</th>
                  <th>Descuento</th>
                  <th>Vigencia</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  const id = getId(c);
                  return (
                    <tr key={id || Math.random()}>
                      <td>
                        <span className={`mkt-badge ${c.isActive ? "active" : "inactive"}`}>
                          {c.isActive ? "Activa" : "Pausada"}
                        </span>
                      </td>
                      <td className="fw-500">{c.title}</td>
                      <td>{c.discountPercentage}%</td>
                      <td className="text-muted">
                        {c.startDate ? new Date(c.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "-"} 
                        {" → "} 
                        {c.endDate ? new Date(c.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "-"}
                      </td>
                      <td className="mkt-row-actions">
                        <button 
                          className="mkt-link-btn"
                          onClick={() => id && handleToggle(id)}
                        >
                          {c.isActive ? "Pausar" : "Activar"}
                        </button>
                        <button 
                          className="mkt-link-btn danger" 
                          onClick={() => id && handleDelete(id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}