import React, { useEffect, useState } from "react";
import api from "../../api/dashboard/dashboard.axios";
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
};

const CATEGORIES = ['Tecnologia', 'Electronica', 'Computacion', 'Ropa', 'Deportes', 'Hogar'];

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
  const [creatingImageUploading, setCreatingImageUploading] = useState(false);
  const [creatingImagePreview, setCreatingImagePreview] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [editingImageUploading, setEditingImageUploading] = useState(false);
  const [editingImagePreview, setEditingImagePreview] = useState<string | null>(null);

  const getId = (p: Product) => (p._id ? String(p._id) : p.id ? String(p.id) : "");

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const url = "https://api.cloudinary.com/v1_1/dycqxw0aj/image/upload";
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "Swokowsky-bucket");

    console.log("%c[CLOUDINARY] - UPLOAD START", "color: #0a66c2; font-weight: bold", file.name, file.size);

    const res = await fetch(url, { method: "POST", body: fd });
    if (!res.ok) {
      const text = await res.text();
      console.error("%c[CLOUDINARY] - UPLOAD FAILED", "color: #b00020; font-weight: bold", res.status, text);
      throw new Error(`Upload a Cloudinary falló: ${res.status} ${text}`);
    }
    const data = await res.json();
    console.log("%c[CLOUDINARY] - UPLOAD OK", "color: #0a8a00; font-weight: bold", data);
    if (!data.secure_url) {
      console.error("%c[CLOUDINARY] - secure_url missing", "color: #b00020; font-weight: bold", data);
      throw new Error("No se recibió secure_url desde Cloudinary");
    }
    return data.secure_url as string;
  };

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

  const onCreateImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setCreatingImagePreview(preview);

    setCreatingImageUploading(true);
    try {
      const secureUrl = await uploadToCloudinary(file);
      setCreateForm((prev) => ({ ...prev, image: secureUrl }));
      console.log("%c[PRODUCTS] - create image secure_url:", "color: #0a8a00; font-weight: bold", secureUrl);
    } catch (err: any) {
      console.error("%c[PRODUCTS] - create image upload error", "color: #b00020; font-weight: bold", err);
      setError(err?.message || "Error al subir imagen");
      setCreateForm((prev) => ({ ...prev, image: "" }));
    } finally {
      setCreatingImageUploading(false);
    }
  };

  const onEditImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setEditingImagePreview(preview);

    setEditingImageUploading(true);
    try {
      const secureUrl = await uploadToCloudinary(file);
      setEditForm((prev) => ({ ...prev, image: secureUrl }));
      console.log("%c[PRODUCTS] - edit image secure_url:", "color: #0a8a00; font-weight: bold", secureUrl);
    } catch (err: any) {
      console.error("%c[PRODUCTS] - edit image upload error", "color: #b00020; font-weight: bold", err);
      setError(err?.message || "Error al subir imagen");
      setEditForm((prev) => ({ ...prev, image: "" }));
    } finally {
      setEditingImageUploading(false);
    }
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    try {
      if (!createForm.image) {
        return setError("Debe subir una imagen antes de guardar.");
      }

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
      setCreatingImagePreview(null);
      setCreating(false);
    } catch (err: any) {
      console.error("%c[PRODUCTS] - POST error", "color: #b00020; font-weight: bold", err);
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
    setEditingImagePreview(p.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditingImagePreview(null);
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

      console.log("%c[PRODUCTS] - PATCH /products/" + id, "color: #0a66c2; font-weight: bold");
      console.log("→ Payload:", payload);

      const res = await api.patch(`/products/${id}`, payload);

      console.log("%c[PRODUCTS] - PATCH response", "color: #0a8a00; font-weight: bold", res.status, res.data);

      setProducts((prev) => prev.map((p) => (getId(p) === id ? res.data : p)));
      cancelEdit();
    } catch (err: any) {
      console.error("%c[PRODUCTS] - PATCH error", "color: #b00020; font-weight: bold", err);
      setError(err?.response?.data?.message || err.message || "Error al actualizar producto");
    }
  };

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
    <div className="swk-products-container">
      <div className="swk-products-header-zone">
        <div className="swk-products-title-group">
          <h1 className="swk-products-main-title">Productos</h1>
          <p className="swk-products-subtitle">Gestiona tu inventario</p>
        </div>
        <div className="swk-products-action-buttons">
          <button 
            className="swk-products-btn-secondary" 
            onClick={fetchProducts}
          >
            <svg className="swk-products-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refrescar
          </button>
          <button 
            className="swk-products-btn-primary"
            onClick={() => { setCreating((c) => !c); setEditingId(null); }}
          >
            <svg className="swk-products-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {creating ? "Cancelar" : "Crear producto"}
          </button>
        </div>
      </div>

      {error && (
        <div className="swk-products-alert-error">
          <svg className="swk-products-alert-icon" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {creating && (
        <form className="swk-products-form-card" onSubmit={handleCreate}>
          <div className="swk-products-form-header">
            <h3 className="swk-products-form-title">Crear Producto</h3>
          </div>

          <div className="swk-products-form-grid">
            <div className="swk-products-form-field">
              <label className="swk-products-label">Nombre</label>
              <input 
                className="swk-products-input"
                required 
                value={createForm.name} 
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} 
              />
            </div>

            <div className="swk-products-form-field">
              <label className="swk-products-label">Categoría</label>
              <select 
                className="swk-products-input"
                required 
                value={createForm.category} 
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="swk-products-form-field swk-products-form-field-full">
              <label className="swk-products-label">Descripción</label>
              <textarea 
                className="swk-products-textarea"
                value={createForm.description} 
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} 
                rows={3}
              />
            </div>

            <div className="swk-products-form-field">
              <label className="swk-products-label">Precio</label>
              <input 
                className="swk-products-input"
                type="number" 
                step="0.01" 
                required 
                value={createForm.price as any} 
                onChange={(e) => setCreateForm({ ...createForm, price: Number(e.target.value) })} 
              />
            </div>

            <div className="swk-products-form-field">
              <label className="swk-products-label">Cantidad</label>
              <input 
                className="swk-products-input"
                type="number" 
                required 
                value={createForm.quantity as any} 
                onChange={(e) => setCreateForm({ ...createForm, quantity: parseInt(e.target.value || "0", 10) })} 
              />
            </div>

            <div className="swk-products-form-field swk-products-form-field-full">
              <label className="swk-products-label">Imagen</label>
              <div className="swk-products-upload-zone">
                <input
                  className="swk-products-file-input"
                  type="file"
                  accept="image/*"
                  onChange={onCreateImageChange}
                  disabled={creatingImageUploading}
                  id="swk-create-file"
                />
                <label htmlFor="swk-create-file" className="swk-products-file-label">
                  {creatingImageUploading ? (
                    <>
                      <div className="swk-products-spinner" />
                      Subiendo imagen...
                    </>
                  ) : (
                    <>
                      <svg className="swk-products-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Seleccionar imagen
                    </>
                  )}
                </label>
                {creatingImagePreview && (
                  <div className="swk-products-preview-wrapper">
                    <img src={creatingImagePreview} alt="preview" className="swk-products-preview-img" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="swk-products-form-actions">
            <button type="submit" className="swk-products-btn-primary" disabled={creatingImageUploading}>
              Guardar producto
            </button>
            <button 
              type="button" 
              className="swk-products-btn-ghost"
              onClick={() => { 
                setCreating(false); 
                setCreatingImagePreview(null); 
                setCreateForm({ name: "", description: "", category: "", image: "", price: 0, quantity: 1 }); 
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {editingId && (
        <div className="swk-products-form-card">
          <div className="swk-products-form-header">
            <h3 className="swk-products-form-title">Editar producto</h3>
          </div>

          <div className="swk-products-form-grid">
            <div className="swk-products-form-field">
              <label className="swk-products-label">Nombre</label>
              <input 
                className="swk-products-input"
                value={editForm.name as any} 
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} 
              />
            </div>

            <div className="swk-products-form-field">
              <label className="swk-products-label">Categoría</label>
              <select 
                className="swk-products-input"
                value={editForm.category as any} 
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="swk-products-form-field swk-products-form-field-full">
              <label className="swk-products-label">Descripción</label>
              <textarea 
                className="swk-products-textarea"
                value={editForm.description as any} 
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} 
                rows={3}
              />
            </div>

            <div className="swk-products-form-field">
              <label className="swk-products-label">Precio</label>
              <input 
                className="swk-products-input"
                type="number" 
                step="0.01" 
                value={editForm.price as any} 
                onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })} 
              />
            </div>

            <div className="swk-products-form-field">
              <label className="swk-products-label">Cantidad</label>
              <input 
                className="swk-products-input"
                type="number" 
                value={editForm.quantity as any} 
                onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value || "0", 10) })} 
              />
            </div>

            <div className="swk-products-form-field swk-products-form-field-full">
              <label className="swk-products-label">Imagen</label>
              <div className="swk-products-upload-zone">
                <input
                  className="swk-products-file-input"
                  type="file"
                  accept="image/*"
                  onChange={onEditImageChange}
                  disabled={editingImageUploading}
                  id="swk-edit-file"
                />
                <label htmlFor="swk-edit-file" className="swk-products-file-label">
                  {editingImageUploading ? (
                    <>
                      <div className="swk-products-spinner" />
                      Subiendo imagen...
                    </>
                  ) : (
                    <>
                      <svg className="swk-products-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Cambiar imagen
                    </>
                  )}
                </label>
                {editingImagePreview && (
                  <div className="swk-products-preview-wrapper">
                    <img src={editingImagePreview} alt="preview" className="swk-products-preview-img" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="swk-products-form-actions">
            <button 
              className="swk-products-btn-primary" 
              onClick={() => editingId && handleSaveEdit(editingId)} 
              disabled={editingImageUploading}
            >
              Guardar cambios
            </button>
            <button className="swk-products-btn-ghost" onClick={cancelEdit}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <section className="swk-products-list-section">
        {loading ? (
          <div className="swk-products-loading-state">
            <div className="swk-products-spinner-large" />
            <p>Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="swk-products-empty-state">
            <svg className="swk-products-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3>No hay productos</h3>
            <p>Comienza creando tu primer producto</p>
          </div>
        ) : (
          <div className="swk-products-grid">
            {products.map((p) => {
              const id = getId(p);
              return (
                <div key={id || Math.random()} className="swk-products-card">
                  <div className="swk-products-card-image">
                    {p.image ? (
                      <img src={p.image} alt={p.name} />
                    ) : (
                      <div className="swk-products-card-image-placeholder">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="swk-products-card-content">
                    <h4 className="swk-products-card-title">{p.name}</h4>
                    <span className="swk-products-card-category">{p.category}</span>
                    {p.description && (
                      <p className="swk-products-card-description">{p.description}</p>
                    )}
                    <div className="swk-products-card-info">
                      <div className="swk-products-card-price">
                        ${typeof p.price === "number" ? p.price.toFixed(2) : p.price}
                      </div>
                      <div className="swk-products-card-quantity">
                        Stock: <span>{p.quantity ?? "-"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="swk-products-card-actions">
                    <button 
                      className="swk-products-card-btn-edit"
                      onClick={() => startEdit(p)}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button 
                      className="swk-products-card-btn-delete"
                      onClick={() => {
                        const realId = id;
                        if (!realId) return alert("Producto sin ID disponible");
                        handleDelete(realId);
                      }}
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
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