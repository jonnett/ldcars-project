import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext, useState, useEffect } from 'react';
import Carrusel from './components/Carrusel';
import Vehiculos from './pages/Vehiculos';
import Articulos from './pages/Articulos';
import DetalleVehiculo from './pages/DetalleVehiculo';
import Equipo from './components/Equipo';
import DetalleArticulo from './pages/DetalleArticulo';
import './App.css';

const NavBar = () => {
  const auth = useContext(AuthContext);
  const [isDark, setIsDark] = useState(() => localStorage.getItem('ldcars_theme') === 'dark');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [modoRegistro, setModoRegistro] = useState(false);
  
  // Estados para validación
  const [formLogin, setFormLogin] = useState({ user: '', pass: '' });
  const [formReg, setFormReg] = useState({ user: '', pass: '', passConfirm: '', nombre: '', correo: '', telefono: '' });

  useEffect(() => {
    if (isDark) { document.body.classList.add('dark-mode'); localStorage.setItem('ldcars_theme', 'dark'); } 
    else { document.body.classList.remove('dark-mode'); localStorage.setItem('ldcars_theme', 'light'); }
  }, [isDark]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const exito = auth?.login(formLogin.user, formLogin.pass);
    if (!exito) alert("Credenciales incorrectas.");
    else { setMenuAbierto(false); setFormLogin({ user: '', pass: '' }); }
  };

  const handleRegistro = (e: React.FormEvent) => {
    e.preventDefault();
    // VALIDACIONES (VERIFICADORES)
    if (formReg.pass !== formReg.passConfirm) return alert("❌ Las contraseñas no coinciden.");
    if (formReg.pass.length < 4) return alert("❌ La contraseña debe tener al menos 4 caracteres.");
    if (formReg.telefono.length < 8) return alert("❌ Ingrese un número de teléfono válido (mínimo 8 dígitos).");
    
    const exito = auth?.registrar(formReg);
    if (exito === true) {
      alert("✅ Registro exitoso. ¡Bienvenido!");
      setMenuAbierto(false);
      setFormReg({ user: '', pass: '', passConfirm: '', nombre: '', correo: '', telefono: '' });
    } else {
      alert(`❌ Error: ${exito}`); // Muestra por qué falló
    }
  };

  const totalCarrito = auth?.carrito.reduce((acc, item) => acc + item.precio, 0) || 0;

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 40px', backgroundColor: '#2c3e50', color: 'white' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <label className="theme-switch"><input type="checkbox" checked={isDark} onChange={() => setIsDark(!isDark)} /><span className="slider"></span></label>
        <h1 style={{ margin: 0 }}>LdCars</h1>
      </div>

      <div style={{ position: 'relative', display: 'flex', gap: '15px', alignItems: 'center' }}>
        {auth?.usuario ? (
          <>
            <span style={{ fontWeight: 'bold', color: auth.usuario.role === 'admin' ? '#f1c40f' : '#2ecc71' }}>
              Hola, {auth.usuario.username} {auth.usuario.role === 'admin' ? '👑' : ''}
            </span>
            
            {/* Botón y Dropdown del Carrito */}
            {auth.usuario.role === 'cliente' && (
              <div style={{ position: 'relative' }}>
                <button onClick={() => setCarritoAbierto(!carritoAbierto)} style={{ cursor: 'pointer', background: '#e67e22', color: 'white', padding: '8px 15px', borderRadius: '4px', border: 'none', fontWeight: 'bold' }}>
                  🛒 Carrito ({auth.carrito.length})
                </button>
                {carritoAbierto && (
                  <div style={{ position: 'absolute', top: '45px', right: '0', width: '300px', background: isDark ? '#16213e' : 'white', color: isDark ? 'white' : 'black', padding: '15px', borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.3)', zIndex: 200 }}>
                    <h3 style={{ marginTop: 0 }}>Tu Carrito</h3>
                    {auth.carrito.length === 0 ? <p>El carrito está vacío.</p> : (
                      <>
                        <ul style={{ padding: 0, listStyle: 'none', maxHeight: '200px', overflowY: 'auto' }}>
                          {auth.carrito.map(item => (
                            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                              <span>{item.nombre}</span>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <span>${item.precio.toLocaleString()}</span>
                                <button onClick={() => auth.eliminarDelCarrito(item.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>X</button>
                              </div>
                            </li>
                          ))}
                        </ul>
                        <div style={{ fontWeight: 'bold', textAlign: 'right', marginTop: '10px', fontSize: '1.2rem' }}>Total: ${totalCarrito.toLocaleString()}</div>
                        <button onClick={() => { alert('¡Compra simulada con éxito!'); auth.logout(); }} style={{ width: '100%', padding: '10px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', marginTop: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Proceder al Pago</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
            <button onClick={auth.logout} style={{ padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salir</button>
          </>
        ) : (
          <div>
            <button onClick={() => setMenuAbierto(!menuAbierto)} style={{ padding: '8px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>Mi Cuenta ▼</button>
            {menuAbierto && (
              <div style={{ position: 'absolute', top: '45px', right: '0', background: isDark ? '#16213e' : 'white', color: isDark ? 'white' : 'black', padding: '20px', borderRadius: '8px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', width: '280px', zIndex: 100 }}>
                <h3 style={{ margin: '0 0 15px 0', textAlign: 'center' }}>{modoRegistro ? 'Registro de Cliente' : 'Iniciar Sesión'}</h3>
                
                {modoRegistro ? (
                  <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input placeholder="Usuario" value={formReg.user} onChange={e => setFormReg({...formReg, user: e.target.value})} required style={{ padding: '8px' }} />
                    <input placeholder="Nombre Completo" value={formReg.nombre} onChange={e => setFormReg({...formReg, nombre: e.target.value})} required style={{ padding: '8px' }} />
                    <input type="email" placeholder="Correo Electrónico" value={formReg.correo} onChange={e => setFormReg({...formReg, correo: e.target.value})} required style={{ padding: '8px' }} />
                    <input type="tel" placeholder="Teléfono" value={formReg.telefono} onChange={e => setFormReg({...formReg, telefono: e.target.value})} required style={{ padding: '8px' }} />
                    <input type="password" placeholder="Contraseña" value={formReg.pass} onChange={e => setFormReg({...formReg, pass: e.target.value})} required style={{ padding: '8px' }} />
                    <input type="password" placeholder="Confirmar Contraseña" value={formReg.passConfirm} onChange={e => setFormReg({...formReg, passConfirm: e.target.value})} required style={{ padding: '8px' }} />
                    <button type="submit" style={{ padding: '10px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Registrarse</button>
                  </form>
                ) : (
                  <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input placeholder="Usuario" value={formLogin.user} onChange={e => setFormLogin({...formLogin, user: e.target.value})} required style={{ padding: '10px' }} />
                    <input type="password" placeholder="Contraseña" value={formLogin.pass} onChange={e => setFormLogin({...formLogin, pass: e.target.value})} required style={{ padding: '10px' }} />
                    <button type="submit" style={{ padding: '10px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Entrar</button>
                  </form>
                )}
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
              <Route path="/articulo/:id" element={<DetalleArticulo />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;