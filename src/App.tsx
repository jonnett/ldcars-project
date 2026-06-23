import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, useState } from 'react';
import Carrusel from './components/Carrusel';
import Vehiculos from './pages/Vehiculos';
import Articulos from './pages/Articulos';
import DetalleVehiculo from './pages/DetalleVehiculo';
import './App.css';

const NavBar = () => {
  const auth = useContext(AuthContext);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    auth?.login(user, pass);
    setUser('');
    setPass('');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#2c3e50', color: 'white' }}>
      <h1 style={{ margin: 0 }}>LdCars</h1>
      
      {/* Sistema de Login en el Header */}
      {auth?.esAdmin ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontWeight: 'bold', color: '#2ecc71' }}>Modo Administrador Activo</span>
          <button onClick={auth.logout} style={{ padding: '8px 15px', cursor: 'pointer', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}>
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px' }}>
          <input 
            placeholder="Usuario" 
            value={user} onChange={e => setUser(e.target.value)} 
            style={{ padding: '8px', borderRadius: '4px', border: 'none' }} 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={pass} onChange={e => setPass(e.target.value)} 
            style={{ padding: '8px', borderRadius: '4px', border: 'none' }} 
          />
          <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}>
            Entrar
          </button>
        </form>
      )}
    </header>
  );
};

// Componente que junta todo como quería tu compañero
const InicioCompleto = () => (
  <>
    <Carrusel />
    <Vehiculos />
    <Articulos />
    
    <section style={{ marginTop: '50px' }}>
      <h2>Nuestro Equipo</h2>
      <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="item-card" style={{ textAlign: 'center' }}>
          <h3>Juan Pérez</h3>
          <p style={{ color: '#7f8c8d' }}>Gerente de Ventas</p>
        </div>
        <div className="item-card" style={{ textAlign: 'center' }}>
          <h3>Ana Gómez</h3>
          <p style={{ color: '#7f8c8d' }}>Jefa de Operaciones</p>
        </div>
      </div>
    </section>
  </>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="admin-container">
          <NavBar />
          <main className="dashboard-grid">
            <Routes>
              {/* Ruta principal: Muestra absolutamente todo */}
              <Route path="/" element={<InicioCompleto />} />
              
              {/* Ruta dinámica para cumplir la rúbrica */}
              <Route path="/vehiculo/:id" element={<DetalleVehiculo />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;