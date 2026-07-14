import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import Carrusel from './components/Carrusel';
import Vehiculos from './pages/Vehiculos';
import Articulos from './pages/Articulos';
import DetalleVehiculo from './pages/DetalleVehiculo';
import DetalleArticulo from './pages/DetalleArticulo';
import Equipo from './components/Equipo';
import MisReservas from './pages/MisReservas';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import './App.css';

const NavBar = () => {
  const authContext = useContext(AuthContext);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('ldcars_theme') === 'dark');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);
  
  const [formLogin, setFormLogin] = useState({ user: '', pass: '' });
  const [formReg, setFormReg] = useState({ user: '', pass: '', nombre: '', telefono: '' });
  const [errorAuth, setErrorAuth] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('ldcars_theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('ldcars_theme', 'light');
    }
  }, [isDark]);

  const handleLoginSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorAuth(null);
    try {
      if (authContext) {
        await authContext.login(formLogin.user, formLogin.pass);
        setFormLogin({ user: '', pass: '' });
        setMenuAbierto(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorAuth("Correo electrónico o contraseña inválidos.");
    }
  };

  const handleRegistroSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrorAuth(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, formReg.user, formReg.pass);
      await setDoc(doc(db, "usuarios", cred.user.uid), {
        nombreReal: formReg.nombre,
        correo: formReg.user,
        telefono: formReg.telefono,
        role: 'cliente'
      });
      alert("¡Cuenta de cliente creada e iniciada de manera correcta!");
      setFormReg({ user: '', pass: '', nombre: '', telefono: '' });
      setModoRegistro(false);
      setMenuAbierto(false);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorAuth("Este correo electrónico ya se encuentra registrado.");
      } else if (err.code === 'auth/weak-password') {
        setErrorAuth("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setErrorAuth(err.message);
      }
    }
  };

  return (
    <header style={{ background: '#2c3e50', color: 'white', padding: '15px 20px', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>LdCars Intranet</Link>
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <nav style={{ display: 'flex', gap: '15px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Inicio</Link>
            {authContext?.usuario && (
              <Link to="/mis-reservas" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Reservas</Link>
            )}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem' }}>{isDark ? '🌙' : '☀️'}</span>
            <label className="theme-switch">
              <input type="checkbox" checked={isDark} onChange={() => setIsDark(!isDark)} />
              <span className="slider"></span>
            </label>
          </div>

          {authContext?.usuario?.role === 'cliente' && (
            <button onClick={() => setCarritoAbierto(!carritoAbierto)} style={{ background: '#e67e22', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              🛒 Carrito ({authContext.carrito.length})
            </button>
          )}

          {authContext?.usuario ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.9rem', background: '#34495e', padding: '6px 12px', borderRadius: '4px', border: '1px solid #555' }}>
                👤 {authContext.usuario.nombreReal || authContext.usuario.username} ({authContext.usuario.role.toUpperCase()})
              </span>
              <button onClick={() => { authContext.logout(); setCarritoAbierto(false); }} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Salir</button>
            </div>
          ) : (
            <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ background: '#3498db', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Acceder
            </button>
          )}
        </div>
      </div>

      {menuAbierto && !authContext?.usuario && (
        <div style={{ background: '#34495e', padding: '20px', borderRadius: '6px', marginTop: '10px', maxWidth: '400px', width: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', position: 'absolute', top: '100%', right: '20px', zIndex: 1000 }}>
          {modoRegistro ? (
            <form onSubmit={handleRegistroSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ margin: '0 0 5px 0', textAlign: 'center' }}>Crear Cuenta de Cliente</h4>
              <input type="email" placeholder="Correo electrónico" value={formReg.user} onChange={e => setFormReg({...formReg, user: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="password" placeholder="Contraseña (Mín. 6 chars)" value={formReg.pass} onChange={e => setFormReg({...formReg, pass: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Nombre y Apellido" value={formReg.nombre} onChange={e => setFormReg({...formReg, nombre: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="tel" placeholder="Número de Teléfono" value={formReg.telefono} onChange={e => setFormReg({...formReg, telefono: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ padding: '10px', background: '#2ecc71', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', marginTop: '5px' }}>Registrar</button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ margin: '0 0 5px 0', textAlign: 'center' }}>Iniciar Sesión</h4>
              <input type="email" placeholder="Correo electrónico" value={formLogin.user} onChange={e => setFormLogin({...formLogin, user: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="password" placeholder="Contraseña" value={formLogin.pass} onChange={e => setFormLogin({...formLogin, pass: e.target.value})} required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ padding: '10px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', marginTop: '5px' }}>Entrar</button>
            </form>
          )}
          
          {errorAuth && <p style={{ color: '#ff7675', fontSize: '0.85rem', marginTop: '10px', textAlign: 'center', margin: '5px 0 0 0', fontWeight: 'bold' }}>⚠️ {errorAuth}</p>}
          
          <p style={{ textAlign: 'center', margin: '15px 0 0 0', fontSize: '0.9rem', cursor: 'pointer', color: '#74b9ff', textDecoration: 'underline' }} onClick={() => { setModoRegistro(!modoRegistro); setErrorAuth(null); }}>
            {modoRegistro ? '¿Ya tienes cuenta? Ingresa aquí' : '¿No tienes cuenta? Regístrate aquí'}
          </p>
        </div>
      )}

      {carritoAbierto && authContext?.usuario?.role === 'cliente' && (
        <div style={{ background: 'white', color: '#333', padding: '15px', borderRadius: '6px', marginTop: '10px', maxWidth: '350px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', border: '1px solid #ddd', position: 'absolute', top: '100%', right: '20px', zIndex: 1000 }}>
          <h4 style={{ margin: '0 0 10px 0', borderBottom: '2px solid #eee', paddingBottom: '5px' }}>Tu Carrito 🛒</h4>
          {authContext.carrito.length === 0 ? (
            <p style={{ color: '#7f8c8d', fontSize: '0.9rem', textAlign: 'center', margin: '10px 0' }}>El carrito está vacío.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {authContext.carrito.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '5px' }}>
                  <span style={{ fontSize: '0.85rem' }}>{item.nombre} - <strong>${item.precio.toLocaleString()}</strong></span>
                  <button onClick={() => authContext.eliminarDelCarrito(item.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', padding: '2px 6px', fontSize: '0.8rem' }}>×</button>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontWeight: 'bold', fontSize: '0.95rem' }}>
                <span>Total:</span>
                <span style={{ color: '#27ae60' }}>${authContext.carrito.reduce((acc, curr) => acc + curr.precio, 0).toLocaleString()}</span>
              </div>
              <button onClick={() => authContext.vaciarCarrito()} style={{ padding: '8px', background: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', marginTop: '5px' }}>Vaciar Carrito</button>
            </div>
          )}
        </div>
      )}
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="admin-container">
          <NavBar />
          <main className="dashboard-grid" style={{ padding: '20px 0' }}>
            <Routes>
              <Route path="/" element={<InicioCompleto />} />
              <Route path="/vehiculo/:id" element={<DetalleVehiculo />} />
              <Route path="/articulo/:id" element={<DetalleArticulo />} />
              <Route path="/mis-reservas" element={<MisReservas />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}