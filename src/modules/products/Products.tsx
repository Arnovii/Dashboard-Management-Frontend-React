import React, { useEffect, useState } from "react";
import api from "../../api/dashboard/dashboard.axios"
import "./Products.css";

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

export default function Products(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form estado para crear
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "",
    image: "",
    price: 0,
    quantity: 1,
  });

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  // --- Util: obtener id real (soporta _id o id)
  const getId = (p: Product) => (p._id ? String(p._id) : p.id ? String(p.id) : "");

  // --- Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("%c[PRODUCTS] - GET /products", "color: #0a66c2; font-weight: bold");
      const res = await api.get("/products");
      console.log("%c[PRODUCTS] - GET response", "color: #0a8a00; font-weight: bold", res.status, res.data);
      setProducts(res.data || []);
    } catch (err: any) {
      console.error("%c[PRODUCTS] - GET error", "color: #b00020; font-weight: bold", err);
      setError(err?.response?.data?.message || err.message || "Error al obtener productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- Create product
  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

      console.log("%c[PRODUCTS] - POST /products", "color: #0a66c2; font-weight: bold");
      console.log("→ Payload:", payload);

      const res = await api.post("/products", payload);

      console.log("%c[PRODUCTS] - POST response", "color: #0a8a00; font-weight: bold", res.status, res.data);

      // Si la API devuelve el producto creado, insertar en lista; si no, re-fetch
      if (res.data && (res.data._id || res.data.id || res.data.name)) {
        setProducts((prev) => [res.data, ...prev]);
      } else {
        await fetchProducts();
      }

      // reset form
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
      console.error("%c[PRODUCTS] - POST error", "color: #b00020; font-weight: bold", err);
      setError(err?.response?.data?.message || err.message || "Error al crear producto");
    }
  };

  // --- Start editing
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

  // --- Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // --- Save edit
  const handleSaveEdit = async (id: string) => {
    setError(null);
    try {
      // create payload only with allowed fields
      const payload: Partial<Product> = {};
      if (typeof editForm.name !== "undefined") payload.name = String(editForm.name).trim();
      if (typeof editForm.description !== "undefined") payload.description = editForm.description;
      if (typeof editForm.category !== "undefined") payload.category = String(editForm.category).trim();
      if (typeof editForm.image !== "undefined") payload.image = String(editForm.image).trim();
      if (typeof editForm.price !== "undefined") payload.price = Number(editForm.price);
      if (typeof editForm.quantity !== "undefined") payload.quantity = parseInt(String(editForm.quantity), 10);

      console.log("%c[PRODUCTS] - PATCH /products/" + id, "color: #0a66c2; font-weight: bold");
      console.log("→ Payload:", payload);

      const res = await api.patch(`/products/${id}`, payload);

      console.log("%c[PRODUCTS] - PATCH response", "color: #0a8a00; font-weight: bold", res.status, res.data);

      // update local state
      setProducts((prev) => prev.map((p) => (getId(p) === id ? res.data : p)));
      cancelEdit();
    } catch (err: any) {
      console.error("%c[PRODUCTS] - PATCH error", "color: #b00020; font-weight: bold", err);
      setError(err?.response?.data?.message || err.message || "Error al actualizar producto");
    }
  };

  // --- Delete
  const handleDelete = async (id: string) => {
    const ok = window.confirm("¿Eliminar este producto?");
    if (!ok) return;
    setError(null);
    try {
      console.log("%c[PRODUCTS] - DELETE /products/" + id, "color: #0a66c2; font-weight: bold");
      const res = await api.delete(`/products/${id}`);
      console.log("%c[PRODUCTS] - DELETE response", "color: #0a8a00; font-weight: bold", res.status, res.data);

      setProducts((prev) => prev.filter((p) => getId(p) !== id));
    } catch (err: any) {
      console.error("%c[PRODUCTS] - DELETE error", "color: #b00020; font-weight: bold", err);
      setError(err?.response?.data?.message || err.message || "Error al eliminar producto");
    }
  };

  return (
    <div className="products-page">
      <header className="products-header">
        <h1>Productos</h1>
        <div>
          <button onClick={() => { setCreating((c) => !c); setEditingId(null); }}>
            {creating ? "Cancelar" : "Crear producto"}
          </button>
          <button onClick={fetchProducts} style={{ marginLeft: 8 }}>Refrescar</button>
        </div>
      </header>

      {error && <div className="products-error">{error}</div>}

      {/* Crear formulario */}
      {creating && (
        <form className="products-form" onSubmit={handleCreate}>
          <h3>Crear Producto</h3>

          <label>Nombre</label>
          <input required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} />

          <label>Descripción (opcional)</label>
          <textarea value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} />

          <label>Categoría</label>
          <input required value={createForm.category} onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })} />

          <label>Imagen (URL)</label>
          <input required value={createForm.image} onChange={(e) => setCreateForm({ ...createForm, image: e.target.value })} />

          <label>Precio</label>
          <input type="number" step="0.01" required value={createForm.price as any} onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })} />

          <label>Cantidad</label>
          <input type="number" required value={createForm.quantity as any} onChange={(e) => setCreateForm({ ...createForm, quantity: parseInt(e.target.value || "0", 10) })} />

          <div className="form-actions">
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => setCreating(false)}>Cancelar</button>
          </div>
        </form>
      )}

      {/* Edit form top */}
      {editingId && (
        <div className="products-edit">
          <h3>Editar producto</h3>

          <label>Nombre</label>
          <input value={editForm.name as any} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />

          <label>Descripción</label>
          <textarea value={editForm.description as any} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />

          <label>Categoría</label>
          <input value={editForm.category as any} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} />

          <label>Imagen (URL)</label>
          <input value={editForm.image as any} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />

          <label>Precio</label>
          <input type="number" step="0.01" value={editForm.price as any} onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} />

          <label>Cantidad</label>
          <input type="number" value={editForm.quantity as any} onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value || "0", 10) })} />

          <div className="form-actions">
            <button onClick={() => editingId && handleSaveEdit(editingId)}>Guardar cambios</button>
            <button onClick={cancelEdit}>Cancelar</button>
          </div>
        </div>
      )}

      <section className="products-list">
        {loading ? (
          <div> Cargando productos... </div>
        ) : products.length === 0 ? (
          <div>No hay productos.</div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Creado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const id = getId(p);
                return (
                  <tr key={id || Math.random()}>
                    <td>
                      {p.image ? <img src={p.image} alt={p.name} className="prod-thumb" /> : "-"}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{typeof p.price === "number" ? p.price.toFixed(2) : p.price}</td>
                    <td>{p.quantity ?? "-"}</td>
                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"}</td>
                    <td className="actions">
                      <button onClick={() => startEdit(p)}>Editar</button>
                      <button onClick={() => {
                        const realId = id;
                        if (!realId) return alert("Producto sin ID disponible");
                        handleDelete(realId);
                      }}>Eliminar</button>
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
