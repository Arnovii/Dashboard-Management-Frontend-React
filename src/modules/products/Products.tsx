import React, { useEffect, useState } from "react";
import api from "../../api/dashboard/dashboard.axios";

type Product = {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
  createdAt?: string | number;
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: "0",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    padding: "24px 32px",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(168, 85, 247, 0.05))",
    borderRadius: "20px",
    border: "1px solid rgba(99, 102, 241, 0.1)",
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
  },
  btnGroup: {
    display: "flex",
    gap: "12px",
  },
  btn: {
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "#fff",
  },
  btnSecondary: {
    background: "#fff",
    color: "#6366f1",
    border: "2px solid #6366f1",
  },
  error: {
    padding: "16px 24px",
    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))",
    color: "#dc2626",
    borderRadius: "12px",
    marginBottom: "24px",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    fontWeight: "600",
  },
  formContainer: {
    background: "#fff",
    padding: "32px",
    borderRadius: "20px",
    marginBottom: "32px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(99, 102, 241, 0.1)",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "14px",
    transition: "all 0.3s ease",
    outline: "none",
  },
  textarea: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "2px solid #e2e8f0",
    fontSize: "14px",
    minHeight: "100px",
    resize: "vertical",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    outline: "none",
  },
  formActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    marginTop: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    background: "linear-gradient(135deg, #f1f5f9, #e2e8f0)",
  },
  cardContent: {
    padding: "24px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "8px",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "16px",
    lineHeight: "1.6",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardMeta: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#475569",
    fontWeight: "600",
  },
  badge: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))",
    color: "#6366f1",
    border: "1px solid rgba(99, 102, 241, 0.2)",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    marginTop: "16px",
  },
  btnSmall: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    flex: 1,
  },
  btnEdit: {
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "#fff",
  },
  btnDelete: {
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
  },
  loading: {
    textAlign: "center",
    padding: "60px 20px",
    fontSize: "18px",
    color: "#64748b",
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
    fontSize: "18px",
    color: "#94a3b8",
  },
  price: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#10b981",
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  },
  currency: {
    fontSize: "18px",
    fontWeight: "700",
  },
};

