import React, { useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const sidebarWidth = 280;

const styles: { [k: string]: React.CSSProperties } = {
  root: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    color: "#fff",
    position: "relative",
  },
  sidebar: {
    width: sidebarWidth,
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(255, 255, 255, 0.2)",
    padding: "32px 24px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    boxShadow: "4px 0 24px rgba(0, 0, 0, 0.08)",
    position: "relative",
    zIndex: 10,
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
    padding: "16px",
    borderRadius: 16,
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))",
    border: "1px solid rgba(102, 126, 234, 0.2)",
    transition: "all 0.3s ease",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 24,
    boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
    transition: "transform 0.3s ease",
  },
  username: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: "1.2",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: 500,
  },
  spacer: { flex: 1 },
  logoutBtn: {
    padding: "12px 20px",
    borderRadius: 12,
    border: "2px solid #ef4444",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
    width: "100%",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 8,
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    borderRadius: 12,
    textDecoration: "none",
    color: "#475569",
    fontWeight: 600,
    fontSize: 15,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
  },
  navLinkActive: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    boxShadow: "0 8px 16px rgba(102, 126, 234, 0.4)",
    transform: "translateX(4px)",
  },
  content: {
    flex: 1,
    padding: "32px",
    boxSizing: "border-box",
    overflow: "auto",
    position: "relative",
  },
  contentInner: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: 24,
    padding: "32px",
    minHeight: "calc(100vh - 64px)",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
    paddingBottom: 24,
    borderBottom: "2px solid rgba(102, 126, 234, 0.1)",
  },
  topBarTitle: {
    fontSize: 32,
    fontWeight: 800,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    margin: 0,
  },
  profileLink: {
    textDecoration: "none",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    padding: "12px 24px",
    borderRadius: 12,
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
    transition: "all 0.3s ease",
    display: "inline-block",
  },
  iconWrapper: {
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
  },
};

const menuItems: { to: string; label: string; icon: string }[] = [
  { to: "/home", label: "Inicio", icon: "🏠" },
  { to: "/products", label: "Ventas", icon: "🛍️" },
  { to: "/stats", label: "Estadísticas", icon: "📊" },
  { to: "/marketing", label: "Marketing", icon: "🏬" },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleLogout = () => {
    try {
      logout(true);
    } catch (e) {
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
      <div 
        style={{
          ...styles.logoArea,
          transform: hoveredItem === 'logo' ? 'scale(1.02)' : 'scale(1)',
        }}
        onMouseEnter={() => setHoveredItem('logo')}
        onMouseLeave={() => setHoveredItem(null)}
      >
        <div 
          style={{
            ...styles.avatar,
            transform: hoveredItem === 'logo' ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
          }}
        >
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
              ...(hoveredItem === m.to && !isActive ? {
                background: 'rgba(102, 126, 234, 0.1)',
                transform: 'translateX(4px)',
                color: '#667eea',
              } : {}),
            })}
            onMouseEnter={() => setHoveredItem(m.to)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <span style={styles.iconWrapper}>{m.icon}</span>
            <span>{m.label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.spacer} />

      <div>
        <button 
          style={{
            ...styles.logoutBtn,
            transform: hoveredItem === 'logout' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: hoveredItem === 'logout' 
              ? '0 8px 20px rgba(239, 68, 68, 0.5)' 
              : '0 4px 12px rgba(239, 68, 68, 0.3)',
          }}
          onClick={handleLogout}
          onMouseEnter={() => setHoveredItem('logout')}
          onMouseLeave={() => setHoveredItem(null)}
          title="Cerrar sesión"
        >
          🚪 Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

export default function MainLayout(): React.JSX.Element {
  const [hoveredProfile, setHoveredProfile] = useState(false);

  return (
    <div style={styles.root}>
      <Sidebar />

      <main style={styles.content}>
        <div style={styles.contentInner}>
          <div style={styles.topBar}>
            <h2 style={styles.topBarTitle}>Mi Panel</h2>
            <div>
              <Link 
                to="/profile" 
                style={{
                  ...styles.profileLink,
                  transform: hoveredProfile ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
                  boxShadow: hoveredProfile 
                    ? '0 8px 20px rgba(102, 126, 234, 0.5)' 
                    : '0 4px 12px rgba(102, 126, 234, 0.4)',
                }}
                onMouseEnter={() => setHoveredProfile(true)}
                onMouseLeave={() => setHoveredProfile(false)}
              >
                👤 Ver perfil
              </Link>
            </div>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}