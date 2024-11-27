import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '../../utils/supabase-client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { SendHorizontal, ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from 'react-router-dom';

export const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [usernames, setUsernames] = useState([]);
    const { authState: { user } } = useContext(AuthContext);
    const { chatroomID } = useParams();
    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chatroomUUID', chatroomID)
                .order('created_at', { ascending: true });

            if (error) {
                console.error("Error al cargar los mensajes:", error.message);
            } else {
                setMessages(data.map(msg => ({
                    text: msg.text,
                    sender: msg.send_by,
                    timestamp: new Date(msg.created_at).toLocaleTimeString()
                })));
                await messageRead();
            }
        };
        fetchMessages();

        const channel = supabase
            .channel(`chatroom:${chatroomID}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chatroomUUID=eq.${chatroomID}`
                },
                (payload) => {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            text: payload.new.text,
                            sender: payload.new.send_by,
                            timestamp: new Date(payload.new.created_at).toLocaleTimeString(),
                        },
                    ]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, [chatroomID]);


    console.log(usernames)
    const messageRead = async (chatroomId) => {
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('chatroomUUID', chatroomID)
            .eq('is_read', false)
            .neq('send_by', user.username);

        if (error) {
            console.error("Error al marcar los mensajes como leídos:", error.message);
        }
    };

    useEffect(() => {
        const fetchUsernames = async () => {
            const { data, error } = await supabase
                .from('chatroom')
                .select('username1, username2')
                .eq('id', chatroomID)

            if (error) {
                console.error("Error al obtener los usuarios:", error.message);
            } else {
                const {username1, username2} = data[0];
                setUsernames([username1, username2]);
            }
        };
        fetchUsernames();
        const fetchUsers = async () => {
            const usernames = [...new Set(messages.map(message => message.sender))];
            const [username1, username2] = usernames;

            const { data, error } = await supabase
                .from('users')
                .select('username, profile_picture')
                .in('username', [username1, username2])

            if (error) {
                console.error("Error al obtener los usuarios:", error.message);
            } else {
                setUsers(data);
            }
        };
        if (messages.length > 0) {
            fetchUsers();
        }
    }, [messages,user]);


    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    text: newMessage,
                    send_by: user.username,
                    chatroomUUID: chatroomID,
                },
            ]);

        const lastSendTime = new Date().toISOString();

        if (lastSendTime) {
            const { error: chatroomError } = await supabase
                .from('chatroom')
                .update({ last_send: new Date().toISOString() })
                .eq('id', chatroomID);

            if (chatroomError) {
                console.error('Error al actualizar el chatroom:', chatroomError.message);
            }
        }

        setNewMessage('');
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    }

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleGoBack = () => {
        navigate("/chatList");
    }



    return (
        <div className='bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12 min-h-[100dvh]'>
            <Button
                onClick={handleGoBack}
                className='absolute bg-red-500 hover:bg-red-800 text-white w-10 h-10 rounded-full flex items-center justify-center mr-auto ml-12'
            >
                <ArrowLeft />
            </Button>
            <div className='container mx-auto px-4'>
                <Card className="bg-gray-800 border-2 border-blue-500 rounded-lg w-full max-w-2xl mx-auto text-white overflow-hidden">
                    <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
                        <CardTitle className="text-3xl font-bold text-white flex items-center justify-center" 
                        style={{ cursor: 'pointer' }} onClick={() => 
                        navigate(`/users/${usernames.find(username => username !== user.username) }`)}>
                            {usernames.find(username => username !== user.username)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className='chat-messages space-y-4 overflow-y-auto p-4' style={{ height: '400px' }}>
                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.sender === user.username ? 'justify-end' : 'justify-start'}`}>
                                    <div className='flex items-center space-x-3 space-y-6'>

                                        {message.sender !== user.username && (
                                            <div className="flex flex-col items-center space-y-1">
                                                <Avatar>
                                                    <AvatarImage src={users.find(user => user.username === message.sender)?.profile_picture || '/default-avatar.png'} />
                                                </Avatar>
                                                <p className="text-xs text-gray-400">{message.sender}</p>
                                            </div>
                                        )}
                                        <div className={`bg-${message.sender === user.username ? 'green-600' : 'blue-600'} rounded-lg px-4 py-2 shadow-md`}>
                                            <p className='text-sm'>{message.text}</p>
                                            <p className='text-xs text-gray-300'>{message.timestamp}</p>
                                        </div>
                                        {message.sender === user.username && (
                                            <div className="flex flex-col items-center space-y-1">
                                                <Avatar>
                                                    <AvatarImage src={users.find(user => user.username === message.sender)?.profile_picture || '/default-avatar.png'} alt='You' />
                                                </Avatar>
                                                <p className="text-xs text-gray-400">{message.sender}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </ScrollArea>
                    </CardContent>
                    <CardContent className='mt-4'>
                        <div className="flex items-center space-x-2">
                            <Textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleEnter}
                                placeholder='Mensaje'
                                className='flex-1 bg-gray-700 text-white'
                            />
                            <Button
                                onClick={handleSendMessage}
                                className='bg-blue-500 hover:bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center'
                            >
                                <SendHorizontal />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
