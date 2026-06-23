import React, { useState, useEffect, useContext } from 'react';
import type { Vehiculo, Reserva } from '../types/index';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Vehiculos() {
  const auth = useContext(AuthContext);
  const isAdmin = auth?.usuario?.role === 'admin';
  const isCliente = auth?.usuario?.role === 'cliente';

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(() => {
    const guardados = localStorage.getItem('ldcars_vehiculos');
    return guardados ? JSON.parse(guardados) : [];
  });
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState({ marca: '', modelo: '', anio: '', patente: '', precio: '', color: '', estado: 'nuevo' as 'nuevo' | 'semi' | 'usado' });

  useEffect(() => { localStorage.setItem('ldcars_vehiculos', JSON.stringify(vehiculos)); }, [vehiculos]);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editandoId) {
      setVehiculos(vehiculos.map(v => v.id === editandoId ? { ...v, ...form, anio: Number(form.anio), precio: Number(form.precio) } : v));
      setEditandoId(null);
    } else {
      setVehiculos([...vehiculos, { id: Date.now().toString(), ...form, anio: Number(form.anio), precio: Number(form.precio) }]);
    }
    setForm({ marca: '', modelo: '', anio: '', patente: '', precio: '', color: '', estado: 'nuevo' });
  };

  const handleEliminar = (id: string) => {
    if(window.confirm("¿Seguro que deseas eliminar este vehículo?")) setVehiculos(vehiculos.filter(v => v.id !== id));
  };

  const handleEditar = (v: Vehiculo) => {
    setForm({ marca: v.marca, modelo: v.modelo, anio: v.anio.toString(), patente: v.patente, precio: v.precio.toString(), color: v.color, estado: v.estado });
    setEditandoId(v.id);
  };

  // Lógica de Reserva para Clientes
  const handleReservar = (v: Vehiculo) => {
    if (!auth?.usuario) return;
    const nuevaReserva: Reserva = {
      id: Date.now().toString(), vehiculoId: v.id, vehiculoNombre: `${v.marca} ${v.modelo}`,
      cliente: auth.usuario.username, fecha: new Date().toLocaleDateString()
    };
    const reservasGuardadas = JSON.parse(localStorage.getItem('ldcars_reservas') || '[]');
    localStorage.setItem('ldcars_reservas', JSON.stringify([...reservasGuardadas, nuevaReserva]));
    alert(`¡Felicidades ${auth.usuario.username}! Has reservado el ${v.marca} ${v.modelo}. Un ejecutivo te contactará.`);
  };

  const filtrados = vehiculos.filter(v => v.marca.toLowerCase().includes(busqueda.toLowerCase()) || v.modelo.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <section>
      <h2>Catálogo de Vehículos</h2>
      <input type="text" className="search-bar" placeholder="Buscar vehículo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      {isAdmin && (
        <form onSubmit={handleGuardar} className="crud-form" style={{ border: editandoId ? '2px solid #3498db' : 'none' }}>
          <h3>{editandoId ? '✏️ Editar Vehículo' : '➕ Añadir Vehículo'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
            <input placeholder="Marca" value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} required />
            <input placeholder="Modelo" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} required />
            <input type="number" placeholder="Año" value={form.anio} onChange={e => setForm({...form, anio: e.target.value})} required />
            <input placeholder="Patente" value={form.patente} onChange={e => setForm({...form, patente: e.target.value})} required />
            <input type="number" placeholder="Precio ($)" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
            <input placeholder="Color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} required />
            <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value as any})} style={{ padding: '10px' }}>
              <option value="nuevo">Nuevo</option><option value="semi">Seminuevo</option><option value="usado">Usado</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '10px 20px', background: editandoId ? '#3498db' : '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>
        </form>
      )}

      <div className="list-container">
        {filtrados.map(v => (
          <div key={v.id} className="item-card">
            <h3>{v.marca} {v.modelo}</h3>
            <p><strong>Año:</strong> {v.anio} | <strong>Color:</strong> {v.color}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>${v.precio.toLocaleString()}</p>
            
            <div style={{ display: 'flex', gap: '5px', marginTop: '15px', flexWrap: 'wrap' }}>
              <Link to={`/vehiculo/${v.id}`} style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#2c3e50', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Ver Detalle</Link>
              
              {isCliente && (
                <button onClick={() => handleReservar(v)} style={{ flex: 1, padding: '8px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Reservar</button>
              )}
              
              {isAdmin && (
                <>
                  <button onClick={() => handleEditar(v)} style={{ flex: 1, padding: '8px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleEliminar(v.id)} style={{ flex: 1, padding: '8px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}