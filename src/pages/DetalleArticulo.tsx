import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Articulo } from '../types/index';
import { AuthContext } from '../context/AuthContext';

export default function DetalleArticulo() {
  const { id } = useParams(); 
  const auth = useContext(AuthContext);
  const isCliente = auth?.usuario?.role === 'cliente';
  
  const [articulo, setArticulo] = useState<Articulo | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0); 
    const guardados = localStorage.getItem('ldcars_articulos');
    if (guardados) {
      const lista: Articulo[] = JSON.parse(guardados);
      const encontrado = lista.find(a => a.id === id);
      if (encontrado) setArticulo(encontrado);
    }
  }, [id]);

  if (!articulo) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Artículo no encontrado</h2>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  // Imagen por defecto por si el admin no pone una URL
  const imagenMostrar = articulo.imagen || "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="detalle-card" style={{ maxWidth: '900px', margin: '40px auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Lado Izquierdo: Foto */}
        <div style={{ flex: '1 1 400px' }}>
          <img src={imagenMostrar} alt={articulo.nombre} style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }} />
        </div>

        {/* Lado Derecho: Detalles */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px', marginTop: 0, fontSize: '2.5rem' }}>
            {articulo.nombre}
          </h2>
          <div style={{ fontSize: '1.2rem', lineHeight: '1.8', marginTop: '10px' }}>
            <p><strong>Categoría:</strong> {articulo.categoria}</p>
            <p><strong>Stock Disponible:</strong> {articulo.cantidad} unidades</p>
            <p><strong>Procedencia:</strong> {articulo.procedencia}</p>
            <p><strong>Estado:</strong> {articulo.estado}</p>
            <p style={{ fontSize: '2.2rem', color: '#2ecc71', fontWeight: 'bold', margin: '20px 0' }}>
              ${articulo.precio.toLocaleString()}
            </p>
            
            {/* Botón de compra solo para clientes */}
            {isCliente && (
              <button onClick={() => { auth?.agregarAlCarrito(articulo); alert("¡Añadido al carrito!"); }} style={{ width: '100%', padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>
                Añadir al Carrito 🛒
              </button>
            )}
          </div>
        </div>

      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link to="/" style={{ padding: '12px 30px', background: '#e74c3c', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.1rem' }}>
          ← Volver al Catálogo
        </Link>
      </div>
    </div>
  );
}