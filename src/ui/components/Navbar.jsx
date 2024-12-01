import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth';
import { Button } from '@/components/ui/button';
import { LogOutIcon, UsersRound, MessageCircleMore, Bell, House } from 'lucide-react';
import { supabase } from '../../utils/supabase-client'
import { useNotifications } from '@/src/reads/hooks/useNotifications';

export const Navbar = React.forwardRef((props, ref) => {
  const { logout, authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unRead, setUnRead] = useState([]);
  const [chatrooms, setChatrooms] = useState([]);
  const [allMessagesEmpty, setAllMessagesEmpty] = useState(true);
  const { unreadNotifications } = useNotifications(authState.user.username); 
  const [allNotificationsEmpty, setAllNotificationsEmpty] = useState(true);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchChatrooms = async () => {

      if (authState.user){
          const { data, error } = await supabase
          .from('chatroom')
          .select('*')
          .or(`username1.eq.${authState.user.username},username2.eq.${authState.user.username}`);

        if (error) {
          console.error("Error al cargar los chats:", error.message);
        } else {
          setChatrooms(data);
        }
      }
    };

    fetchChatrooms();
  }, [authState.user]);

  useEffect(() => {
    const fetchUnRead = async () => {

      if (authState.user) {
        const unreadMessages = [];
        for (let chatroom of chatrooms) {
          const { data, error } = await supabase
            .from('messages')
            .select('is_read, chatroomUUID')
            .eq('chatroomUUID', chatroom.id)
            .eq('is_read', false)
            .neq('send_by', authState.user.username);

          if (error) {
            console.error("Error al cargar mensajes no leídos:", error.message);
          } else {
            unreadMessages.push({ chatroomID: chatroom.id, messages: data });
          }
        }
        setUnRead(unreadMessages);
      }
    };

    if (authState.user) {
      fetchUnRead();
    }
  }, [unRead]);

  useEffect(() => {
    setAllMessagesEmpty(unRead.every(item => item.messages.length === 0));
  }, [unRead]);

  useEffect(() => {
    setAllNotificationsEmpty(unreadNotifications.every(item => item.length === 0));
  }, [unreadNotifications]);

  const handleToReadIcon = () => {
    if (!allMessagesEmpty) {
      return '#b400f5';
    }
  };

  const handleToReadNotifications = () => {
    if (!allNotificationsEmpty) {
      return '#b400f5';
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between" ref={ref}>
      <div className="flex items-center">
        <Link 
          to="/" 
          className="text-white text-xl font-semibold mr-4 text-decoration-none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        >
          FIUBA READS
        </Link>

        <div className="flex space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none flex items-center space-x-1 ${isActive ? 'underline' : ''}`
            }
          >
            <House className="text-white w-7 h-5" />
            Home
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none flex items-center space-x-1 ${isActive ? 'underline' : ''}`
            }
          >
            <UsersRound className="text-white w-7 h-5" />
            Amigos
          </NavLink>
          <NavLink
            to="/chatList"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none flex items-center space-x-1 ${isActive ? 'underline' : ''}`
            }
          >
            <MessageCircleMore className="text-white w-7 h-5" style={{ color: handleToReadIcon() }} />
            Chats
          </NavLink>
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none flex items-center space-x-1 ${isActive ? 'underline' : ''}`
            }
          >
            <Bell className="text-white w-7 h-5" style={{color: handleToReadNotifications() }}/>
            Notificaciones
          </NavLink>
          {/* TODO: Add other sections here */}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {authState.user && (
          <NavLink 
            to="/profile"
            className="text-info text-white hover:text-gray-300 text-decoration-none"
          >
            {authState.user?.username}
          </NavLink>
        )}
        
        <Button 
          onClick={onLogout} 
          className="text-white bg-red-600 hover:bg-red-700"
        >
          <LogOutIcon className="text-white" />
          Cerrar sesión
        </Button>
      </div>
    </nav>
  );
});