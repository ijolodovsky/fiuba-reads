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

  const fetchAllNotifications = async () => {
    const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .or(
      `send_from.in.(${followingUsers.map((followingUser) => followingUser.username).join(",")}),send_to.eq.${user.username}`
    );

    setNotifications(data);

  if (error) {
    console.error("Error fetching notifications:", error);
  } else {
    console.log("Notifications:", data);
  }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, [followingUsers]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);
  
      if (error) {
        console.error("Error updating notification:", error);
      } else {
        // Actualiza las notificaciones localmente sin mutar directamente el estado
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
