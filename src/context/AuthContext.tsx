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
  
  // --- ESTADO USUARIO ---
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const guardado = localStorage.getItem('ldcars_user_session');
    return guardado ? JSON.parse(guardado) : null;
  });

  // --- ESTADO CARRITO (Inicializado vacío) ---
  const [carrito, setCarrito] = useState<Articulo[]>([]);

  // --- ESTADO USUARIOS REGISTRADOS ---
  const [usuariosRegistrados, setUsuariosRegistrados] = useState<any[]>(() => {
    const guardados = localStorage.getItem('ldcars_users_db');
    return guardados ? JSON.parse(guardados) : [];
  });

  // --- EFECTOS DE PERSISTENCIA ---

  // Guardar usuario
  useEffect(() => { 
    localStorage.setItem('ldcars_user_session', JSON.stringify(usuario)); 
  }, [usuario]);

  // Cargar carrito específico cuando cambia el usuario
  useEffect(() => {
    if (usuario) {
      const key = `ldcars_carrito_${usuario.username}`;
      const guardado = localStorage.getItem(key);
      setCarrito(guardado ? JSON.parse(guardado) : []);
    } else {
      setCarrito([]); // Limpiar carrito si no hay usuario
    }
  }, [usuario]);

  // Guardar carrito específico cuando cambian los items
  useEffect(() => {
    if (usuario) {
      localStorage.setItem(`ldcars_carrito_${usuario.username}`, JSON.stringify(carrito));
    }
  }, [carrito, usuario]);

  // Guardar base de datos de usuarios
  useEffect(() => { 
    localStorage.setItem('ldcars_users_db', JSON.stringify(usuariosRegistrados)); 
  }, [usuariosRegistrados]);

  // --- FUNCIONES DE CONTROL ---

  const login = (user: string, pass: string) => {
    if (user === 'admin123' && pass === '1234') {
      setUsuario({ username: 'Administrador', role: 'admin' });
      return true;
    }
    const existe = usuariosRegistrados.find(u => u.user === user && u.pass === pass);
    if (existe) {
      setUsuario({ 
        username: user, 
        role: 'cliente', 
        correo: existe.correo, 
        nombreReal: existe.nombre, 
        telefono: existe.telefono 
      });
      return true;
    }
    return false;
  };

  const registrar = (datos: any) => {
    if (datos.user === 'admin123') return "Nombre de usuario reservado.";
    if (usuariosRegistrados.find(u => u.user === datos.user)) return "El usuario ya existe.";
    
    setUsuariosRegistrados([...usuariosRegistrados, datos]);
    setUsuario({ 
      username: datos.user, 
      role: 'cliente', 
      correo: datos.correo, 
      nombreReal: datos.nombre, 
      telefono: datos.telefono 
    });
    return true;
  };

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
    setCarrito([]);
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      registrar, 
      logout, 
      carrito, 
      agregarAlCarrito, 
      eliminarDelCarrito, 
      vaciarCarrito 
    }}>
      {children}
    </AuthContext.Provider>
  );
}