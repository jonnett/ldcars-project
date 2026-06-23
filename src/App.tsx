// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useContext } from 'react';
import Carrusel from './components/Carrusel';
import './App.css';

// --- VISTAS TEMPORALES (Las crearemos bien en el siguiente paso) ---
const Login = () => {
  const auth = useContext(AuthContext);
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Iniciar Sesión en LdCars</h2>
      <button onClick={() => auth?.login('AdminLdCars')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Simular Ingreso
      </button>
    </div>
  );
};

const Dashboard = () => (
  <div>
    <h2>Bienvenido a la Intranet de LdCars</h2>
    <Carrusel />
  </div>
);

const Vehiculos = () => <div><h2>Módulo de Vehículos (Próximamente)</h2></div>;
const Articulos = () => <div><h2>Módulo de Artículos (Próximamente)</h2></div>;
// -------------------------------------------------------------------

// Componente para la barra de navegación (solo se ve si hay sesión)
const NavBar = () => {
  const auth = useContext(AuthContext);
  if (!auth?.usuario) return null;

  return (
    <header>
      <h1>LdCars Admin</h1>
      <nav style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '10px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link>
        <Link to="/vehiculos" style={{ color: 'white', textDecoration: 'none' }}>Vehículos</Link>
        <Link to="/articulos" style={{ color: 'white', textDecoration: 'none' }}>Artículos (Repuestos)</Link>
        <button onClick={auth.logout} style={{ marginLeft: '20px', cursor: 'pointer' }}>Cerrar Sesión</button>
      </nav>
    </header>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="admin-container">
          <NavBar />
          
          <main className="dashboard-grid">
            <Routes>
              {/* Ruta pública */}
              <Route path="/login" element={<Login />} />
              
              {/* Rutas protegidas */}
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/vehiculos" element={<ProtectedRoute><Vehiculos /></ProtectedRoute>} />
              <Route path="/articulos" element={<ProtectedRoute><Articulos /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;