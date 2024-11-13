import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { supabase } from '../../utils/supabase-client';
import _ from 'lodash';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import placeholder from '../../assets/placeholder.svg';

export const PeopleFinder = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const { authState: { user } } = useContext(AuthContext);

    const debouncedSearch = useCallback(
        _.debounce(async (term) => {
            if (term) {
                const { data, error } = await supabase
                    .from('users')
                    .select('username, first_name, last_name, profile_picture')
                    .or(`first_name.ilike.%${term}%,last_name.ilike.%${term}%`);

                if (error) {
                    console.error('Error fetching users:', error);
                } else {
                    setSuggestedUsers(data);
                }
            } else {
                setSuggestedUsers([]);
            }
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
        return () => debouncedSearch.cancel();
    }, [searchTerm, debouncedSearch]);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSendMessage = async () => {
        try {
            const { data: existingChatrooms, error } = await supabase
                .from('chatroom')
                .select('id')
                .or(`username1.eq.${user.username},username2.eq.${user.username}`)
                .or(`username1.eq.${userData.username},username2.eq.${userData.username}`);

            if (error) {
                console.error("Error al verificar el chatroom:", error.message);
                return;
            }

            let chatroomID;
            if (existingChatrooms && existingChatrooms.length > 0) {
                chatroomID = existingChatrooms[0].id;
            } else {
                const { data: newChatroom, error: creationError } = await supabase
                    .from('chatroom')
                    .insert([{ username1: user.username, username2: userData.username }])
                    .select('id')
                    .single();

                if (creationError) {
                    console.error("Error al crear el chatroom:", creationError.message);
                    return;
                }
                chatroomID = newChatroom.id;
            }

            navigate(`/chat/${chatroomID}`);
        } catch (error) {
            console.error("Error al iniciar o redirigir al chat:", error.message);
        }
    };

    const handleUserClick = (currentUser) => {
        setUserData(currentUser);
        handleSendMessage();
    };

    return (
        <div>
            <div className="relative w-full max-w-2xl mx-auto mb-12">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-blue-400" />
                </div>
                <Input
                    type="search"
                    placeholder="Encuentra a otro usuario..."
                    className="w-full px-20 pl-10 pr-4 py-3 bg-gray-800 text-white placeholder-blue-300 border-2 border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-lg shadow-blue-500/20"
                    value={searchTerm}
                    onChange={handleChange}
                />
            </div>
            {suggestedUsers.length > 0 && (
                <Card className="relative w-full max-w-md mx-auto mt-8 w-full mt-3 bg-gray-800 rounded-lg shadow-2xl shadow-blue-500/30">
                    <CardContent className="p-2 max-h-64 overflow-y-auto">
                        <ul className="space-y-2">
                            {suggestedUsers.map((currentUser) => (
                                <li
                                    key={currentUser.username}
                                    className="flex items-center p-3 bg-gray-800 hover:bg-blue-900 rounded-lg cursor-pointer transition-all duration-300"
                                    onClick={ () => handleUserClick(currentUser)}
                                >
                                    <img
                                        src={currentUser.profile_picture || placeholder}
                                        alt={currentUser.username}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <span className="text-sm font-semibold text-blue-300">
                                                    {currentUser.first_name} {currentUser.last_name}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent side="top" className="bg-gray-900 border border-blue-500 text-blue-300">
                                                <p>Username: {currentUser.username}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter className="p-2 text-sm text-center text-gray-400">
                        Mostrando {suggestedUsers.length} resultado(s)
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default PeopleFinder;