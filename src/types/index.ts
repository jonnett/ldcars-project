export interface Usuario {
  username: string;
  role: 'admin' | 'cliente';
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
}

// NUEVO: Para gestionar a los trabajadores
export interface Colaborador {
  id: string;
  nombre: string;
  cargo: string;
}

// NUEVO: Para las citas/reservas de autos
export interface Reserva {
  id: string;
  vehiculoId: string;
  vehiculoNombre: string;
  cliente: string;
  fecha: string;
}