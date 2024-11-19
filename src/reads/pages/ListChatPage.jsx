import React, { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase-client';
import { Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthContext } from '../../auth/context/AuthContext';
import _ from 'lodash';
import PeopleFinder from './PeopleFinder';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { MessageCircleMore } from 'lucide-react';

export const ListChatPage = () => {
    const [chatrooms, setChatrooms] = useState([]);
    const [users, setUsers] = useState([]);
    const { authState: { user } } = useContext(AuthContext);
    const [unRead, setUnRead] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatrooms = async () => {

            const { data, error } = await supabase
                .from('chatroom')
                .select('*')
                .or(`username1.eq.${user.username},username2.eq.${user.username}`)
                .order('last_send', { ascending: false });

            if (error) {
                console.error("Error al cargar los chats:", error.message);
            } else {
                setChatrooms(data);
            }
        };

        fetchChatrooms();

        const channel = supabase
            .channel(`chatroom-updates}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chatroom',
                },
                (payload) => {
                    const newMessageChatroomID = payload.new.chatroomUUID;
                    setChatrooms((prevChatrooms) => {
                        const updatedChatrooms = prevChatrooms.map((chatroom) => {
                            if (chatroom.id === newMessageChatroomID) {
                                return { ...chatroom, last_send: payload.new.created_at };
                            }
                            return chatroom;
                        });

                        return _.orderBy(updatedChatrooms, ['last_send'], ['desc']);
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, [chatrooms]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usernames = [...new Set(chatrooms.flatMap(chatroom => [chatroom.username1, chatroom.username2]))];
            const { data, error } = await supabase
                .from('users')
                .select('username, profile_picture')
                .in('username', usernames);

            if (error) {
                console.error("Error al cargar los usuarios:", error.message);
            } else {
                setUsers(data);
            }
        };

        if (chatrooms.length > 0) {
            fetchUsers();
        }
    }, [chatrooms]);

    useEffect(() => {
        const fetchUnRead = async () => {
            const unreadMessages = [];
            
            for (let chatroom of chatrooms) {
                const { data, error } = await supabase
                    .from('messages')
                    .select('is_read, chatroomUUID')
                    .eq('chatroomUUID', chatroom.id)
                    .eq('is_read', false)
                    .neq('send_by', user.username);

                if (error) {
                    console.error("Error al cargar mensajes no leídos:", error.message);
                } else {
                    unreadMessages.push({ chatroomID: chatroom.id, messages: data });
                }
            }

            setUnRead(unreadMessages);
        };

        if (chatrooms.length > 0) {
            fetchUnRead();
        }
    }, [chatrooms, user]);

    const goToChatroom = (chatroomID) => {
        navigate(`/chat/${chatroomID}`);
    };

    const getUserAvatar = (username) => {
        const user = users.find(u => u.username === username);
        return user?.profile_picture || '/default-avatar.png';
    };

    const handleToReadIcon = (chatroomID) => {
        const unreadChatroom = unRead.find(item => item.chatroomID === chatroomID);

        if (unreadChatroom && unreadChatroom.messages && unreadChatroom.messages.length > 0) {
            return <MessageCircleMore className='ml-4' style={{ color: '#b400f5' }} />;
        }
        return null;
        };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12'>
            <div className='container mx-auto px-4'>
                <PeopleFinder />
                <Card className="bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden">
                    <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
                        <CardTitle className="text-3xl font-bold text-white flex items-center justify-center">
                            Chats
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className='space-y-4'>
                            {chatrooms.map((chatroom) => (
                                <Card key={chatroom.uuid} className='bg-gray-800 text-white'>
                                    <CardContent className='flex justify-between items-center mt-auto mt-4'>
                                        <div className='flex items-center'>
                                            <Avatar>
                                                <AvatarImage src={getUserAvatar(chatroom.username1 === user.username ? chatroom.username2 : chatroom.username1)} />
                                            </Avatar>
                                            <h3 className='text-lg font-semibold ml-4'>{chatroom.username1 === user.username ? chatroom.username2 : chatroom.username1}</h3>
                                            {handleToReadIcon(chatroom.id)}
                                        </div>
                                        <Button onClick={() => goToChatroom(chatroom.id)} className='bg-blue-500 hover:bg-blue-600 text-white'>
                                            Ir al chat
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ListChatPage;
