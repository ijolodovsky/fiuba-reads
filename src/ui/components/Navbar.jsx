import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth';
import { Button } from '@/components/ui/button'; // example Shadcn button component
import { LogOutIcon, LogOut, MessageCircleMore } from 'lucide-react';
import { supabase } from '../../utils/supabase-client';


export const Navbar = () => {
  const { logout, authState } = useContext(AuthContext);
  const navigate = useNavigate();
  const [unRead, setUnRead] = useState([]);
  const [chatrooms, setChatrooms] = useState([]);
  const [allMessagesEmpty, setAllMessagesEmpty] = useState(true);

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
  }, [chatrooms]);

  useEffect(() => {
    setAllMessagesEmpty(unRead.every(item => item.messages.length === 0));
  }, [unRead]);

  const handleToReadIcon = () => {
    if(!allMessagesEmpty){
      return <MessageCircleMore className='ml-1 text-sm' style={{ color: '#b400f5' }} />;
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link 
          to="/" 
          className="text-white text-xl font-semibold mr-4 text-decoration-none"
        >
          FIUBA READS
        </Link>

        <div className="space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none ${isActive ? 'underline' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none ${isActive ? 'underline' : ''}`
            }
          >
            Amigos
          </NavLink>
          <NavLink
            to="/chatList"
            className={({ isActive }) =>
              `text-white hover:text-gray-300 text-decoration-none ${isActive ? 'underline' : ''}`
            }
          >
            Chats {handleToReadIcon()}
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
};