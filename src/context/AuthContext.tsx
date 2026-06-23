import React, { createContext, useState, useEffect } from 'react';
import type { Usuario, Articulo } from '../types/index';

interface AuthContextType {
  usuario: Usuario | null;
  login: (user: string, pass: string) => boolean;
  registrar: (datos: any) => boolean | string;
  logout: () => void;
  carrito: Articulo[];
  agregarAlCarrito: (item: Articulo) => void;
  eliminarDelCarrito: (id: string) => void;
  vaciarCarrito: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 1. Estado Usuario: Carga inicial desde localStorage
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const guardado = localStorage.getItem('ldcars_user_session');
    return guardado ? JSON.parse(guardado) : null;
  });

  // 2. Estado Carrito: Carga inicial obligatoria desde localStorage
  const [carrito, setCarrito] = useState<Articulo[]>(() => {
    const guardado = localStorage.getItem('ldcars_carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  // 3. Persistencia de Usuarios (Base de datos local)
  const [usuariosRegistrados, setUsuariosRegistrados] = useState<any[]>(() => {
    const guardados = localStorage.getItem('ldcars_users_db');
    return guardados ? JSON.parse(guardados) : [];
  });

  // EFEECTOS DE PERSISTENCIA
  useEffect(() => { 
    localStorage.setItem('ldcars_user_session', JSON.stringify(usuario)); 
  }, [usuario]);

  useEffect(() => { 
    localStorage.setItem('ldcars_carrito', JSON.stringify(carrito)); 
  }, [carrito]);

  useEffect(() => { 
    localStorage.setItem('ldcars_users_db', JSON.stringify(usuariosRegistrados)); 
  }, [usuariosRegistrados]);

  // FUNCIONES DE CONTROL
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
    
    setUsuariosRegistrados([...usuariosRegistrados, datos]);
    setUsuario({ username: datos.user, role: 'cliente', correo: datos.correo, nombreReal: datos.nombre, telefono: datos.telefono });
    return true;
  };

  // IMPORTANTE: El logout YA NO vacía el carrito automáticamente 
  // para que el cliente pueda guardar sus productos entre sesiones
  const logout = () => { 
    setUsuario(null); 
  };
  
  const agregarAlCarrito = (item: Articulo) => {
    setCarrito(prev => [...prev, item]);
  };

  const eliminarDelCarrito = (id: string) => {
    setCarrito(prev => prev.filter(c => c.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]); // Solo se llama a esto al confirmar la compra
  };

  return (
    <AuthContext.Provider value={{ usuario, login, registrar, logout, carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito }}>
      {children}
    </AuthContext.Provider>
  );
}