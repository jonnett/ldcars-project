// src/components/Carrusel.tsx
import { useState, useEffect } from 'react';
import './Carrusel.css';

// Definimos la estructura de los datos del carrusel para TypeScript
interface VehiculoDestacado {
  id: number;
  imagen: string;
  titulo: string;
  descripcion: string;
}

const vehiculosDestacados: VehiculoDestacado[] = [
  {
    id: 1,
    imagen: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    titulo: "Porsche 911 Carrera",
    descripcion: "Deportividad y elegancia en un solo lugar."
  },
  {
    id: 2,
    imagen: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    titulo: "Ford Raptor 4x4",
    descripcion: "Poder y resistencia para cualquier terreno."
  },
  {
    id: 3,
    imagen: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
    titulo: "Audi A4 Sedan",
    descripcion: "Tecnología y confort para el día a día."
  }
];

function Carrusel() {
  const [indiceActual, setIndiceActual] = useState<number>(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      siguienteImagen();
    }, 5000);
    return () => clearInterval(intervalo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indiceActual]);

  const siguienteImagen = () => {
    setIndiceActual((prev) => (prev === vehiculosDestacados.length - 1 ? 0 : prev + 1));
  };

  const anteriorImagen = () => {
    setIndiceActual((prev) => (prev === 0 ? vehiculosDestacados.length - 1 : prev - 1));
  };

  return (
    <div className="carrusel-container">
      <button className="carrusel-btn btn-izq" onClick={anteriorImagen}>&#10094;</button>
      
      <div className="carrusel-slide">
        <img 
          src={vehiculosDestacados[indiceActual].imagen} 
          alt={vehiculosDestacados[indiceActual].titulo} 
          className="carrusel-img" 
        />
        <div className="carrusel-info">
          <h3>{vehiculosDestacados[indiceActual].titulo}</h3>
          <p>{vehiculosDestacados[indiceActual].descripcion}</p>
        </div>
      </div>

      <button className="carrusel-btn btn-der" onClick={siguienteImagen}>&#10095;</button>
    </div>
  );
}

export default Carrusel;