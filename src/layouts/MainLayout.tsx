import React from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// MainLayout.tsx - single-file layout containing a left Sidebar (no external CSS needed)
// Replace your existing MainLayout with this file.

const sidebarWidth = 260;

const styles: { [k: string]: React.CSSProperties } = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "#f6f7fb",
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    color: "#111",
  },
  sidebar: {
    width: sidebarWidth,
    background: "#ffffff",
    borderRight: "1px solid #e6e9ef",
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    background: "linear-gradient(135deg,#0e254d,#1b4aa8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 18,
  },
  username: {
    fontWeight: 700,
    fontSize: 14,
    lineHeight: "1.1",
  },
  userEmail: {
    fontSize: 12,
    color: "#666",
  },
  spacer: { flex: 1 },
  logoutBtn: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #ef4444",
    background: "#fff",
    color: "#ef4444",
    cursor: "pointer",
    fontWeight: 700,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginTop: 12,
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 8,
    textDecoration: "none",
    color: "#12233b",
    fontWeight: 600,
    fontSize: 14,
  },
  navLinkActive: {
    background: "#0e254d",
    color: "#fff",
  },
  content: {
    flex: 1,
    padding: 20,
    boxSizing: "border-box",
    overflow: "auto",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
};

const menuItems: { to: string; label: string; icon?: React.ReactNode }[] = [
  { to: "/home", label: "Inicio", icon: "🏠" },
  { to: "/products", label: "Ventas", icon: "🛍️" },
  { to: "/stats", label: "Estadísticas", icon: "📊" },
  { to: "/profile", label: "Perfil", icon: "👤" },
];

function Sidebar() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    // Llamamos al logout del context que hará limpieza y redirección
    try {
      logout(true);
    } catch (e) {
      // fallback: limpiar y recargar
      try {
        localStorage.removeItem("swk_token");
        localStorage.removeItem("swk_user");
      } catch {}
      window.location.href = "/login";
    }
  };

  const username = user?.username || user?.correo || "Usuario";

  return (
    <aside style={styles.sidebar} aria-label="Barra lateral principal">
      <div style={styles.logoArea}>
        <div style={styles.avatar} aria-hidden>
          {String(username).charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={styles.username}>{username}</div>
          {user?.correo && <div style={styles.userEmail}>{user.correo}</div>}
        </div>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {}),
            })}
          >
            <span style={{ width: 20 }}>{m.icon}</span>
            <span>{m.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.spacer} />

      <div>
        <button style={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default function MainLayout(): React.JSX.Element {
  return (
    <div style={styles.root}>
      <Sidebar />

      <main style={styles.content}>
        <div style={styles.topBar}>
          <h2>Mi Panel</h2>
          <div>
            <Link to="/profile" style={{ textDecoration: "none", color: "#0e254d", fontWeight: 700 }}>
              Ver perfil
            </Link>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
