import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '../../utils/supabase-client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizontal } from 'lucide-react';
import { useParams } from 'react-router-dom';


export const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const { authState: { user } } = useContext(AuthContext);
    const { chatroomID } = useParams();
    const [isLoading, setIsLoading] = useState(true);

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
    }, [chatroomID]);

    // useEffect(() => {
    //     const fectchUsers = async () => {
    //         const usernames = [...new Set(messages.map(message => message.sender))];
    //         const [username1, username2] = usernames;

    //         const { data, error } = await supabase
    //             .from('users')
    //             .select('username, profile_picture')
    //             .in('username', [username1, username2])

    //         if (error) {
    //             console.error("Error al obtener los usuarios:", error.message);
    //         } else {
    //             setUsers(data);
    //         }
    //         fectchUsers();
    //     };
    // }, [messages]);

    // useEffect(() => {
    //     if (messages.length > 0 && users.length > 0) {
    //         setIsLoading(false);
    //     }
    // }, [messages, users]);
    
    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;
        console.log(newMessage);
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    text: newMessage,
                    send_by: user.username,
                    chatroomUUID: chatroomID,
                },
            ]);

        setMessages([
            ...messages,
            {
                text: newMessage,
                sender: user.username,
                timestamp: new Date().toLocaleTimeString(),
            },
        ]);
        setNewMessage('');
    };

    const handleEnter = (e) => {
        if(e.key === 'Enter') {
            handleSendMessage();
        }
    }

    

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12'>
            <div className='container mx-auto px-4'>
                <Card className='w-full max-w-2xl mx-auto bg-gray-800 text-white'>
                    <CardContent>
                        <h2 className='text-2xl font-bold mb-4 text-center text-white'>Chat</h2>
                        <div className='chat-messages space-y-4'>
                            {messages.map((message, index) => (
                                <div key={index} className={`flex ${message.sender === user.username ? 'justify-end' : 'justify-start'}`}>
                                    <div className='flex items-center space-x-3'>
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
                        </div>
                    </CardContent>
                    <CardContent className='mt-4'>
                        <div className="flex items-center space-x-2">
                            <Textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleEnter}
                                placeholder='Escribe tu mensaje aquí...'
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
