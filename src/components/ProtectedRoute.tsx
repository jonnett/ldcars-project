import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  
  if (auth?.cargandoAuth) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando permisos de administrador...</div>;
  }

  if (auth?.usuario?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}