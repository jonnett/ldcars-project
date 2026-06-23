import React, { useState, useEffect, useContext } from 'react';
import type { Vehiculo, Reserva } from '../types/index';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const esEmailValido = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return regex.test(email);
};

// Nueva validación para que no sea una fecha pasada
const esFechaValida = (fecha: string) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const seleccionada = new Date(fecha);
  return seleccionada >= hoy;
};

export default function Vehiculos() {
  const auth = useContext(AuthContext);
  const isAdmin = auth?.usuario?.role === 'admin';
  const isCliente = auth?.usuario?.role === 'cliente';

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(() => {
    const guardados = localStorage.getItem('ldcars_vehiculos');
    return guardados ? JSON.parse(guardados) : [];
  });
  
  const [busqueda, setBusqueda] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  
  const [form, setForm] = useState({ 
    marca: '', 
    modelo: '', 
    anio: '', 
    patente: '', 
    precio: '', 
    color: '', 
    estado: 'nuevo' as 'nuevo' | 'semi' | 'usado', 
    imagen: '' 
  });

  const [vehiculoReserva, setVehiculoReserva] = useState<Vehiculo | null>(null);
  
  const [formReserva, setFormReserva] = useState({ 
    nombreReal: '', 
    correo: '', 
    telefono: '', 
    fechaVisita: '' 
  });

  useEffect(() => { 
    localStorage.setItem('ldcars_vehiculos', JSON.stringify(vehiculos)); 
  }, [vehiculos]);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    if (editandoId) {
      setVehiculos(vehiculos.map(v => 
        v.id === editandoId ? { ...v, ...form, anio: Number(form.anio), precio: Number(form.precio) } : v
      ));
      setEditandoId(null);
    } else {
      setVehiculos([...vehiculos, { 
        id: Date.now().toString(), 
        ...form, 
        anio: Number(form.anio), 
        precio: Number(form.precio) 
      }]);
    }
    setForm({ marca: '', modelo: '', anio: '', patente: '', precio: '', color: '', estado: 'nuevo', imagen: '' });
  };

  const handleEliminar = (id: string) => { 
    if(window.confirm("¿Seguro que deseas eliminar este registro?")) {
      setVehiculos(vehiculos.filter(v => v.id !== id)); 
    }
  };

  const handleEditar = (v: Vehiculo) => {
    setForm({ 
      marca: v.marca, 
      modelo: v.modelo, 
      anio: v.anio.toString(), 
      patente: v.patente, 
      precio: v.precio.toString(), 
      color: v.color, 
      estado: v.estado, 
      imagen: v.imagen || '' 
    });
    setEditandoId(v.id);
    window.scrollTo(0, 0);
  };

  const abrirReserva = (v: Vehiculo) => {
    const reservas = JSON.parse(localStorage.getItem('ldcars_reservas') || '[]');
    const yaReservo = reservas.find((r: Reserva) => r.vehiculoId === v.id && r.clienteUser === auth?.usuario?.username);
    
    if (yaReservo) {
      return alert("❌ Ya tienes una reserva activa para este vehículo.");
    }
    
    setFormReserva({ 
      nombreReal: auth?.usuario?.nombreReal || '', 
      correo: auth?.usuario?.correo || '', 
      telefono: auth?.usuario?.telefono || '', 
      fechaVisita: '' 
    });
    setVehiculoReserva(v);
  };

  const confirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones Integradas
    if (!esEmailValido(formReserva.correo)) return alert("❌ El formato del correo es inválido.");
    if (!/^\d+$/.test(formReserva.telefono)) return alert("❌ El teléfono solo debe contener números.");
    if (!esFechaValida(formReserva.fechaVisita)) return alert("❌ La fecha de visita no puede ser anterior a hoy.");
    
    if (!auth?.usuario || !vehiculoReserva) return;

    const nuevaReserva: Reserva = {
      id: Date.now().toString(), 
      vehiculoId: vehiculoReserva.id, 
      vehiculoNombre: `${vehiculoReserva.marca} ${vehiculoReserva.modelo}`,
      clienteUser: auth.usuario.username, 
      nombreReal: formReserva.nombreReal, 
      correo: formReserva.correo, 
      telefono: formReserva.telefono, 
      fecha: formReserva.fechaVisita
    };

    const reservasGuardadas = JSON.parse(localStorage.getItem('ldcars_reservas') || '[]');
    localStorage.setItem('ldcars_reservas', JSON.stringify([...reservasGuardadas, nuevaReserva]));
    
    alert("✅ ¡Reserva confirmada! Un ejecutivo te contactará pronto.");
    setVehiculoReserva(null);
  };

  const filtrados = vehiculos.filter(v => 
    v.marca.toLowerCase().includes(busqueda.toLowerCase()) || 
    v.modelo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section>
      <h2>Catálogo de Vehículos</h2>
      
      <input 
        type="text" 
        className="search-bar" 
        placeholder="Buscar vehículo..." 
        value={busqueda} 
        onChange={(e) => setBusqueda(e.target.value)} 
      />

      {isAdmin && (
        <form onSubmit={handleGuardar} className="crud-form" style={{ border: editandoId ? '2px solid #3498db' : 'none' }}>
          <h3>{editandoId ? '✏️ Editar Vehículo' : '➕ Añadir Vehículo'}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
            <input placeholder="Marca" value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} required />
            <input placeholder="Modelo" value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})} required />
            <input type="number" placeholder="Año" value={form.anio} onChange={e => setForm({...form, anio: e.target.value})} required />
            <input placeholder="Patente" value={form.patente} onChange={e => setForm({...form, patente: e.target.value})} required />
            <input type="number" placeholder="Precio ($)" value={form.precio} onChange={e => setForm({...form, precio: e.target.value})} required />
            <input placeholder="Color" value={form.color} onChange={e => setForm({...form, color: e.target.value})} required />
            
            <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value as any})} style={{ padding: '10px' }}>
              <option value="nuevo">Nuevo</option>
              <option value="semi">Seminuevo</option>
              <option value="usado">Usado</option>
            </select>
            
            <input placeholder="URL Imagen (Opcional)" value={form.imagen} onChange={e => setForm({...form, imagen: e.target.value})} />
          </div>
          
          <button type="submit" style={{ padding: '10px 20px', background: editandoId ? '#3498db' : '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Guardar
          </button>
        </form>
      )}

      <div className="list-container">
        {filtrados.map(v => (
          <div key={v.id} className="item-card">
            {v.imagen && <img src={v.imagen} alt={v.modelo} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }} />}
            
            <h3>{v.marca} {v.modelo}</h3>
            <p><strong>Año:</strong> {v.anio} | <strong>Color:</strong> {v.color}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50' }}>${v.precio.toLocaleString()}</p>
            
            <div style={{ display: 'flex', gap: '5px', marginTop: '15px', flexWrap: 'wrap' }}>
              <Link to={`/vehiculo/${v.id}`} style={{ flex: 1, textAlign: 'center', padding: '8px', background: '#2c3e50', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
                Detalle
              </Link>
              
              {isCliente && (
                <button onClick={() => abrirReserva(v)} style={{ flex: 1, padding: '8px', background: '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Reservar
                </button>
              )}
              
              {isAdmin && (
                <>
                  <button onClick={() => handleEditar(v)} style={{ flex: 1, padding: '8px', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Editar
                  </button>
                  <button onClick={() => handleEliminar(v.id)} style={{ flex: 1, padding: '8px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {vehiculoReserva && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', color: '#333', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>Agendar Visita: {vehiculoReserva.marca}</h3>
            
            <form onSubmit={confirmarReserva} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
              <input placeholder="Nombre Real" value={formReserva.nombreReal} onChange={e => setFormReserva({...formReserva, nombreReal: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="email" placeholder="Correo" value={formReserva.correo} onChange={e => setFormReserva({...formReserva, correo: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="tel" placeholder="Teléfono" value={formReserva.telefono} onChange={e => setFormReserva({...formReserva, telefono: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Fecha de Visita:</label>
                <input type="date" value={formReserva.fechaVisita} onChange={e => setFormReserva({...formReserva, fechaVisita: e.target.value})} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '12px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Confirmar</button>
                <button type="button" onClick={() => setVehiculoReserva(null)} style={{ flex: 1, padding: '12px', background: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}