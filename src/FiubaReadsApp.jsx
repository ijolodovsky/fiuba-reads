import React from 'react';
import './App.css';
import { AuthProvider } from './auth';
import { AppRouter } from './router/AppRouter';
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toastify
import { ToastProvider } from "@/components/ui/toast";

export const App = () =>  {
  return (
    <AuthProvider>
      <ToastProvider>
      <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}
