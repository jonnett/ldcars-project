import React, { useState, useEffect, useContext } from 'react';
import type { Colaborador } from '../types/index';
import { AuthContext } from '../context/AuthContext';

export default function Equipo() {
  const auth = useContext(AuthContext);
  const isAdmin = auth?.usuario?.role === 'admin';

  const [equipo, setEquipo] = useState<Colaborador[]>(() => {
    const guardados = localStorage.getItem('ldcars_equipo');
    return guardados ? JSON.parse(guardados) : [
      { id: '1', nombre: 'Juan Pérez', cargo: 'Gerente de Ventas' },
      { id: '2', nombre: 'Ana Gómez', cargo: 'Jefa de Operaciones' }
    ];
  });

  const [form, setForm] = useState({ nombre: '', cargo: '' });

  useEffect(() => { localStorage.setItem('ldcars_equipo', JSON.stringify(equipo)); }, [equipo]);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setEquipo([...equipo, { id: Date.now().toString(), nombre: form.nombre, cargo: form.cargo }]);
    setForm({ nombre: '', cargo: '' });
  };

  const handleEliminar = (id: string) => setEquipo(equipo.filter(c => c.id !== id));

  return (
    <section style={{ marginTop: '50px', paddingBottom: '40px' }}>
      <h2>Nuestro Equipo</h2>
      
      {isAdmin && (
        <form onSubmit={handleGuardar} className="crud-form" style={{ marginBottom: '20px' }}>
          <h3>➕ Añadir Colaborador</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required style={{ flex: 1 }} />
            <input placeholder="Cargo" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} required style={{ flex: 1 }} />
            <button type="submit" style={{ padding: '10px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
          </div>
        </form>
      )}

      <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        {equipo.map(miembro => (
          <div key={miembro.id} className="item-card" style={{ textAlign: 'center', position: 'relative' }}>
            {isAdmin && (
              <button onClick={() => handleEliminar(miembro.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}>X</button>
            )}
            <h3 style={{ margin: '10px 0' }}>{miembro.nombre}</h3>
            <p style={{ color: '#7f8c8d', fontWeight: 'bold', margin: 0 }}>{miembro.cargo}</p>
          </div>
        ))}
      </div>
    </section>
  );
}