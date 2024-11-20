import React, { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../../auth';
import { toast } from 'react-toastify';
import { useNotifications } from '@/src/reads/hooks/useNotifications';

export const NotificationListener = () => {
  const { authState: { user } } = useContext(AuthContext);
  const { unreadNotifications } = useNotifications(user.username);
  const [hasShownToast, setHasShownToast] = useState(false); // Controlar si ya se mostró el toast

  useEffect(() => {
    if (unreadNotifications.length > 0 && !hasShownToast) {
      // Mostrar toast si hay notificaciones no leídas y aún no se mostró
      toast.info("Tenes nuevas notificaciones!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "dark",
        progressStyle: { background: 'linear-gradient(to right, #9b4dca, #d72f8f)' },
      });
      setHasShownToast(true); // Marcar que ya se mostró el toast
    }

    if (unreadNotifications.length === 0 && hasShownToast) {
      // Resetear estado cuando no hay más notificaciones
      setHasShownToast(false);
    }
  }, [unreadNotifications, hasShownToast]);

  return null; // Este componente no necesita renderizar nada directamente
};
