import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import Carrusel from './components/Carrusel';
import Vehiculos from './pages/Vehiculos';
import Articulos from './pages/Articulos';
import DetalleVehiculo from './pages/DetalleVehiculo';
import Equipo from './components/Equipo';
import './App.css';

const NavBar = () => {
  const auth = useContext(AuthContext);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('ldcars_theme') === 'dark');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    if (isDark) { document.body.classList.add('dark-mode'); localStorage.setItem('ldcars_theme', 'dark'); } 
    else { document.body.classList.remove('dark-mode'); localStorage.setItem('ldcars_theme', 'light'); }
  }, [isDark]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    let exito = false;
    if (modoRegistro) {
      exito = auth?.registrar(user, pass) || false;
      if (!exito) alert("El usuario ya existe o es inválido.");
    } else {
      exito = auth?.login(user, pass) || false;
      if (!exito) alert("Credenciales incorrectas.");
    }
    if (exito) {
      setMenuAbierto(false);
      setUser(''); setPass('');
    }
  };

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#2c3e50', color: 'white' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <label className="theme-switch" title="Modo Oscuro"><input type="checkbox" checked={isDark} onChange={() => setIsDark(!isDark)} /><span className="slider"></span></label>
        <h1 style={{ margin: 0 }}>LdCars</h1>
      </div>

      {/* Menú Superior Derecho */}
      <div style={{ position: 'relative' }}>
        {auth?.usuario ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontWeight: 'bold', color: auth.usuario.role === 'admin' ? '#f1c40f' : '#2ecc71' }}>
              Hola, {auth.usuario.username} {auth.usuario.role === 'admin' ? '👑' : ''}
            </span>
            {auth.usuario.role === 'cliente' && (
              <span style={{ cursor: 'pointer', background: '#e67e22', padding: '5px 10px', borderRadius: '4px' }}>
                🛒 Carrito ({auth.carrito.length})
              </span>
            )}
            <button onClick={auth.logout} style={{ padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salir</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ padding: '8px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
              Mi Cuenta ▼
            </button>
            
            {/* MENÚ DESPLEGABLE */}
            {menuAbierto && (
              <div style={{ position: 'absolute', top: '45px', right: '0', background: isDark ? '#16213e' : 'white', color: isDark ? 'white' : 'black', padding: '20px', borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', width: '250px', zIndex: 100 }}>
                <h3 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>{modoRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}</h3>
                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                  <input type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                  <button type="submit" style={{ padding: '10px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {modoRegistro ? 'Registrarse' : 'Entrar'}
                  </button>
                </form>
                <p style={{ textAlign: 'center', margin: '15px 0 0 0', fontSize: '0.9rem', cursor: 'pointer', color: '#3498db' }} onClick={() => setModoRegistro(!modoRegistro)}>
                  {modoRegistro ? '¿Ya tienes cuenta? Ingresa aquí' : '¿No tienes cuenta? Regístrate'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

const InicioCompleto = () => (
  <>
    <Carrusel />
    <Vehiculos />
    <Articulos />
    <Equipo />
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