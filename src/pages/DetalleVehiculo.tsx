import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Vehiculo } from '../types/index';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function DetalleVehiculo() {
  const { id } = useParams(); 
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0); 
    const fetchVehiculo = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'vehiculos', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setVehiculo({ id: docSnap.id, ...docSnap.data() } as Vehiculo);
        }
      } catch (error) {
        console.error("Error al cargar detalle del vehículo:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchVehiculo();
  }, [id]);

  if (cargando) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}><h2>Cargando detalles del vehículo...</h2></div>;
  }

  if (!vehiculo) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Vehículo no encontrado</h2>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  const imagenMostrar = vehiculo.imagen || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="detalle-card" style={{ padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        <div style={{ flex: '1 1 400px' }}>
          <img 
            src={imagenMostrar} 
            alt={`${vehiculo.marca} ${vehiculo.modelo}`} 
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }} 
          />
        </div>

        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px', marginTop: 0, fontSize: '2.5rem' }}>
            {vehiculo.marca} {vehiculo.modelo}
          </h2>
          <div style={{ fontSize: '1.2rem', lineHeight: '1.8', marginTop: '10px' }}>
            <p><strong>Año de Fabricación:</strong> {vehiculo.anio}</p>
            <p><strong>Patente:</strong> {vehiculo.patente}</p>
            <p><strong>Color:</strong> {vehiculo.color}</p>
            <p><strong>Estado Actual:</strong> {vehiculo.estado.toUpperCase()}</p>
            <p style={{ fontSize: '2.2rem', color: '#3498db', fontWeight: 'bold', margin: '20px 0' }}>
              ${vehiculo.precio.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Link to="/" style={{ padding: '12px 25px', background: '#2c3e50', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          Volver a la Galería
        </Link>
      </div>
    </div>
  );
}