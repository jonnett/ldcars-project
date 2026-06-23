import React, { useState, useEffect, useContext } from 'react';
import type { Vehiculo } from '../types/index';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Vehiculos() {
  const auth = useContext(AuthContext);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(() => {
    const guardados = localStorage.getItem('ldcars_vehiculos');
    return guardados ? JSON.parse(guardados) : [
      { id: '1', marca: "Toyota", modelo: "RAV4", anio: 2022, patente: "ABCD12", precio: 24500000, color: "Gris", estado: "usado" }
    ];
  });

  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState({
    marca: '', modelo: '', anio: '', patente: '', precio: '', color: '', estado: 'nuevo' as 'nuevo' | 'semi' | 'usado'
  });

  useEffect(() => {
    localStorage.setItem('ldcars_vehiculos', JSON.stringify(vehiculos));
  }, [vehiculos]);

  const handleAgregar = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Vehiculo = {
      id: Date.now().toString(),
      marca: form.marca, modelo: form.modelo, anio: Number(form.anio),
      patente: form.patente, precio: Number(form.precio), color: form.color, estado: form.estado
    };
    setVehiculos([...vehiculos, nuevo]);
    setForm({ marca: '', modelo: '', anio: '', patente: '', precio: '', color: '', estado: 'nuevo' });
  };

  const handleEliminar = (id: string) => {
    setVehiculos(vehiculos.filter(v => v.id !== id));
  };

  const filtrados = vehiculos.filter(v =>
    v.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.modelo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h2>Catálogo de Vehículos</h2>
      <input type="text" className="search-bar" placeholder="Buscar vehículo..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      {/* SOLO SE MUESTRA SI ES ADMIN */}
      {auth?.esAdmin && (
        <form onSubmit={handleAgregar} className="crud-form">
          <h3>Añadir Vehículo</h3>
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
          <button type="submit" style={{ padding: '10px 20px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar Registro</button>
        </form>
      )}

      <div className="list-container">
        {filtrados.map(v => (
          <div key={v.id} className="item-card">
            <h3>{v.marca} {v.modelo}</h3>
            <p><strong>Año:</strong> {v.anio} | <strong>Color:</strong> {v.color}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>${v.precio.toLocaleString()}</p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <Link to={`/vehiculo/${v.id}`} style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                Ver Detalle
              </Link>
              {/* BOTÓN ELIMINAR SOLO PARA ADMIN */}
              {auth?.esAdmin && (
                <button className="btn-delete" onClick={() => handleEliminar(v.id)} style={{ flex: 1, padding: '8px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}