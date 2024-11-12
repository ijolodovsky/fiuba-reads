import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '../../utils/supabase-client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SendIcon from '@mui/icons-material/Send';


export const ChatPage = () => {
    const [chats, setChats] = useState([]);
    const { authState: { user } } = useContext(AuthContext);

    return (<> </>)
};

export default ChatPage;
