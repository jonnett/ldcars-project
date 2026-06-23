import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Vehiculo } from '../types/index';

export default function DetalleVehiculo() {
  const { id } = useParams(); 
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);

  useEffect(() => {
    // Hace scroll automático hacia arriba al entrar al detalle
    window.scrollTo(0, 0); 
    const guardados = localStorage.getItem('ldcars_vehiculos');
    if (guardados) {
      const listaVehiculos: Vehiculo[] = JSON.parse(guardados);
      const encontrado = listaVehiculos.find(v => v.id === id);
      if (encontrado) setVehiculo(encontrado);
    }
  }, [id]);

  if (!vehiculo) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Vehículo no encontrado</h2>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  // Imagen por defecto por si el vehículo no tiene URL de imagen guardada
  const imagenMostrar = vehiculo.imagen || "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="detalle-card" style={{ maxWidth: '900px', margin: '40px auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'center' }}>
        
        {/* Lado Izquierdo: Foto */}
        <div style={{ flex: '1 1 400px' }}>
          <img 
            src={imagenMostrar} 
            alt={`${vehiculo.marca} ${vehiculo.modelo}`} 
            style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }} 
          />
        </div>

        {/* Lado Derecho: Detalles */}
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
        <Link to="/" style={{ padding: '12px 30px', background: '#e74c3c', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '1.1rem' }}>
          ← Volver al Catálogo
        </Link>
      </div>
    </div>
  );
}