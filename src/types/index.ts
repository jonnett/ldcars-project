// src/types/index.ts

export interface Usuario {
  username: string;
  isAdmin: boolean;
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