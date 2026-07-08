import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Articulo } from '../types/index';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function DetalleArticulo() {
  const { id } = useParams(); 
  const auth = useContext(AuthContext);
  const isCliente = auth?.usuario?.role === 'cliente';
  
  const [articulo, setArticulo] = useState<Articulo | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); 
    const fetchArticulo = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'articulos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArticulo({ id: docSnap.id, ...docSnap.data() } as Articulo);
        }
      } catch (error) {
        console.error("Error al cargar detalle del artículo:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchArticulo();
  }, [id]);

  if (cargando) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><h2>Cargando detalles del artículo...</h2></div>;
  }

  if (!articulo) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Artículo no encontrado</h2>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  const imagenMostrar = articulo.imagen || "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80";

  return (
    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        <div style={{ flex: '1 1 400px' }}>
          <img 
            src={imagenMostrar} 
            alt={articulo.nombre} 
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }} 
          />
        </div>

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
            
            {isCliente && (
              <button 
                onClick={() => { auth?.agregarAlCarrito(articulo); alert("¡Añadido al carrito!"); }} 
                style={{ width: '100%', padding: '15px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}
              >
                Añadir al Carrito 🛒
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link to="/" style={{ padding: '12px 25px', background: '#2c3e50', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          Volver a la Tienda
        </Link>
      </div>
    </div>
  );
}