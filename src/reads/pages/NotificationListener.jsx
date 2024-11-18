import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../../utils/supabase-client';
import { AuthContext } from '../../auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Book, User, Star, Settings, Trash2 } from 'lucide-react'

export const NotificationListener = () => {
  const { authState: { user } } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const subscription = supabase
      .channel('messages') // Nombre único del canal
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          console.log("payload:", payload)
          const newMessage = payload.new;
          // if (newMessage?.send_to === user?.username) {
            setNotifications((prev) => [...prev, newMessage]);
          // } else {
          //   console.warn("Mensaje ignorado por filtro:", newMessage);
          // }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const NotificationItem = ({ notification, onDelete }) => {
    return (
        <Card className="bg-gray-800 border border-blue-500 hover:border-blue-400 transition-colors duration-300">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full bg-gray-700 text-blue-400`}>
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100">Mensaje de {notification.send_by}</h3>
                <p className="text-sm text-gray-200">{notification.text}</p>
                <p className="text-xs text-gray-400">{notification.created_at}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(notification.id)}
              className="text-gray-400 hover:text-red-400 transition-colors duration-300"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Delete notification</span>
            </Button>
          </CardContent>
        </Card>

    )
  }
  
    const handleDeleteNotification = (id) => {
      setNotifications(notifications.filter(notification => notification.id !== id))
    }
  console.log(notifications)
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
                    onDelete={handleDeleteNotification}
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
