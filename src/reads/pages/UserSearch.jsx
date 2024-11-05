import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase-client';
import _ from 'lodash';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import placeholder from '../../assets/placeholder.svg'; // Asegúrate de que la ruta sea correcta

export const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const navigate = useNavigate();

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
    <div className="relative w-full max-w-md mx-auto mt-8">
      <div className="flex items-center gap-2 p-3 bg-gray-800 rounded-full shadow-lg shadow-blue-500/20">
        <Search className="text-blue-400" />
        <Input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={handleChange}
          className="w-full bg-transparent text-white placeholder-blue-400 border-none focus:outline-none"
        />
      </div>

      {suggestedUsers.length > 0 && (
        <Card className="absolute w-full mt-3 bg-gray-800 rounded-lg shadow-2xl shadow-blue-500/30">
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
    </div>
  );
};