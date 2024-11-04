import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { Star, Clock, Trash, Pencil, CircleDollarSign } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from '../../utils/supabase-client';
import { useParams } from 'react-router-dom';
import { BookOpen, User } from "lucide-react";
import { AuthContext } from '../../auth/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LoadingSpinner, NotFound } from '@/src/ui/components';

const defaultProps = {
  reviews: [
    { id: 1, username: "jtaras", avatar: "/placeholder.svg", rating: 5, comment: "Una obra maestra de la fantasía moderna." },
    { id: 2, username: "martoabra", avatar: "/placeholder.svg", rating: 4, comment: "Una historia fascinante con un sistema de magia único." }
  ]
};

export const BookProfile = () => {
  const { isbn } = useParams(); // Extrae el isbn de la URL
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { reviews } = defaultProps;
  const { authState: { user } } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchBookData = async () => {
    console.log('ISBN:', isbn);

    const { data, error } = await supabase
      .from('books')
      .select('title, author, published_date, description, genre, page_count, cover_image_url, rating')
      .eq('isbn', isbn);

    if (error) {
      console.error("Error fetching book data:", error);
      setError('Error fetching book data');
    } else if (data.length > 0) {
      setBookData(data[0]); // Toma el primer libro si hay varios resultados
    } else {
      setError('No book found');
    }

    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookData();
  }, [isbn]);

  const handleBuyBook = () => {
    Swal.fire({
      title: '¡Gracias por comprar el libro!',
      text: 'Esperamos que disfrutes de tu lectura.',
      icon: 'success',
      confirmButtonText: 'Cerrar',
      background: '#1f2937',
      color: '#fff',
      confirmButtonColor: '#4f46e5'
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <NotFound />;
  if (!bookData) return null;

  const {
    title,
    author,
    published_date,
    description,
    genre,
    page_count,
    cover_image_url,
    rating,
  } = bookData;

  const handleUpdateBook = () => {
    navigate(`/update-book/${isbn}`);
  };

  const handleDeleteBook = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#1f2937',
      color: '#fff',
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#6b7280',
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('isbn', isbn);

      if (error) {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el libro.',
          icon: 'error',
          confirmButtonText: 'Cerrar',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#4f46e5',
        });
        console.error("Error deleting book:", error);
      } else {
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El libro ha sido eliminado.',
          icon: 'success',
          confirmButtonText: 'Cerrar',
          background: '#1f2937',
          color: '#fff',
          confirmButtonColor: '#4f46e5',
        });
        navigate('/');
      }
    }
  };

  const fullName = `${user?.firstName} ${user?.lastName}`;
  const isAuthor = user?.role === 'escritor' && fullName === author;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <img src={cover_image_url} alt={`Portada de ${title}`} className="w-full h-auto rounded-lg shadow-lg border-2 border-blue-500" />
          </div>
          <div className="md:col-span-2 space-y-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">{title}</h1>
            <p className="text-xl text-blue-300">por {author}</p>
            <div className="flex items-center space-x-4 flex-wrap">
              <Badge variant="secondary" className="bg-blue-600 text-white">{genre}</Badge>
              <div className="flex items-center text-blue-300">
                <Clock className="w-4 h-4 mr-1" />
                <span>{new Date(published_date).getFullYear()}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400" />
                <span className="text-blue-300">{rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center text-blue-300">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{page_count} páginas</span>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-blue-500 shadow-lg">
              <h2 className="text-2xl font-semibold mb-2 text-blue-400 text-left">Sinopsis</h2>
              <p className="text-blue-200">{description}</p>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <button
                onClick={handleBuyBook}
                className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 flex items-center"
              >
                <CircleDollarSign className="w-4 h-4 mr-1" />
                Comprar libro
              </button>
              {isAuthor && (
                <>
                  <button
                    className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 flex items-center"
                    onClick={handleUpdateBook}
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Modificar Libro
                  </button>
                  <button
                  className="mt-6 px-4 py-2 text-white rounded-lg shadow-md bg-red-600 hover:bg-red-700 transition-colors duration-300 flex items-center"
                  onClick={handleDeleteBook}
                >
                  <Trash className="w-4 h-4 mr-1" />
                  Eliminar Libro
                </button>
              </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Reseñas de lectores</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="bg-gray-800 border border-blue-500 rounded-lg shadow-lg">
                <CardContent className="p-6 bg-gray-800 p-6 rounded-lg border border-blue-500 shadow-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="border-2 border-blue-500">
                      <AvatarImage src={review.avatar} alt={review.username} />
                      <AvatarFallback className="bg-blue-600 text-white"><User /></AvatarFallback>
                    </Avatar>
                    <div>
                    <Link 
                      to={`/users/${review.username}`}
                      className="text-white text-xl font-semibold mr-4 text-decoration-none"
                    ><p className="font-semibold text-blue-300">{review.username}</p> </Link>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-blue-200">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
