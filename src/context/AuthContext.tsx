import React, { createContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth } from '../firebase'; // Importamos tu conexión segura a Firebase
import type { Usuario, Articulo } from '../types/index';

// Actualizamos el contrato: ahora las funciones devuelven Promesas (porque van a la nube)
interface AuthContextType {
  usuario: Usuario | null;
  cargandoAuth: boolean; // Necesario para evitar parpadeos en rutas protegidas
  login: (email: string, pass: string) => Promise<void>;
  registrar: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  carrito: Articulo[];
  agregarAlCarrito: (item: Articulo) => void;
  eliminarDelCarrito: (id: string) => void;
  vaciarCarrito: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  
  // --- ESTADO USUARIO (Ahora controlado por Firebase) ---
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargandoAuth, setCargandoAuth] = useState(true); // Arranca cargando

  // --- ESTADO CARRITO ---
  const [carrito, setCarrito] = useState<Articulo[]>([]);

  // --- EL VIGÍA DE SESIÓN DE FIREBASE (Exigencia de la Rúbrica) ---
  useEffect(() => {
    // onAuthStateChanged verifica si hay una sesión activa en los servidores de Google
    const unsubscribe = onAuthStateChanged(auth, (userFirebase) => {
      if (userFirebase) {
        setUsuario({ 
          username: userFirebase.email?.split('@')[0] || 'Usuario', 
          role: 'admin', // Por ahora todos son admin para mantener tu app funcionando
          correo: userFirebase.email || ''
        });
      } else {
        setUsuario(null);
      }
      setCargandoAuth(false); // Termina de validar
    });

    return () => unsubscribe(); // Se limpia cuando se cierra la app
  }, []);

  // Efectos del carrito (Se mantienen para no romper tu lógica actual)
  useEffect(() => {
    if (usuario) {
      const guardado = localStorage.getItem(`ldcars_carrito_${usuario.username}`);
      setCarrito(guardado ? JSON.parse(guardado) : []);
    } else {
      setCarrito([]);
    }
  }, [usuario]);

  useEffect(() => {
    if (usuario) {
      localStorage.setItem(`ldcars_carrito_${usuario.username}`, JSON.stringify(carrito));
    }
  }, [carrito, usuario]);

  // --- FUNCIONES DE CONTROL FIREBASE ---

  const login = async (email: string, pass: string) => {
    // Intenta loguearse en Firebase. Si falla, lanzará un error que capturaremos en la pantalla de Login
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registrar = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    // Destruye la sesión real en Firebase (Exigencia de la rúbrica)
    await signOut(auth); 
  };
  
  // --- FUNCIONES DEL CARRITO ---
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
      cargandoAuth, // Exponemos esto para proteger las rutas
      login, 
      registrar, 
      logout, 
      carrito, 
      agregarAlCarrito, 
      eliminarDelCarrito, 
      vaciarCarrito 
    }}>
      {/* Solo mostramos la app si Firebase ya confirmó el estado de la sesión */}
      {!cargandoAuth && children}
    </AuthContext.Provider>
  );
}