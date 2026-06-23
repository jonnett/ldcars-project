import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  
  // Si no es admin, lo devolvemos al login
  if (!auth?.esAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}