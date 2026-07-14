import React, { useState, useEffect, useContext } from 'react';
import type { Colaborador } from '../types/index';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Equipo() {
  const auth = useContext(AuthContext);
  const isAdmin = auth?.usuario?.role === 'admin';

  const [equipo, setEquipo] = useState<Colaborador[]>([]);
  const [form, setForm] = useState({ nombre: '', cargo: '' });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'equipo'), (snapshot) => {
      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Colaborador[];
      setEquipo(datos);
    });
    return () => unsubscribe();
  }, []);

  const handleGuardar = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.cargo) return;
    try {
      await addDoc(collection(db, 'equipo'), {
        nombre: form.nombre,
        cargo: form.cargo
      });
      setForm({ nombre: '', cargo: '' });
      alert("¡Colaborador añadido correctamente en la nube!");
    } catch (error: any) {
      console.error("Error al añadir colaborador:", error);
      alert("Error de Firebase: " + error.message);
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'equipo', id));
    } catch (error: any) {
      console.error("Error al eliminar colaborador:", error);
      alert("Error de Firebase: " + error.message);
    }
  };

  return (
    <section style={{ marginTop: '50px', paddingBottom: '40px' }}>
      <h2>Nuestro Equipo</h2>
      
      {isAdmin && (
        <form onSubmit={handleGuardar} className="crud-form" style={{ marginBottom: '20px', padding: '20px', borderRadius: '8px' }}>
          <h3>➕ Añadir Colaborador</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              placeholder="Nombre" 
              value={form.nombre} 
              onChange={e => setForm({...form, nombre: e.target.value})} 
              required 
              style={{ flex: 1, padding: '10px', borderRadius: '4px' }} 
            />
            <input 
              placeholder="Cargo" 
              value={form.cargo} 
              onChange={e => setForm({...form, cargo: e.target.value})} 
              required 
              style={{ flex: 1, padding: '10px', borderRadius: '4px' }} 
            />
            <button type="submit" style={{ padding: '10px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
          </div>
        </form>
      )}

      <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {equipo.map(miembro => (
          <div key={miembro.id} className="item-card" style={{ textAlign: 'center', position: 'relative', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            {isAdmin && (
              <button 
                onClick={() => handleEliminar(miembro.id)} 
                style={{ position: 'absolute', top: '10px', right: '10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ×
              </button>
            )}
            <h3>{miembro.nombre}</h3>
            <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>{miembro.cargo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}