// src/context/AuthContext.tsx
import React, { createContext, useState } from 'react';
import type { Usuario } from '../types/index'; // <-- Agregamos 'type' para forzar la detección

interface AuthContextType {
  usuario: Usuario | null;
  login: (username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usamos React.ReactNode directamente para evitar el error de importación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const guardado = localStorage.getItem('usuarioLdCars');
    return guardado ? JSON.parse(guardado) : null;
  });

  const login = (username: string) => {
    const nuevoUsuario: Usuario = { username, isAdmin: true };
    setUsuario(nuevoUsuario);
    localStorage.setItem('usuarioLdCars', JSON.stringify(nuevoUsuario)); 
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuarioLdCars'); 
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}