import React from 'react';
import './Home.css';
// Importa la imagen desde tu carpeta assets
import SystemDiagram from '../../assets/diagrama.png';

const Home: React.FC = () => {
    return (
        <div className="home-incus-container">
            {/* Header */}
            <header className="home-incus-header">
                <div className="home-incus-header-content">
                    <h1 className="home-incus-title">
                        Plataforma Distribuida Incus
                    </h1>
                    <p className="home-incus-subtitle">
                        Arquitectura distribuida usando contenedores Incus para alta disponibilidad,
                        escalabilidad horizontal y distribución óptima de la carga de trabajo.
                    </p>
                    <div className="home-incus-card-description">
                        <br />
                        <b>Desarrollado por:</b>
                        <ul>
                            <li>Arnovi Antonio Jimenez Velasquez</li>
                            <li>Juan Felipe Benavides Alvarez</li>
                            <li>Daniel Pelaez Chica</li>
                        </ul>
                    </div>
                    <div className="home-incus-card-description">
                        <br />
                        <b>Docente y Asignatura:</b>
                        <ul>
                            <li>Felipe Gutiérrez Isaza</li>
                            <li>Sistemas Distribuidos 2025-2</li>
                        </ul>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="home-incus-main">

                {/* Components Section */}
                <section className="home-incus-section">
                    <div className="home-incus-section-header">
                        <svg className="home-incus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                        <h2 className="home-incus-section-title">
                            Componentes y Estrategia Clave
                        </h2>
                    </div>

                    <div className="home-incus-cards-grid">
                        {/* Card 1 */}
                        <div className="home-incus-card">
                            <div className="home-incus-card-content">
                                <div className="home-incus-card-icon home-incus-card-icon-blue">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                                        <line x1="6" y1="6" x2="6.01" y2="6" />
                                        <line x1="6" y1="18" x2="6.01" y2="18" />
                                    </svg>
                                </div>
                                <div className="home-incus-card-text">
                                    <h3 className="home-incus-card-title">
                                        Contenedorización Incus
                                    </h3>
                                    <p className="home-incus-card-description">
                                        Cada servicio principal (Frontend, App-Web, Auth, Bases de Datos)
                                        reside en un contenedor Linux Incus separado, asegurando el aislamiento
                                        y la fácil gestión.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="home-incus-card">
                            <div className="home-incus-card-content">
                                <div className="home-incus-card-icon home-incus-card-icon-green">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <ellipse cx="12" cy="5" rx="9" ry="3" />
                                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                                    </svg>
                                </div>
                                <div className="home-incus-card-text">
                                    <h3 className="home-incus-card-title">
                                        Sharding Horizontal (MongoDB)
                                    </h3>
                                    <p className="home-incus-card-description">
                                        Los datos de productos están fragmentados horizontalmente basándose
                                        en la clave <code className="home-incus-code">category</code>.
                                        Esto distribuye la carga entre db-shard-1 (Tecnología) y db-shard-2 (Otras).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="home-incus-card">
                            <div className="home-incus-card-content">
                                <div className="home-incus-card-icon home-incus-card-icon-purple">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="6" y1="3" x2="6" y2="15" />
                                        <circle cx="18" cy="6" r="3" />
                                        <circle cx="6" cy="18" r="3" />
                                        <path d="M18 9a9 9 0 0 1-9 9" />
                                    </svg>
                                </div>
                                <div className="home-incus-card-text">
                                    <h3 className="home-incus-card-title">
                                        Réplica y Consenso (Replica Sets)
                                    </h3>
                                    <p className="home-incus-card-description">
                                        Cada shard es un Replica Set con un Primary, un Secondary (db-repl-x)
                                        y un Arbiter (db-arbiter-x) para garantizar la alta disponibilidad y
                                        la tolerancia a fallos mediante consenso y failover automático.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="home-incus-card">
                            <div className="home-incus-card-content">
                                <div className="home-incus-card-icon home-incus-card-icon-orange">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                    </svg>
                                </div>
                                <div className="home-incus-card-text">
                                    <h3 className="home-incus-card-title">
                                        Servicios y API
                                    </h3>
                                    <p className="home-incus-card-description">
                                        El Auth-Server (Backend NestJS) maneja la autenticación contra
                                        db-auth (PostgreSQL). El App-Web accede a los shards de productos,
                                        y el Frontend (React) consume ambas APIs.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Diagram Section */}
                <section className="home-incus-section">
                    <div className="home-incus-section-header">
                        <svg className="home-incus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                        <h2 className="home-incus-section-title">
                            Diagrama de Arquitectura del Sistema
                        </h2>
                    </div>

                    <div className="home-incus-diagram-wrapper">
                        <div className="home-incus-diagram-container">
                            <img
                                src={SystemDiagram}
                                alt="Diagrama de Arquitectura del Sistema Distribuido Incus"
                                className="home-incus-diagram-image"
                            />
                        </div>
                        <p className="home-incus-diagram-caption">
                            El diagrama ilustra la estructura de los diez contenedores Incus interconectados,
                            la lógica de fragmentación de MongoDB y los flujos de comunicación entre los usuarios
                            y los backends.
                        </p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="home-incus-footer">
                <div className="home-incus-footer-content">
                    <p className="home-incus-footer-text">
                        Plataforma Distribuida Incus © 2024
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;