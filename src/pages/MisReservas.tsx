import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { Reserva } from '../types/index';
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, addDoc } from 'firebase/firestore';

export default function MisReservas() {
  const auth = useContext(AuthContext);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaACancelar, setReservaACancelar] = useState<Reserva | null>(null);
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reservas'), (snapshot) => {
      const todas = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reserva[];
      
      if (auth?.usuario?.role === 'admin') {
        setReservas(todas);
      } else {
        const misReservas = todas.filter((r: Reserva) => r.clienteUser === auth?.usuario?.username);
        setReservas(misReservas);
      }
    });
    return () => unsubscribe();
  }, [auth?.usuario]);

  const handleCancelar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservaACancelar) return;

    try {
      // Registra la cancelación en un historial en la nube
      await addDoc(collection(db, 'cancelaciones'), {
        reservaId: reservaACancelar.id,
        vehiculoNombre: reservaACancelar.vehiculoNombre,
        clienteUser: reservaACancelar.clienteUser,
        motivo: motivo,
        fechaCancelacion: new Date().toISOString()
      });

      // Elimina el documento de la colección de reservas activas
      await deleteDoc(doc(db, 'reservas', reservaACancelar.id));
      setReservaACancelar(null);
      setMotivo('');
      alert("La reserva ha sido cancelada exitosamente.");
    } catch (error) {
      console.error("Error al procesar la cancelación en Firestore:", error);
    }
  };

  return (
    <section style={{ marginTop: '30px' }}>
      <h2>{auth?.usuario?.role === 'admin' ? 'Todas las Reservas del Sistema' : 'Mis Reservas de Visitas'}</h2>
      
      {reservas.length === 0 ? (
        <p style={{ color: '#7f8c8d' }}>No hay registros de reservas en este momento.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {reservas.map(r => (
            <div key={r.id} style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative' }}>
              <h3>{r.vehiculoNombre}</h3>
              <p><strong>Fecha de Visita:</strong> {r.fecha}</p>
              <p><strong>Cliente:</strong> {r.nombreReal} ({r.clienteUser})</p>
              <p><strong>Contacto:</strong> {r.telefono} | {r.correo}</p>
              
              <button 
                onClick={() => setReservaACancelar(r)} 
                style={{ marginTop: '15px', width: '100%', padding: '10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancelar Reserva
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE CANCELACIÓN */}
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
                style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
              />
              
              <button type="submit" style={{ padding: '10px', background: '#c0392b', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                Confirmar Cancelación
              </button>
              
              <button type="button" onClick={() => setReservaACancelar(null)} style={{ padding: '10px', background: '#95a5a6', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                Volver Atrás
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}