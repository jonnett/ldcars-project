import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import Carrusel from './components/Carrusel';
import Vehiculos from './pages/Vehiculos';
import Articulos from './pages/Articulos';
import DetalleVehiculo from './pages/DetalleVehiculo';
import './App.css';

const NavBar = () => {
  const auth = useContext(AuthContext);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  
  // Estado para el Modo Oscuro
  const [isDark, setIsDark] = useState(() => localStorage.getItem('ldcars_theme') === 'dark');

  // Efecto que aplica la clase al <body> según el estado
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('ldcars_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('ldcars_theme', 'light');
    }
  }, [isDark]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    auth?.login(user, pass);
    setUser(''); setPass('');
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: '#2c3e50', color: 'white', flexWrap: 'wrap', gap: '15px' }}>
      
      {/* SECCIÓN IZQUIERDA: Switch y Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <label className="theme-switch" title="Cambiar a Modo Oscuro/Claro">
          <input type="checkbox" checked={isDark} onChange={() => setIsDark(!isDark)} />
          <span className="slider"></span>
        </label>
        <h1 style={{ margin: 0 }}>LdCars</h1>
      </div>
      
      {/* SECCIÓN DERECHA: Login */}
      {auth?.esAdmin ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontWeight: 'bold', color: '#2ecc71' }}>Modo Administrador</span>
          <button onClick={auth.logout} style={{ padding: '8px 15px', cursor: 'pointer', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}>Cerrar Sesión</button>
        </div>
      ) : (
        <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px' }}>
          <input placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: 'none' }} />
          <input type="password" placeholder="Clave" value={pass} onChange={e => setPass(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: 'none' }} />
          <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}>Entrar</button>
        </form>
      )}
    </header>
  );
};

const InicioCompleto = () => (
  <>
    <Carrusel />
    <Vehiculos />
    <Articulos />
    
    {/* SECCIÓN DE COLABORADORES RESTAURADA */}
    <section style={{ marginTop: '50px', paddingBottom: '40px' }}>
      <h2>Nuestro Equipo</h2>
      <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div className="item-card" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '10px 0' }}>Juan Pérez</h3>
          <p style={{ color: '#7f8c8d', fontWeight: 'bold', margin: 0 }}>Gerente de Ventas</p>
        </div>
        <div className="item-card" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '10px 0' }}>Ana Gómez</h3>
          <p style={{ color: '#7f8c8d', fontWeight: 'bold', margin: 0 }}>Jefa de Operaciones</p>
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
              <Route path="/" element={<InicioCompleto />} />
              <Route path="/vehiculo/:id" element={<DetalleVehiculo />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;