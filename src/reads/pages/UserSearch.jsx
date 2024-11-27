import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { supabase } from '../../utils/supabase-client';
import _ from 'lodash';
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import bookBlueImage from '../../assets/book_blue.svg';
import bookRedImage from '../../assets/book_red.svg';
import placeholder from '../../assets/placeholder.svg';

export const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [reviews, setReviews] = useState([]); // Estado para las reseñas
  const [currentPage, setCurrentPage] = useState(1); // Página actual para la paginación
  const [totalPages, setTotalPages] = useState(1); // Total de páginas de reseñas
  const navigate = useNavigate();
  const { authState: { user } } = useContext(AuthContext);

  const isSameUser = (suggestedUser, user) => {
    return user.username === suggestedUser.username;
  };

  const fetchFollowed = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('follows')
      .select('followed_id')
      .eq('follower_id', user?.username);

    if (error) {
      console.error("Error fetching followed:", error);
    } else {
      fetchReviews(data.map(followedUser => followedUser.followed_id));
    }
  };

  const fetchReviews = async (followedUsers) => {
    if (!followedUsers || followedUsers.length === 0) return;

    const offset = (currentPage - 1) * 5; // Cálculo para la paginación

    const { data, error, count } = await supabase
      .from('reviews')
      .select('id, username, book_id, content, rating, created_at', { count: 'exact' }) // 'exact' para obtener el conteo total
      .in('username', followedUsers)
      .order('created_at', { ascending: false })
      .range(offset, offset + 4); // Cambiamos el rango a 5 (offset + 4)


    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      // Obtenemos los nombres de los libros en función de los book_ids
      const bookIds = data.map((review) => review.book_id);

      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('isbn, title')
        .in('isbn', bookIds);

      if (booksError) {
        console.error("Error fetching books:", booksError);
      } else {
        // Asociamos el nombre del libro con la reseña
        const reviewsWithBooks = data.map((review) => {
          const book = booksData.find((book) => book.isbn === review.book_id);
          return {
            ...review,
            bookTitle: book ? book.title : 'Desconocido', // Título del libro o 'Desconocido' si no se encuentra
          };
        });
        setReviews(reviewsWithBooks); // Guardar las reseñas con el título del libro
        setTotalPages(Math.ceil(count / 5)); // Calcular el número total de páginas
        console.log(totalPages)
      }
    }
  };

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


  // Efecto para obtener las reseñas cuando el usuario inicia sesión
  useEffect(() => {
    if (user) {
      fetchFollowed();
    }
  }, [user, currentPage]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Funciones para manejar la paginación
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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
                {suggestedUsers.map((currentUser) => (
                  <li
                    key={currentUser.username}
                    className="flex items-center p-3 bg-gray-800 hover:bg-blue-900 rounded-lg cursor-pointer transition-all duration-300"
                    onClick={() => navigate((isSameUser(currentUser, user)) ? `/profile` : `/users/${currentUser.username}`)}
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
        {reviews.length > 0 ? (
          <div className="w-full max-w-2xl mx-auto mt-8">
            <h2 className='text-3xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
              Reseñas de tus amigos
            </h2>
            {reviews.map((review) => (
              <Card key={review.id} className="bg-gray-800 rounded-lg shadow-2xl mb-4">
                <CardContent className="p-4">
                  <div className="mb-4">
                    {/* Enlazar el título del libro al detalle del libro */}
                    <span 
                      className="text-lg font-bold text-blue-300 cursor-pointer hover:underline"
                      onClick={() => navigate(`/books/${review.book_id}`)}
                    >
                      {review.bookTitle}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    {/* Enlazar el nombre del usuario al perfil del usuario */}
                    <span 
                      className="text-sm font-semibold text-blue-300 cursor-pointer hover:underline"
                      onClick={() => navigate(`/users/${review.username}`)}
                    >
                      {review.username}
                    </span>
                    <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                  <p className="text-sm text-gray-300 mt-2">{review.content}</p>
                </CardContent>
              </Card>
            ))}
            {(totalPages > 1) && (
              <CardFooter className="p-2 text-sm text-center text-gray-400">
                <div className="flex justify-center items-center space-x-2">
                  {/* Botón de flecha hacia atrás */}
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md border-2 ${currentPage === 1 ? 'border-gray-500 text-gray-400 cursor-not-allowed' : 'border-blue-500 text-blue-500'}`}
                  >
                    &#9664; Anterior
                  </button>
                  {/* Texto de página actual */}
                  <span className="text-blue-300">
                    Página {currentPage} de {totalPages}
                  </span>
                  {/* Botón de flecha hacia adelante */}
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md border-2 ${currentPage === totalPages ? 'border-gray-500 text-gray-400 cursor-not-allowed' : 'border-blue-500 text-blue-500'}`}
                  >
                    Siguiente &#9654;
                  </button>
                </div>
              </CardFooter>)}
          </div>
        ) : (
          <div className="w-full max-w-2xl mx-auto mt-8 text-center text-gray-400">No se encontraron reseñas para mostrar</div>
        )}
      </main>
    </div>
  );
};
