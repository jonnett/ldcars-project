import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState(''); // Firebase usa email, no "user"
  const [pass, setPass] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      // Llamamos a la función real de Firebase que definimos en AuthContext
      await auth?.login(email, pass);
      navigate('/'); // Si todo sale bien, redirigimos
    } catch (err: any) {
      // Manejo de errores profesional (exigencia de la rúbrica)
      if (err.code === 'auth/user-not-found') setError("Usuario no encontrado.");
      else if (err.code === 'auth/wrong-password') setError("Contraseña incorrecta.");
      else setError("Error al iniciar sesión. Verifica tus datos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>Acceso Intranet (Firebase)</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email" // Cambiado a tipo email para validación nativa
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        
        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

        <button 
          type="submit" 
          disabled={cargando} // Deshabilita el botón mientras carga
          style={{ padding: '12px', background: cargando ? '#7f8c8d' : '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {cargando ? 'Validando con Google...' : 'Ingresar al Sistema'}
        </button>
      </form>
    </div>
  );
}