export default function Products(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "",
    image: "",
    price: 0,
    quantity: 1,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getId = (p: Product) => (p._id ? String(p._id) : p.id ? String(p.id) : "");

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Error al obtener productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async () => {
    setError(null);
    try {
      const payload = {
        name: String(createForm.name || "").trim(),
        description: createForm.description,
        category: String(createForm.category || "").trim(),
        image: String(createForm.image || "").trim(),
        price: Number(createForm.price || 0),
        quantity: parseInt(String(createForm.quantity ?? 0), 10),
      };

      const res = await api.post("/products", payload);

      if (res.data && (res.data._id || res.data.id || res.data.name)) {
        setProducts((prev) => [res.data, ...prev]);
      } else {
        await fetchProducts();
      }

      setCreateForm({
        name: "",
        description: "",
        category: "",
        image: "",
        price: 0,
        quantity: 1,
      });
      setCreating(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Error al crear producto");
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(getId(p));
    setEditForm({
      name: p.name,
      description: p.description,
      category: p.category,
      image: p.image,
      price: p.price,
      quantity: p.quantity,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (id: string) => {
    setError(null);
    try {
      const payload: Partial<Product> = {};
      if (typeof editForm.name !== "undefined") payload.name = String(editForm.name).trim();
      if (typeof editForm.description !== "undefined") payload.description = editForm.description;
      if (typeof editForm.category !== "undefined") payload.category = String(editForm.category).trim();
      if (typeof editForm.image !== "undefined") payload.image = String(editForm.image).trim();
      if (typeof editForm.price !== "undefined") payload.price = Number(editForm.price);
      if (typeof editForm.quantity !== "undefined") payload.quantity = parseInt(String(editForm.quantity), 10);

      const res = await api.patch(`/products/${id}`, payload);
      setProducts((prev) => prev.map((p) => (getId(p) === id ? res.data : p)));
      cancelEdit();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Error al actualizar producto");
    }
  };

  const handleDelete = async (id: string) => {
    const ok = window.confirm("¿Eliminar este producto?");
    if (!ok) return;
    setError(null);
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => getId(p) !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Error al eliminar producto");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛍️ Productos</h1>
        <div style={styles.btnGroup}>
          <button
            style={{
              ...styles.btn,
              ...(creating ? styles.btnSecondary : styles.btnPrimary),
              transform: hoveredCard === 'create' ? 'translateY(-2px)' : 'translateY(0)',
            }}
            onClick={() => {
              setCreating((c) => !c);
              setEditingId(null);
            }}
            onMouseEnter={() => setHoveredCard('create')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {creating ? "❌ Cancelar" : "➕ Crear producto"}
          </button>
          <button
            style={{
              ...styles.btn,
              ...styles.btnSecondary,
              transform: hoveredCard === 'refresh' ? 'translateY(-2px)' : 'translateY(0)',
            }}
            onClick={fetchProducts}
            onMouseEnter={() => setHoveredCard('refresh')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            🔄 Refrescar
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>⚠️ {error}</div>}

      {creating && (
        <div style={styles.formContainer}>
          <h3 style={styles.formTitle}>
            <span>✨</span> Crear Nuevo Producto
          </h3>

          <div style={styles.formGrid}>
            <div style={styles.formField}>
              <label style={styles.label}>Nombre *</label>
              <input
                style={styles.input}
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>Categoría *</label>
              <input
                style={styles.input}
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>Precio *</label>
              <input
                type="number"
                step="0.01"
                style={styles.input}
                value={createForm.price as any}
                onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>Cantidad *</label>
              <input
                type="number"
                style={styles.input}
                value={createForm.quantity as any}
                onChange={(e) => setCreateForm({ ...createForm, quantity: parseInt(e.target.value || "0", 10) })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ ...styles.formField, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Imagen URL *</label>
              <input
                style={styles.input}
                value={createForm.image}
                onChange={(e) => setCreateForm({ ...createForm, image: e.target.value })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ ...styles.formField, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Descripción</label>
              <textarea
                style={styles.textarea}
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={styles.formActions}>
            <button onClick={handleCreate} style={{ ...styles.btn, ...styles.btnPrimary }}>
              💾 Guardar
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnSecondary }}
              onClick={() => setCreating(false)}
            >
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      {editingId && (
        <div style={styles.formContainer}>
          <h3 style={styles.formTitle}>
            <span>✏️</span> Editar Producto
          </h3>

          <div style={styles.formGrid}>
            <div style={styles.formField}>
              <label style={styles.label}>Nombre</label>
              <input
                style={styles.input}
                value={editForm.name as any}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>Categoría</label>
              <input
                style={styles.input}
                value={editForm.category as any}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>Precio</label>
              <input
                type="number"
                step="0.01"
                style={styles.input}
                value={editForm.price as any}
                onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={styles.formField}>
              <label style={styles.label}>Cantidad</label>
              <input
                type="number"
                style={styles.input}
                value={editForm.quantity as any}
                onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value || "0", 10) })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ ...styles.formField, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Imagen URL</label>
              <input
                style={styles.input}
                value={editForm.image as any}
                onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div style={{ ...styles.formField, gridColumn: "1 / -1" }}>
              <label style={styles.label}>Descripción</label>
              <textarea
                style={styles.textarea}
                value={editForm.description as any}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          <div style={styles.formActions}>
            <button
              style={{ ...styles.btn, ...styles.btnPrimary }}
              onClick={() => editingId && handleSaveEdit(editingId)}
            >
              💾 Guardar cambios
            </button>
            <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={cancelEdit}>
              ❌ Cancelar
            </button>
          </div>
        </div>
      )}

      <section>
        {loading ? (
          <div style={styles.loading}>⏳ Cargando productos...</div>
        ) : products.length === 0 ? (
          <div style={styles.empty}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>📦</div>
            <div>No hay productos disponibles</div>
          </div>
        ) : (
          <div style={styles.grid}>
            {products.map((p) => {
              const id = getId(p);
              const isHovered = hoveredCard === id;
              return (
                <div
                  key={id || Math.random()}
                  style={{
                    ...styles.card,
                    transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                    boxShadow: isHovered
                      ? "0 20px 40px rgba(99, 102, 241, 0.2)"
                      : "0 4px 20px rgba(0, 0, 0, 0.06)",
                  }}
                  onMouseEnter={() => setHoveredCard(id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <img
                    src={p.image || "https://via.placeholder.com/400x300?text=Sin+Imagen"}
                    alt={p.name}
                    style={styles.cardImage}
                  />
                  <div style={styles.cardContent}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                      <h3 style={styles.cardTitle}>{p.name}</h3>
                      <span style={styles.badge}>{p.category}</span>
                    </div>

                    {p.description && (
                      <p style={styles.cardDescription}>{p.description}</p>
                    )}

                    <div style={styles.cardMeta}>
                      <div style={styles.metaItem}>
                        <span>📦</span>
                        <span>{p.quantity} unidades</span>
                      </div>
                    </div>

                    <div style={styles.price}>
                      <span style={styles.currency}>$</span>
                      <span>{typeof p.price === "number" ? p.price.toFixed(2) : p.price}</span>
                    </div>

                    <div style={styles.cardActions}>
                      <button
                        style={{ ...styles.btnSmall, ...styles.btnEdit }}
                        onClick={() => startEdit(p)}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        style={{ ...styles.btnSmall, ...styles.btnDelete }}
                        onClick={() => {
                          const realId = id;
                          if (!realId) return alert("Producto sin ID disponible");
                          handleDelete(realId);
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}