import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, User, Mail, Calendar, Star, UserPlus, UserCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabase-client';
import { LoadingSpinner, NotFound } from '@/src/ui/components';
import Swal from 'sweetalert2';

export const FriendProfilePage = () => {
  const { authState: { user } } = useContext(AuthContext);
  const navigate = useNavigate();
  const { userID } = useParams();
  const [userData, setUserData] = useState(null);
  const [booksData, setBooksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("username", userID);

    if (error) console.error("Error fetching reviews:", error);
    else setReviews(data);
  };

  const fetchBookData = async (firstName, lastName) => {
    const { data, error } = await supabase
      .from('books')
      .select('title, author, published_date, isbn')
      .eq('author', `${firstName} ${lastName}`);
  
    if (error) {
      setError('Error fetching book data');
    } else if (data.length > 0) {
      setBooksData(data);
    }
  
    setLoading(false);
  };


  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', userID);
  
    if (error) {
      console.error("Error fetching user data:", error);
      setError('Error fetching user data');
    } else if (data.length > 0) {
      const user = data[0];
      setUserData(user);
      await fetchBookData(user.first_name, user.last_name);
    } else {
      setError('No user found');
    }
  
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
  }, [userID]);
  
  useEffect(() => {
      fetchReviews();
  }, [userID]);

  useEffect(() => {
    if (userData) {
      if (userData.role === 'escritor') {
        fetchBookData();
    }
    }
  }, [userData]);


  useEffect(() => {
    const checkFollowingStatus = async () => {
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.username)
        .eq('followed_id', userID);
      
      if (error) {
        console.error("Error checking following status:", error);
      } else {
        setIsFollowing(data.length > 0);
      }
    };
  
    if (userData) {
      checkFollowingStatus();
    }
  }, [userData]);  

  const handleFollowToggle = async () => {
    if (isFollowing) {
      // Mostrar la alerta de confirmación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro que quieres dejar de seguir a este usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, dejar de seguir',
        cancelButtonText: 'Cancelar',
      });
  
      // Si el usuario confirma, procede con la acción de dejar de seguir
      if (result.isConfirmed) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.username)
          .eq('followed_id', userID);
  
        if (error) {
          console.error("Error unfollowing user:", error);
        } else {
          setIsFollowing(false);
        }
      }
    } else {
      // Seguir al usuario
      const { error } = await supabase
        .from('follows')
        .insert({
          follower_id: user.username,
          followed_id: userID,
        });
  
      if (error) {
        console.error("Error following user:", error);
      } else {
        setIsFollowing(true);
      }
    }
  };  
  

  if (loading) return <LoadingSpinner />;
  if (error) return <NotFound />;
  if (!userData) return null;

  const {
    username,
    role,
    age,
    first_name,
    last_name,
    email,
    profile_picture,
  } = userData;

  const fullName = `${first_name} ${last_name}`;
  const isAuthor = role === 'escritor';


  const handleViewBook = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
            <CardTitle className="text-3xl font-bold text-white">
              {username}
            </CardTitle>
            <CardDescription className="text-xl text-blue-200">
              {role}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="w-40 h-40 rounded-full border-4 border-blue-500 overflow-hidden mb-4">
                  <img
                    src={profile_picture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full md:w-2/3">
                <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Información Personal
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-3">
                    <Mail className="text-blue-400" />
                    <span>
                      <strong className="text-blue-300">Email:</strong>{" "}
                      <span className="text-gray-300">{email}</span>
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <User className="text-blue-400" />
                    <span>
                      <strong className="text-blue-300">Nombre:</strong>{" "}
                      <span className="text-gray-300">
                        {fullName}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Calendar className="text-blue-400" />
                    <span>
                      <strong className="text-blue-300">Edad:</strong>{" "}
                      <span className="text-gray-300">{age}</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 ml-4">
              <Button 
                className={`bg-blue-600 hover:bg-blue-700 text-white ${isFollowing ? 'bg-purple-500' : ''}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? <><UserCheck className="inline-block mr-2"/> Siguiendo</> : <><UserPlus className="inline-block mr-2" /> Seguir usuario</>}
              </Button>
            </div>
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Reseñas de Libros
              </h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-gray-700 border-blue-400">
                    <CardContent className="p-4">
                      <h4 className="text-lg font-semibold text-blue-300">
                        {review.book_id}
                      </h4>
                      <div className="flex items-center mt-2">
                        <Star className="text-yellow-400 mr-1" />
                        <span className="text-yellow-400">
                          {review.rating}/5
                        </span>
                      </div>
                      <p className="mt-2 text-gray-300">{review.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {isAuthor && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                  Libros Escritos
                </h3>
                <div className="space-y-4">
                  {booksData.map((book) => (
                    <Card key={book.isbn} className="bg-gray-700 border-blue-400">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-semibold text-blue-300">
                            {book.title}
                          </h4>
                          <p className="text-gray-400">
                            Publicado en {book.published_date}
                          </p>
                        </div>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleViewBook(book.isbn)}
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          Ver Libro
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
