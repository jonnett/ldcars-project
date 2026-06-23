import React, { createContext, useState, useEffect } from 'react';
import type { Usuario, Articulo } from '../types/index';

interface AuthContextType {
  usuario: Usuario | null;
  usuariosRegistrados: any[];
  login: (user: string, pass: string) => boolean;
  registrar: (user: string, pass: string) => boolean;
  logout: () => void;
  // Para el carrito de compras de clientes
  carrito: Articulo[];
  agregarAlCarrito: (item: Articulo) => void;
  vaciarCarrito: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 1. Estado del Usuario Actual
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const guardado = localStorage.getItem('ldcars_user_session');
    return guardado ? JSON.parse(guardado) : null;
  });

  // 2. Base de datos simulada de clientes registrados
  const [usuariosRegistrados, setUsuariosRegistrados] = useState<any[]>(() => {
    const guardados = localStorage.getItem('ldcars_users_db');
    return guardados ? JSON.parse(guardados) : [];
  });

  // 3. Carrito de compras
  const [carrito, setCarrito] = useState<Articulo[]>(() => {
    const guardado = localStorage.getItem('ldcars_carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  // Guardar cambios en LocalStorage automáticamente
  useEffect(() => { localStorage.setItem('ldcars_user_session', JSON.stringify(usuario)); }, [usuario]);
  useEffect(() => { localStorage.setItem('ldcars_users_db', JSON.stringify(usuariosRegistrados)); }, [usuariosRegistrados]);
  useEffect(() => { localStorage.setItem('ldcars_carrito', JSON.stringify(carrito)); }, [carrito]);

  const login = (user: string, pass: string) => {
    // MAGIA: Login secreto para ADMIN
    if (user === 'admin123' && pass === '1234') {
      setUsuario({ username: 'Administrador', role: 'admin' });
      return true;
    }
    // Login para Clientes normales
    const existe = usuariosRegistrados.find(u => u.user === user && u.pass === pass);
    if (existe) {
      setUsuario({ username: user, role: 'cliente' });
      return true;
    }
    return false; // Credenciales incorrectas
  };

  const registrar = (user: string, pass: string) => {
    if (user === 'admin123') return false; // Prohibir registrarse con nombre de admin
    const existe = usuariosRegistrados.find(u => u.user === user);
    if (existe) return false; // Usuario ya existe
    
    setUsuariosRegistrados([...usuariosRegistrados, { user, pass }]);
    setUsuario({ username: user, role: 'cliente' }); // Autologin al registrar
    return true;
  };

  const logout = () => { setUsuario(null); setCarrito([]); };
  
  const agregarAlCarrito = (item: Articulo) => setCarrito([...carrito, item]);
  const vaciarCarrito = () => setCarrito([]);

  return (
    <AuthContext.Provider value={{ usuario, usuariosRegistrados, login, registrar, logout, carrito, agregarAlCarrito, vaciarCarrito }}>
      {children}
    </AuthContext.Provider>
  );
}