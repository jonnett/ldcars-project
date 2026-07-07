import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Login() {
  const [isRegistro, setIsRegistro] = useState(false); // Alterna entre Login y Registro
  const [form, setForm] = useState({ email: '', pass: '', nombre: '', telefono: '' });
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      if (isRegistro) {
        // LÓGICA DE REGISTRO
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.pass);
        await setDoc(doc(db, "usuarios", cred.user.uid), {
          nombreReal: form.nombre,
          correo: form.email,
          telefono: form.telefono,
          role: 'cliente'
        });
        alert("¡Cuenta creada! Ahora inicia sesión.");
        setIsRegistro(false);
      } else {
        // LÓGICA DE LOGIN
        await authContext?.login(form.email, form.pass);
        navigate('/');
      }
    } catch (err: any) {
      setError("Error: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{isRegistro ? 'Crear Cuenta' : 'Acceso Intranet'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Correo" required onChange={e => setForm({...form, email: e.target.value})} style={{ padding: '12px', border: '1px solid #ccc' }} />
        <input type="password" placeholder="Contraseña" required onChange={e => setForm({...form, pass: e.target.value})} style={{ padding: '12px', border: '1px solid #ccc' }} />
        
        {isRegistro && (
          <>
            <input placeholder="Nombre Real" required onChange={e => setForm({...form, nombre: e.target.value})} style={{ padding: '12px', border: '1px solid #ccc' }} />
            <input placeholder="Teléfono" required onChange={e => setForm({...form, telefono: e.target.value})} style={{ padding: '12px', border: '1px solid #ccc' }} />
          </>
        )}

        {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

        <button type="submit" disabled={cargando} style={{ padding: '12px', background: '#2c3e50', color: 'white', border: 'none', cursor: 'pointer' }}>
          {cargando ? 'Procesando...' : (isRegistro ? 'Registrarse' : 'Ingresar')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        {isRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
        <span onClick={() => setIsRegistro(!isRegistro)} style={{ color: '#3498db', cursor: 'pointer', marginLeft: '5px' }}>
          {isRegistro ? 'Inicia sesión' : 'Regístrate aquí'}
        </span>
      </p>
    </div>
  );
}