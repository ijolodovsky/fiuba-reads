import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '../../utils/supabase-client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Scroll, SendHorizontal, ArrowLeft } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNavigate } from 'react-router-dom';

export const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const { authState: { user } } = useContext(AuthContext);
    const { chatroomID } = useParams();
    const [isLoading, setIsLoading] = useState(true);
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

    useEffect(() => {
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
    }, [messages]);

    
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

        setNewMessage('');
    };

    const handleEnter = (e) => {
        if(e.key === 'Enter') {
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
        <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12'>
            <Button
                onClick={handleGoBack}
                className='bg-red-500 hover:bg-red-800 text-white w-10 h-10 rounded-full flex items-center justify-center mr-auto ml-12'
            >
                <ArrowLeft />
            </Button>
            <div className='container mx-auto px-4'>
                <Card className='w-full max-w-2xl mx-auto bg-gray-800 text-white'>
                    <CardContent>
                        <h2 className='text-2xl font-bold mb-4 text-center text-white'>Chat</h2>
                        <ScrollArea className='chat-messages space-y-4 overflow-y-auto p-4' style={{ height: '400px' }}>
                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.sender === user.username ? 'justify-end' : 'justify-start'}`}>
                                    <div className='flex items-center space-x-3 space-y-6'>
                                        {message.sender !== user.username && (
                                            <Avatar>
                                                <AvatarImage src={users.find(user => user.username === message.sender)?.profile_picture || '/default-avatar.png'}/>
                                            </Avatar>
                                        )}
                                        <div className={`bg-${message.sender === user.username ? 'green-600' : 'blue-600'} rounded-lg px-4 py-2 shadow-md`}>
                                            <p className='text-sm'>{message.text}</p>
                                            <p className='text-xs text-gray-300'>{message.timestamp}</p>
                                        </div>
                                        {message.sender === user.username && (
                                            <Avatar>
                                                <AvatarImage src={users.find(user => user.username === message.sender)?.profile_picture || '/default-avatar.png'} alt='You' />
                                            </Avatar>
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

export default ChatPage;
