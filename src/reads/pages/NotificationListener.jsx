import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../../utils/supabase-client';
import { AuthContext } from '../../auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Book, User, Star, CheckCircle } from 'lucide-react'
import { useFollowCounts } from '../hooks/useFollowCounts';

export const NotificationListener = () => {
  const { authState: { user } } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const { followingUsers } = useFollowCounts(user.username);

  // Notificaciones de "seguidores"
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("send_to", user.username);

    if (error) {
      console.error(`Error fetching notification for ${user.username}:`, error);
    } else if (data) {
      setNotifications((prevNotifications) => {
        const existingIds = new Set(prevNotifications.map((n) => n.id)); // Crear un conjunto con los IDs existentes
        const newNotifications = data.filter((notification) => !existingIds.has(notification.id)); // Filtrar duplicados
        return [...prevNotifications, ...newNotifications]; // Agregar solo las nuevas
      });
    }
  };

  // Notificaciones de reseñas y libros
  const fetchReviewsNotifications = async () => {
    try {
      const notificationsPromises = followingUsers.map(async (followingUser) => {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("send_from", followingUser.username);

        if (error) {
          console.error(`Error fetching notification for ${followingUser.username}:`, error);
          return [];
        }
        return data || [];
      });

      // Resolver todas las promesas
      const notificationsArrays = await Promise.all(notificationsPromises);
      const allNotifications = notificationsArrays.flat();

      // Agregar solo notificaciones nuevas
      setNotifications((prevNotifications) => {
        const existingIds = new Set(prevNotifications.map((n) => n.id));
        const newNotifications = allNotifications.filter(
          (notification) => !existingIds.has(notification.id)
        );
        return [...prevNotifications, ...newNotifications];
      });
    } catch (error) {
      console.error("Error fetching review notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    fetchReviewsNotifications();
  }, [followingUsers]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        console.error("Error updating notification:", error);
      } else if (data) {
        // Actualizar el estado local para reflejar que la notificación ha sido leída
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Unexpected error marking notification as read:", error);
    }
  };

  // Función para formatear la fecha a "año-mes-día hh:mm".
  const formatDate = (date) => {
    const formattedDate = new Date(date);

    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Mes (0-indexed)
    const day = String(formattedDate.getDate()).padStart(2, '0'); // Día
    const hours = String(formattedDate.getHours()).padStart(2, '0'); // Horas
    const minutes = String(formattedDate.getMinutes()).padStart(2, '0'); // Minutos

    return `${year}-${month}-${day} ${hours}:${minutes}`; // yyyy-mm-dd hh:mm
  };

  //Ver si en la key se puede usar el NotificationType
  const notificationTypes = {
    NEW_BOOK: { icon: Book, color: 'text-green-400' },
    NEW_FOLLOWER: { icon: User, color: 'text-purple-400' },
    REVIEW: { icon: Star, color: 'text-yellow-400' },
  }

  const NotificationItem = ({ notification, onMarkAsRead }) => {
    const type = notification.type; // Tipo de notificación
    const { icon: Icon, color } = notificationTypes[type] || {}; // Obtén el ícono y color según el tipo
    return (
      <Card className={`bg-gray-800 border ${!notification.is_read ? 'border-blue-400' : 'border-gray-700'} hover:border-blue-500 transition-colors duration-300`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${!notification.is_read ? 'bg-blue-900' : 'bg-gray-700'} ${color}`}>
              {Icon ? <Icon className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
            </div>
            <div>
              <p className={`text-sm ${!notification.is_read ? 'text-white font-semibold' : 'text-gray-300'}`}>{notification.content}</p>
              <p className="text-xs text-gray-400">{formatDate(notification.created_at)}</p>
            </div>
          </div>
          {!notification.is_read && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMarkAsRead(notification.id)}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              <CheckCircle className="h-5 w-5" />
              <span className="sr-only">Marcar como leída</span>
            </Button>
          )}
        </CardContent>
      </Card>

    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
            <CardTitle className="text-3xl font-bold text-white flex items-center justify-center">
              <Bell className="mr-2" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))
            ) : (
              <p className="text-center text-gray-400">No tienes notificaciones nuevas</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
};
