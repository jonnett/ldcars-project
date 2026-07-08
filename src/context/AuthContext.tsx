import React, { createContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { auth, db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import type { Usuario, Articulo } from '../types/index';

interface AuthContextType {
  usuario: Usuario | null;
  cargandoAuth: boolean; 
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
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);
  const [carrito, setCarrito] = useState<Articulo[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'usuarios', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUsuario({
              username: data.correo || firebaseUser.email || '',
              role: firebaseUser.email === 'admin@ldcars.com' ? 'admin' : (data.role || 'cliente'),
              correo: data.correo || firebaseUser.email || '',
              nombreReal: data.nombreReal || '',
              telefono: data.telefono || ''
            });
          } else {
            // Fallback si el usuario fue registrado en la consola de Auth manualmente
            setUsuario({
              username: firebaseUser.email || '',
              role: firebaseUser.email === 'admin@ldcars.com' ? 'admin' : 'cliente',
              correo: firebaseUser.email || '',
              nombreReal: firebaseUser.email === 'admin@ldcars.com' ? 'Administrador General' : 'Usuario Nuevo',
              telefono: ''
            });
          }
        } catch (error) {
          console.error("Error al recuperar los detalles del usuario:", error);
          // Permitir ingreso parcial si es el administrador maestro
          if (firebaseUser.email === 'admin@ldcars.com') {
            setUsuario({
              username: firebaseUser.email,
              role: 'admin',
              correo: firebaseUser.email,
              nombreReal: 'Administrador Maestro'
            });
          }
        }
      } else {
        setUsuario(null);
      }
      setCargandoAuth(false);
    });

    return () => unsubscribe();
  }, []);

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

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registrar = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth); 
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
      cargandoAuth,
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