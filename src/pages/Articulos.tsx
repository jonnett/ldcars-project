import React, { useState, useEffect, useContext } from 'react';
import type { Articulo } from '../types/index';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function Articulos() {
  const auth = useContext(AuthContext);
  const isAdmin = auth?.usuario?.role === 'admin';

  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const [form, setForm] = useState({ 
    nombre: '', 
    precio: '', 
    cantidad: '', 
    categoria: '', 
    procedencia: '', 
    estado: 'Nuevo', 
    imagen: '' 
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const articulosPorPagina = 3;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'articulos'), (snapshot) => {
      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Articulo[];
      setArticulos(datos);
    });
    return () => unsubscribe();
  }, []);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const dataGuardar = {
      nombre: form.nombre,
      precio: Number(form.precio),
      cantidad: Number(form.cantidad),
      categoria: form.categoria,
      procedencia: form.procedencia,
      estado: form.estado,
      imagen: form.imagen
    };

    try {
      if (editandoId) {
        await updateDoc(doc(db, 'articulos', editandoId), dataGuardar);
        setEditandoId(null);
        alert("¡Artículo actualizado correctamente en la nube!");
      } else {
        await addDoc(collection(db, 'articulos'), dataGuardar);
        alert("¡Artículo guardado correctamente en la nube!");
      }
      setForm({ nombre: '', precio: '', cantidad: '', categoria: '', procedencia: '', estado: 'Nuevo', imagen: '' });
    } catch (error: any) {
      console.error("Error al guardar artículo:", error);
      alert("Error de Firebase: " + error.message);
    }
  };

  const handleEditar = (a: Articulo) => {
    setEditandoId(a.id);
    setForm({
      nombre: a.nombre,
      precio: a.precio.toString(),
      cantidad: a.cantidad.toString(),
      categoria: a.categoria,
      procedencia: a.procedencia,
      estado: a.estado,
      imagen: a.imagen || ''
    });
  };

  const handleEliminar = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'articulos', id));
      alert("Artículo eliminado correctamente.");
    } catch (error: any) {
      console.error("Error al eliminar artículo:", error);
      alert("Error al eliminar: " + error.message);
    }
  };

  const articulosFiltrados = articulos.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indiceUltimo = paginaActual * articulosPorPagina;
  const indicePrimero = indiceUltimo - articulosPorPagina;
  const articulosPaginados = articulosFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(articulosFiltrados.length / articulosPorPagina);

  return (
    <section style={{ marginTop: '30px' }}>
      <h2>Gestión de Artículos y Repuestos</h2>
      
      <input 
        type="text" 
        placeholder="Buscar por nombre o categoría..." 
        value={busqueda} 
        onChange={e => { setBusqueda(e.target.value); setPaginaActual(1); }} 
        className="search-bar"
      />

          {isAdmin && (
            <form onSubmit={handleGuardar} className="crud-form" style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3>{editandoId ? '📝 Editar Artículo' : '➕ Agregar Nuevo Artículo'}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Precio" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Cantidad / Stock" value={form.cantidad} onChange={e => setForm({...form, cantidad: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input placeholder="Categoría" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input placeholder="Procedencia" value={form.procedencia} onChange={e => setForm({...form, procedencia: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="Nuevo">Nuevo</option>
                  <option value="Usado">Usado</option>
                  <option value="Alternativo">Alternativo</option>
                </select>
                <input placeholder="URL de Imagen (Opcional)" value={form.imagen} onChange={e => setForm({...form, imagen: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', gridColumn: '1 / -1' }} />
              </div>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  {editandoId ? 'Actualizar' : 'Guardar'}
                </button>
                {editandoId && (
                  <button type="button" onClick={() => { setEditandoId(null); setForm({ nombre: '', precio: '', cantidad: '', categoria: '', procedencia: '', estado: 'Nuevo', imagen: '' }); }} style={{ padding: '10px 20px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {articulosPaginados.map(a => (
              <div key={a.id} className="item-card" style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <img src={a.imagen || "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=400&q=80"} alt={a.nombre} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '4px' }} />
                <h3>{a.nombre}</h3>
                <p><strong>Categoría:</strong> {a.categoria}</p>
                <p><strong>Stock:</strong> {a.cantidad} u.</p>
                <p style={{ fontSize: '1.2rem', color: '#2ecc71', fontWeight: 'bold' }}>${a.precio.toLocaleString()}</p>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px', paddingTop: '10px' }}>
                  <Link to={`/articulo/${a.id}`} style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '8px', background: '#2c3e50', color: 'white', borderRadius: '4px' }}>Ver Detalle</Link>
                  {isAdmin && (
                    <>
                      <button onClick={() => handleEditar(a)} style={{ padding: '8px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => handleEliminar(a.id)} style={{ padding: '8px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {totalPaginas > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px', paddingBottom: '20px' }}>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                <button 
                  key={num} 
                  onClick={() => { setPaginaActual(num); window.scrollTo({ top: 400, behavior: 'smooth' }); }}
                  style={{ 
                    padding: '10px 15px', 
                    background: paginaActual === num ? '#3498db' : '#ecf0f1', 
                    color: paginaActual === num ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
    </section>
  );
}