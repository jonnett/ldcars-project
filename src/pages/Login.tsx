import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'admin123' && pass === '1234') {
      auth?.login(user, pass);
      navigate('/'); // Redirige al inicio si es exitoso
    } else {
      alert("Credenciales incorrectas. Intenta con admin123 y 1234");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>Acceso Intranet</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="Usuario (ej. admin123)"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Contraseña (ej. 1234)"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
          style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '12px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
          Ingresar al Sistema
        </button>
      </form>
    </div>
  );
}