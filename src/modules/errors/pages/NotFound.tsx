import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  return (
    <main className="notfound-container">
      <section className="notfound-content">
        
        <div className="notfound-circle">
          <span className="notfound-code">404</span>
        </div>

        <h1 className="notfound-title">
          ¡Ups! Página no encontrada
        </h1>

        <p className="notfound-text">
          La página que buscas no existe o está en construcción.
          Regresa al inicio para continuar navegando.
        </p>

        <Link to="/" className="notfound-button">
          Volver al Inicio
        </Link>

      </section>
    </main>
  );
}
