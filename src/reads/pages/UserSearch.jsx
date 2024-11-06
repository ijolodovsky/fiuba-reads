import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { supabase } from '../../utils/supabase-client';
import _ from 'lodash';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";


import bookBlueImage from '../../assets/book_blue.svg';
import bookRedImage from '../../assets/book_red.svg';
import placeholder from '../../assets/placeholder.svg'; // Asegúrate de que la ruta sea correcta

export const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const navigate = useNavigate();
  const { authState: { user } } = useContext(AuthContext);

  const fetchFollowed = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('follows')
      .select('*')
      .eq('follower_id', user?.username)

    if (error) {
      console.error("Error fetching followed:", error)
    } else {
      //setFollowedUsers(data)
    }
  }

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex justify-center space-x-4">
            <img src={bookBlueImage} alt="Book Blue" width={80} height={80} className="animate-float" />
            <img src={bookRedImage} alt="Book Red" width={80} height={80} className="animate-float-delayed" />
          </div>
        </header>
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
                {suggestedUsers.map((user) => (
                  <li
                    key={user.username}
                    className="flex items-center p-3 bg-gray-800 hover:bg-blue-900 rounded-lg cursor-pointer transition-all duration-300"
                    onClick={() => navigate(`/users/${user.username}`)}
                  >
                    <img
                      src={user.profile_picture || placeholder}
                      alt={user.username}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-sm font-semibold text-blue-300">
                            {user.first_name} {user.last_name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-gray-900 border border-blue-500 text-blue-300">
                          <p>Username: {user.username}</p>
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
      </main>
    </div>
  );
};