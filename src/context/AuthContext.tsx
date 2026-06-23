import React, { createContext, useState, useEffect } from 'react';
import type { Usuario, Articulo } from '../types/index';

interface AuthContextType {
  usuario: Usuario | null;
  login: (user: string, pass: string) => boolean;
  registrar: (datos: any) => boolean | string; // Retorna true o un mensaje de error
  logout: () => void;
  carrito: Articulo[];
  agregarAlCarrito: (item: Articulo) => void;
  eliminarDelCarrito: (id: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const guardado = localStorage.getItem('ldcars_user_session');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [usuariosRegistrados, setUsuariosRegistrados] = useState<any[]>(() => {
    const guardados = localStorage.getItem('ldcars_users_db');
    return guardados ? JSON.parse(guardados) : [];
  });

  const [carrito, setCarrito] = useState<Articulo[]>(() => {
    const guardado = localStorage.getItem('ldcars_carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => { localStorage.setItem('ldcars_user_session', JSON.stringify(usuario)); }, [usuario]);
  useEffect(() => { localStorage.setItem('ldcars_users_db', JSON.stringify(usuariosRegistrados)); }, [usuariosRegistrados]);
  useEffect(() => { localStorage.setItem('ldcars_carrito', JSON.stringify(carrito)); }, [carrito]);

  const login = (user: string, pass: string) => {
    if (user === 'admin123' && pass === '1234') {
      setUsuario({ username: 'Administrador', role: 'admin' });
      return true;
    }
    const existe = usuariosRegistrados.find(u => u.user === user && u.pass === pass);
    if (existe) {
      setUsuario({ username: user, role: 'cliente', correo: existe.correo, nombreReal: existe.nombre, telefono: existe.telefono });
      return true;
    }
    return false;
  };

  const registrar = (datos: any) => {
    if (datos.user === 'admin123') return "Nombre de usuario reservado.";
    if (usuariosRegistrados.find(u => u.user === datos.user)) return "El usuario ya existe.";
    if (usuariosRegistrados.find(u => u.correo === datos.correo)) return "El correo ya está registrado.";
    
    setUsuariosRegistrados([...usuariosRegistrados, datos]);
    setUsuario({ username: datos.user, role: 'cliente', correo: datos.correo, nombreReal: datos.nombre, telefono: datos.telefono });
    return true;
  };

  const logout = () => { setUsuario(null); setCarrito([]); };
  const agregarAlCarrito = (item: Articulo) => setCarrito([...carrito, item]);
  const eliminarDelCarrito = (id: string) => setCarrito(carrito.filter(c => c.id !== id));

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout, carrito, agregarAlCarrito, eliminarDelCarrito }}>
      {children}
    </AuthContext.Provider>
  );
}