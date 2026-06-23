import React, { useState, useEffect, useContext } from 'react';
import type { Articulo } from '../types/index';
import { AuthContext } from '../context/AuthContext';

export default function Articulos() {
  const auth = useContext(AuthContext);
  const [articulos, setArticulos] = useState<Articulo[]>(() => {
    const guardados = localStorage.getItem('ldcars_articulos');
    return guardados ? JSON.parse(guardados) : [
      { id: '1', nombre: "Neumático Michelin", precio: 85000, cantidad: 12, categoria: "Accesorios", procedencia: "Importado", estado: "Disponible" }
    ];
  });

  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState({
    nombre: '', precio: '', cantidad: '', categoria: '', procedencia: '', estado: 'Disponible'
  });

  useEffect(() => {
    localStorage.setItem('ldcars_articulos', JSON.stringify(articulos));
  }, [articulos]);

  const handleAgregar = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Articulo = {
      id: Date.now().toString(),
      nombre: form.nombre, precio: Number(form.precio), cantidad: Number(form.cantidad),
      categoria: form.categoria, procedencia: form.procedencia, estado: form.estado
    };
    setArticulos([...articulos, nuevo]);
    setForm({ nombre: '', precio: '', cantidad: '', categoria: '', procedencia: '', estado: 'Disponible' });
  };

  const filtrados = articulos.filter(a => a.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div>
      <h2>Venta de Repuestos</h2>
      <input type="text" className="search-bar" placeholder="Buscar repuesto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      {auth?.esAdmin && (
        <form onSubmit={handleAgregar} className="crud-form">
          <h3>Añadir Artículo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
            <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
            <input type="number" placeholder="Precio ($)" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
            <input type="number" placeholder="Cantidad" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} required />
            <input placeholder="Categoría" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required />
            <input placeholder="Procedencia" value={form.procedencia} onChange={e => setForm({...form, procedencia: e.target.value})} required />
            <input placeholder="Estado" value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} required />
          </div>
          <button type="submit" style={{ padding: '10px 20px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar Artículo</button>
        </form>
      )}

      <div className="list-container">
        {filtrados.map(a => (
          <div key={a.id} className="item-card">
            <h3>{a.nombre}</h3>
            <p><strong>Categoría:</strong> {a.categoria}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>${a.precio.toLocaleString()}</p>
            
            {auth?.esAdmin && (
              <button className="btn-delete" onClick={() => setArticulos(articulos.filter(art => art.id !== a.id))} style={{ marginTop: '10px', background: '#e74c3c', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}