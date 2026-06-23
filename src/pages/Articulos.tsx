import React, { useState, useEffect, useContext } from 'react';
import type { Articulo } from '../types/index';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Articulos() {
  const auth = useContext(AuthContext);
  const isAdmin = auth?.usuario?.role === 'admin';
  const isCliente = auth?.usuario?.role === 'cliente';

  // Añadimos artículos por defecto con imágenes reales
  const [articulos, setArticulos] = useState<Articulo[]>(() => {
    const guardados = localStorage.getItem('ldcars_articulos');
    return guardados ? JSON.parse(guardados) : [
      { id: '1', nombre: "Neumático Michelin 17\"", precio: 85000, cantidad: 12, categoria: "Ruedas", procedencia: "Importado", estado: "Nuevo", imagen: "https://images.unsplash.com/photo-1588701635391-7f9fc6d2be90?auto=format&fit=crop&w=800&q=80" },
      { id: '2', nombre: "Aceite Sintético 5W-30", precio: 35000, cantidad: 20, categoria: "Lubricantes", procedencia: "Nacional", estado: "Nuevo", imagen: "https://images.unsplash.com/photo-1616422285623-14ffea6e4921?auto=format&fit=crop&w=800&q=80" },
      { id: '3', nombre: "Batería Bosch 12V", precio: 65000, cantidad: 8, categoria: "Eléctrico", procedencia: "Importado", estado: "Nuevo", imagen: "https://images.unsplash.com/photo-1610488686121-50e50e513812?auto=format&fit=crop&w=800&q=80" }
    ];
  });

  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  
  // Añadimos el campo de imagen al formulario
  const [form, setForm] = useState({ nombre: '', precio: '', cantidad: '', categoria: '', procedencia: '', estado: 'Nuevo', imagen: '' });

  useEffect(() => { localStorage.setItem('ldcars_articulos', JSON.stringify(articulos)); }, [articulos]);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editandoId) {
      setArticulos(articulos.map(a => a.id === editandoId ? { ...a, ...form, precio: Number(form.precio), cantidad: Number(form.cantidad) } : a));
      setEditandoId(null);
    } else {
      setArticulos([...articulos, { id: Date.now().toString(), ...form, precio: Number(form.precio), cantidad: Number(form.cantidad) }]);
    }
    setForm({ nombre: '', precio: '', cantidad: '', categoria: '', procedencia: '', estado: 'Nuevo', imagen: '' });
  };

  const handleEliminar = (id: string) => { if(window.confirm("¿Eliminar este artículo?")) setArticulos(articulos.filter(a => a.id !== id)); };

  const handleEditar = (a: Articulo) => {
    setForm({ nombre: a.nombre, precio: a.precio.toString(), cantidad: a.cantidad.toString(), categoria: a.categoria, procedencia: a.procedencia, estado: a.estado, imagen: a.imagen || '' });
    setEditandoId(a.id);
  };

  const filtrados = articulos.filter(a => a.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <section>
      <h2>Venta de Repuestos y Accesorios</h2>
      <input type="text" className="search-bar" placeholder="Buscar repuesto..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      {isAdmin && (
        <form onSubmit={handleGuardar} className="crud-form" style={{ border: editandoId ? '2px solid #3498db' : 'none' }}>
          <h3>{editandoId ? '✏️ Editar Artículo' : '➕ Añadir Artículo'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
            <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
            <input type="number" placeholder="Precio ($)" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
            <input type="number" placeholder="Cantidad" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} required />
            <input placeholder="Categoría" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required />
            <input placeholder="Procedencia" value={form.procedencia} onChange={e => setForm({...form, procedencia: e.target.value})} required />
            <input placeholder="Estado" value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} required />
            <input placeholder="URL Imagen (Opcional)" value={form.imagen} onChange={e => setForm({...form, imagen: e.target.value})} />
          </div>
          <button type="submit" style={{ padding: '10px 20px', background: editandoId ? '#3498db' : '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
        </form>
      )}

      <div className="list-container">
        {filtrados.map(a => (
          <div key={a.id} className="item-card">
            {a.imagen && <img src={a.imagen} alt={a.nombre} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />}
            <h3 style={{ marginTop: 0 }}>{a.nombre}</h3>
            <p><strong>Categoría:</strong> {a.categoria} | <strong>Stock:</strong> {a.cantidad}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>${a.precio.toLocaleString()}</p>
            
            <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
              <Link to={`/articulo/${a.id}`} style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#2c3e50', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Ver Detalle</Link>
              
              {isCliente && (
                <button onClick={() => { auth?.agregarAlCarrito(a); alert(`Añadiste ${a.nombre} al carrito 🛒`); }} style={{ flex: 1, padding: '8px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Añadir 🛒
                </button>
              )}
              
              {isAdmin && (
                <>
                  <button onClick={() => handleEditar(a)} style={{ flex: 1, padding: '8px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => handleEliminar(a.id)} style={{ flex: 1, padding: '8px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}