import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function Login() {
  const [isRegistro, setIsRegistro] = useState(false);
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
        // LÓGICA DE REGISTRO EN FIREBASE AUTH
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.pass);
        
        // GUARDAR DATOS DEL CLIENTE EN FIRESTORE
        await setDoc(doc(db, "usuarios", cred.user.uid), {
          nombreReal: form.nombre,
          correo: form.email,
          telefono: form.telefono,
          role: 'cliente' // Todo usuario nuevo registrado por esta vía es cliente
        });
        
        alert("¡Cuenta creada exitosamente! Sesión iniciada.");
        navigate('/'); // Redirigir al home tras registrar
      } else {
        // LÓGICA DE INICIO DE SESIÓN
        if (authContext) {
          await authContext.login(form.email, form.pass);
          navigate('/'); // Redirigir al home tras loguear
        }
      }
    } catch (err: any) {
      console.error("Error en autenticación:", err);
      // Mensajes de error amigables
      if (err.code === 'auth/email-already-in-use') {
        setError("Este correo ya está registrado.");
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Ocurrió un error: " + err.message);
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#2c3e50' }}>
        {isRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          required 
          value={form.email}
          onChange={e => setForm({...form, email: e.target.value})} 
          style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }} 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          required 
          value={form.pass}
          onChange={e => setForm({...form, pass: e.target.value})} 
          style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }} 
        />
        
        {isRegistro && (
          <>
            <input 
              type="text"
              placeholder="Nombre y Apellido" 
              required 
              value={form.nombre}
              onChange={e => setForm({...form, nombre: e.target.value})} 
              style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
            <input 
              type="tel"
              placeholder="Número de Teléfono" 
              required 
              value={form.telefono}
              onChange={e => setForm({...form, telefono: e.target.value})} 
              style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }} 
            />
          </>
        )}

        {error && <p style={{ color: '#e74c3c', fontSize: '0.9rem', textAlign: 'center', margin: 0 }}>{error}</p>}

        <button 
          type="submit" 
          disabled={cargando} 
          style={{ 
            padding: '12px', 
            background: '#2c3e50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: cargando ? 'not-allowed' : 'pointer', 
            fontWeight: 'bold',
            marginTop: '10px'
          }}
        >
          {cargando ? 'Procesando...' : (isRegistro ? 'Registrarse' : 'Ingresar')}
        </button>
      </form>

      <p 
        style={{ textAlign: 'center', marginTop: '20px', color: '#3498db', cursor: 'pointer', fontSize: '0.95rem' }} 
        onClick={() => { setIsRegistro(!isRegistro); setError(null); setForm({ email: '', pass: '', nombre: '', telefono: '' }); }}
      >
        {isRegistro ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate aquí'}
      </p>
    </div>
  );
}