import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Vehiculo } from '../types/index';

export default function DetalleVehiculo() {
  // useParams captura el ID de la URL (Ej: /vehiculo/12345)
  const { id } = useParams(); 
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);

  useEffect(() => {
    const guardados = localStorage.getItem('ldcars_vehiculos');
    if (guardados) {
      const listaVehiculos: Vehiculo[] = JSON.parse(guardados);
      const encontrado = listaVehiculos.find(v => v.id === id);
      if (encontrado) {
        setVehiculo(encontrado);
      }
    }
  }, [id]);

  if (!vehiculo) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Vehículo no encontrado</h2>
        <Link to="/vehiculos">Volver al listado</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h2 style={{ borderBottom: '2px solid #2c3e50', paddingBottom: '10px' }}>Detalle del Vehículo</h2>
      <div style={{ fontSize: '1.2rem', lineHeight: '1.8', marginTop: '20px' }}>
        <p><strong>Marca:</strong> {vehiculo.marca}</p>
        <p><strong>Modelo:</strong> {vehiculo.modelo}</p>
        <p><strong>Año:</strong> {vehiculo.anio}</p>
        <p><strong>Patente:</strong> {vehiculo.patente}</p>
        <p><strong>Color:</strong> {vehiculo.color}</p>
        <p><strong>Estado:</strong> {vehiculo.estado.toUpperCase()}</p>
        <p style={{ fontSize: '1.8rem', color: '#2c3e50', fontWeight: 'bold', marginTop: '15px' }}>
          Precio: ${vehiculo.precio.toLocaleString()}
        </p>
      </div>
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <Link to="/vehiculos" style={{ padding: '10px 20px', background: '#2c3e50', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
          Volver al listado
        </Link>
      </div>
    </div>
  );
}