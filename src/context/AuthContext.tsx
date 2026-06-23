import React, { createContext, useState } from 'react';

// Cambiamos el contexto para manejar solo si es admin o no
interface AuthContextType {
  esAdmin: boolean;
  login: (user: string, pass: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Verificamos si ya estaba logueado como admin en el localStorage
  const [esAdmin, setEsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('ldcars_admin') === 'true';
  });

  const login = (user: string, pass: string) => {
    if (user === 'admin123' && pass === '1234') {
      setEsAdmin(true);
      localStorage.setItem('ldcars_admin', 'true');
    } else {
      alert("Credenciales incorrectas");
    }
  };

  const logout = () => {
    setEsAdmin(false);
    localStorage.removeItem('ldcars_admin');
  };

  return (
    <AuthContext.Provider value={{ esAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}