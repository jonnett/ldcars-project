import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { Reserva } from '../types/index';

export default function MisReservas() {
  const auth = useContext(AuthContext);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaACancelar, setReservaACancelar] = useState<Reserva | null>(null);
  const [motivo, setMotivo] = useState('');

  // Efecto para cargar y filtrar las reservas
  useEffect(() => {
    const todas = JSON.parse(localStorage.getItem('ldcars_reservas') || '[]');
    
    // Lógica de separación de datos:
    // Si es admin, muestra todo. Si es cliente, filtra por su usuario.
    if (auth?.usuario?.role === 'admin') {
      setReservas(todas);
    } else {
      const misReservas = todas.filter((r: Reserva) => r.clienteUser === auth?.usuario?.username);
      setReservas(misReservas);
    }
  }, [auth?.usuario]);

  const handleCancelar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservaACancelar) return;

    // Obtener todas las reservas del storage
    const todas = JSON.parse(localStorage.getItem('ldcars_reservas') || '[]');
    
    // Filtrar eliminando solo la que seleccionamos
    const nuevas = todas.filter((r: Reserva) => r.id !== reservaACancelar.id);
    
    // Guardar la nueva lista
    localStorage.setItem('ldcars_reservas', JSON.stringify(nuevas));
    
    // Actualizar estado local
    setReservas(nuevas);
    
    alert(`Reserva cancelada correctamente. Motivo registrado: ${motivo}`);
    setReservaACancelar(null);
    setMotivo('');
  };

  return (
    <section style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>{auth?.usuario?.role === 'admin' ? 'Gestión de Todas las Reservas' : 'Mis Reservas'}</h2>
      
      {reservas.length === 0 ? (
        <p>No tienes reservas registradas en este momento.</p>
      ) : (
        <div className="list-container">
          {reservas.map(r => (
            <div key={r.id} className="item-card" style={{ marginBottom: '15px', border: '1px solid #ccc', padding: '15px' }}>
              <h3>{r.vehiculoNombre}</h3>
              <p><strong>Cliente:</strong> {r.nombreReal}</p>
              <p><strong>Fecha de Visita:</strong> {r.fecha}</p>
              <p><strong>Contacto:</strong> {r.telefono} - {r.correo}</p>
              
              {/* Solo permitimos cancelar si es el dueño de la reserva o si es admin */}
              {(auth?.usuario?.role === 'admin' || auth?.usuario?.username === r.clienteUser) && (
                <button 
                  onClick={() => setReservaACancelar(r)} 
                  style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancelar Reserva
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Cancelación */}
      {reservaACancelar && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', color: '#333', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px' }}>
            <h3>Cancelar Reserva</h3>
            <p>¿Por qué deseas cancelar la reserva de <strong>{reservaACancelar.vehiculoNombre}</strong>?</p>
            
            <form onSubmit={handleCancelar} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea 
                placeholder="Escribe el motivo aquí..." 
                value={motivo} 
                onChange={(e) => setMotivo(e.target.value)} 
                required 
                style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px' }}
              />
              
              <button type="submit" style={{ padding: '10px', background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                Confirmar Cancelación
              </button>
              
              <button type="button" onClick={() => setReservaACancelar(null)} style={{ padding: '10px', background: '#95a5a6', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                Volver
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}