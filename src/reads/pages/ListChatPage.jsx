import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabase-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuthContext } from '../../auth/context/AuthContext';
import _ from 'lodash';
import PeopleFinder from './PeopleFinder';

export const ListChatPage = () => {
    const [chatrooms, setChatrooms] = useState([]);
    const { authState: { user } } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatrooms = async () => {

            const { data, error } = await supabase
                .from('chatroom')
                .select('*')
                .or(`username1.eq.${user.username},username2.eq.${user.username}`);

            if (error) {
                console.error("Error al cargar los chats:", error.message);
            } else {
                setChatrooms(data);
            }
        };

        fetchChatrooms();
    }, [user]);

    const goToChatroom = (chatroomID) => {
        navigate(`/chat/${chatroomID}`);
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12'>
            <div className='container mx-auto px-4'>
                <PeopleFinder />
                <h2 className='text-2xl font-bold mb-6 text-center text-blue-300'>Tus Chats</h2>
                <div className='space-y-4'>
                    {chatrooms.map((chatroom) => (
                        <Card key={chatroom.uuid} className='bg-gray-800 text-white'>
                            <CardContent className='flex justify-between items-center mt-auto'>
                                <div>
                                    <h3 className='text-lg font-semibold'>{chatroom.username1 === user.username ? chatroom.username2 : chatroom.username1}</h3>
                                    <p className='text-sm text-gray-400'>
                                        {chatroom.username1 === user.username ? chatroom.username2 : chatroom.username1}
                                    </p>
                                </div>
                                <Button onClick={() => goToChatroom(chatroom.id)} className='bg-blue-500 hover:bg-blue-600 text-white'>
                                    Ir al chat
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};
