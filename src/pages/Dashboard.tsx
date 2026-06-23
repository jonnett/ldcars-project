import Carrusel from '../components/Carrusel.tsx';

export default function Dashboard() {
  return (
    <div>
      <h2>Panel Principal - LdCars</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Bienvenido al sistema de gestión interna de vehículos y artículos.</p>
      
      <Carrusel />

      <section style={{ marginTop: '40px' }}>
        <h2>Nuestro Equipo</h2>
        <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '20px' }}>
          <div className="team-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h3>Juan Pérez</h3>
            <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Gerente de Ventas</p>
          </div>
          <div className="team-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h3>Ana Gómez</h3>
            <p style={{ color: '#7f8c8d', margin: '5px 0 0 0' }}>Jefa de Operaciones</p>
          </div>
        </div>
      </section>
    </div>
  );
}