import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext"
import "./Login.css";

const Login: React.FC = () => {
  const { login } = useAuth(); 
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(identifier, password);  // <- usar context
      window.location.href = "/";         // <- redirección después del login
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Error al iniciar sesión.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>

        {error && <p className="auth-error">{error}</p>}

        <input
          type="text"
          placeholder="Correo o Usuario"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Entrar"}
        </button>

        <p className="auth-link">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
