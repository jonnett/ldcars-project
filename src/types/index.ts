export interface Usuario {
  username: string;
  role: 'admin' | 'cliente';
  correo?: string;
  nombreReal?: string;
  telefono?: string;
}

export interface Vehiculo {
  id: string;
  anio: number;
  patente: string;
  color: string;
  estado: 'nuevo' | 'semi' | 'usado';
  modelo: string;
  marca: string;
  precio: number;
  imagen?: string;
}

export interface Articulo {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  categoria: string;
  procedencia: string;
  estado: string;
  imagen?: string; // Soportará fotos
}

export interface Colaborador {
  id: string;
  nombre: string;
  cargo: string;
}

export interface Reserva {
  id: string;
  vehiculoId: string;
  vehiculoNombre: string;
  clienteUser: string;
  nombreReal: string;
  correo: string;
  telefono: string;
  fecha: string;
}