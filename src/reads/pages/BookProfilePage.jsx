import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import {
  Star,
  Clock,
  Edit,
  Trash2,
  BookOpen,
  User,
  CircleDollarSign,
} from 'lucide-react';
import { supabase } from '../../utils/supabase-client';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthContext } from '../../auth/context/AuthContext';
import { LoadingSpinner, NotFound } from '@/src/ui/components';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export const BookProfile = () => {
  const { isbn } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ content: "", rating: 0 });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const {
    authState: { user },
  } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchBookData = async () => {
    try {
      const { data, error } = await supabase
        .from("books")
        .select("title, author, published_date, description, genre, page_count, cover_image_url, rating")
        .eq("isbn", isbn);
  
      if (error) {
        throw new Error(error.message);
      }
  
      if (data.length > 0) {
        setBookData(data[0]);
      } else {
        setError("No book found");
      }
    } catch (error) {
      console.error("Error fetching book data:", error);
      setError("Error fetching book data");
    } finally {
      setLoading(false);
    }
  };
  

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("book_id", isbn);

    if (error) console.error("Error fetching reviews:", error);
    else setReviews(data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBookData();
    fetchReviews();
  }, [isbn]);
  const handleAddReview = async () => {
    if (!user) {
      Swal.fire("Debes iniciar sesión para agregar una reseña.");
      return;
    }
  
    try {
      const { data, error } = await supabase.from("reviews").insert({
        user_id: user.id,
        username: user.username || "Anónimo",
        book_id: isbn,
        content: newReview.content,
        rating: newReview.rating,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
  
      if (error) {
        console.error("Error al agregar la reseña:", error);
        Swal.fire("Error al agregar la reseña");
        return;
      }
  
      if (data) {
        setReviews((prevReviews) => [...prevReviews, data[0]]); // Actualizamos el estado con la nueva reseña
        setNewReview({ content: "", rating: 0 });
        Swal.fire("Reseña agregada correctamente");
        await updateBookRating();
      }
    } catch (error) {
      console.error("Error en handleAddReview:", error);
      Swal.fire("Ocurrió un error al agregar la reseña. Inténtalo de nuevo.");
    }
  };
  
  
  
  const updateBookRating = async () => {
    // Obtener todas las reseñas del libro
    const { data: reviewsData, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("book_id", isbn);
  
    if (error) {
      console.error("Error al obtener las reseñas:", error);
      return;
    }
  
    // Calcular el promedio de las calificaciones
    const totalRating = reviewsData.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviewsData.length;
  
    // Actualizar el promedio en la tabla de libros
    const { error: updateError } = await supabase
      .from("books")
      .update({ rating: averageRating })
      .eq("isbn", isbn);
  
    if (updateError) {
      console.error("Error al actualizar el promedio de calificación del libro:", updateError);
    } else {
      console.log("Promedio de calificación actualizado correctamente.");
    }
  };
  

  const handleEditReview = async (review) => {
    setEditingReviewId(review.id);
    setNewReview({ content: review.content, rating: review.rating });
  };

  const handleUpdateReview = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .update({ content: newReview.content, rating: newReview.rating })
      .eq("id", editingReviewId)
      .select(); // Asegúrate de seleccionar los datos actualizados
  
    if (error) {
      Swal.fire("Error al actualizar la reseña");
      console.error("Error:", error);
    } else if (data && data.length > 0) {
      // Si la reseña se actualizó correctamente, actualizamos la lista de reseñas
      setReviews(
        reviews.map((review) =>
          review.id === editingReviewId ? data[0] : review
        )
      );
      setEditingReviewId(null);
      setNewReview({ content: "", rating: 0 });
      Swal.fire("Reseña actualizada correctamente");
  
      // Recalcular el promedio de las reseñas después de la actualización
      await updateBookRating();
    } else {
      console.error("No se recibió ningún dato de la base de datos");
    }
  };
  

  const handleDeleteReview = async (id) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      Swal.fire("Error al eliminar la reseña");
      console.error("Error:", error);
    } else {
      setReviews(reviews.filter((review) => review.id !== id));
      Swal.fire("Reseña eliminada correctamente");
    }
  };

  const handleBuyBook = () => {
    Swal.fire({
      title: "¡Gracias por comprar el libro!",
      text: "Esperamos que disfrutes de tu lectura.",
      icon: "success",
      confirmButtonText: "Cerrar",
      background: "#1f2937",
      color: "#fff",
      confirmButtonColor: "#4f46e5",
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
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#1f2937",
      color: "#fff",
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6b7280",
    });

    if (result.isConfirmed) {
      const { error } = await supabase.from("books").delete().eq("isbn", isbn);

      if (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el libro.",
          icon: "error",
          confirmButtonText: "Cerrar",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#4f46e5",
        });
        console.error("Error deleting book:", error);
      } else {
        Swal.fire({
          title: "¡Eliminado!",
          text: "El libro ha sido eliminado.",
          icon: "success",
          confirmButtonText: "Cerrar",
          background: "#1f2937",
          color: "#fff",
          confirmButtonColor: "#4f46e5",
        });
        navigate("/");
      }
    }
  };

  const fullName = `${user?.firstName} ${user?.lastName}`;
  const isAuthor = user?.role === "escritor" && fullName === author;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='md:col-span-1'>
            <img
              src={cover_image_url}
              alt={`Portada de ${title}`}
              className='w-full h-auto rounded-lg shadow-lg border-2 border-blue-500'
            />
          </div>
          <div className='md:col-span-2 space-y-6'>
            <h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600'>
              {title}
            </h1>
            <p className='text-xl text-blue-300'>por {author}</p>
            <div className='flex items-center space-x-4 flex-wrap'>
              <Badge variant='secondary' className='bg-blue-600 text-white'>
                {genre}
              </Badge>
              <div className='flex items-center text-blue-300'>
                <Clock className='w-4 h-4 mr-1' />
                <span>{new Date(published_date).getFullYear()}</span>
              </div>
              <div className='flex items-center'>
                <Star className='w-4 h-4 mr-1 text-yellow-400' />
                <span className='text-blue-300'>{rating.toFixed(1)}</span>
              </div>
              <div className='flex items-center text-blue-300'>
                <BookOpen className='w-4 h-4 mr-1' />
                <span>{page_count} páginas</span>
              </div>
            </div>
            <div className='bg-gray-800 p-6 rounded-lg border border-blue-500 shadow-lg'>
              <h2 className='text-2xl font-semibold mb-2 text-blue-400 text-left'>
                Sinopsis
              </h2>
              <p className='text-blue-200'>{description}</p>
            </div>
            <div className='mt-6 flex items-center space-x-4'>
              <button
                onClick={handleBuyBook}
                className='mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 flex items-center'
              >
                <CircleDollarSign className='w-4 h-4 mr-1' />
                Comprar libro
              </button>
              {isAuthor && (
                <>
                  <button
                    className='mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300 flex items-center'
                    onClick={handleUpdateBook}
                  >
                    <Edit className='w-4 h-4 mr-1' />
                    Modificar Libro
                  </button>
                  <button
                    className='mt-6 px-4 py-2 text-white rounded-lg shadow-md bg-red-600 hover:bg-red-700 transition-colors duration-300 flex items-center'
                    onClick={handleDeleteBook}
                  >
                    <Trash2 className='w-4 h-4 mr-1' />
                    Eliminar Libro
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className='mt-12'>
          <h2 className='text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
            Reseñas de lectores
          </h2>
          <div className='space-y-6'>
            {reviews.map((review) => (
              <Card
                key={review.id}
                className='bg-gray-800 border border-blue-500 rounded-lg shadow-lg'
              >
                <CardContent className='p-6 bg-gray-800 p-6 rounded-lg border border-blue-500 shadow-lg'>
                  <div className='flex items-center space-x-4 mb-4'>
                    <Avatar className='border-2 border-blue-500'>
                      <AvatarImage src={review.avatar} alt={review.username} />
                      <AvatarFallback className='bg-blue-600 text-white'>
                        <User />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        to={`/users/${review.username}`}
                        className='text-white text-xl font-semibold mr-4 text-decoration-none'
                      >
                        <p className='font-semibold text-blue-300'>
                          {review.username}
                        </p>{" "}
                      </Link>
                      <div className='flex items-center'>
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-500"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-between items-start'>
                    <p className='text-blue-300 text-left flex-1 mr-4'>
                      {review.content}
                    </p>
                    {/* Mostrar botones solo si el usuario es el autor de la reseña */}
                    {user.username === review.username && (
                      <div className='flex space-x-2'>
                        <Button
                          variant='ghost'
                          onClick={() => handleEditReview(review)}
                        >
                          <Edit className='text-blue-500 hover:text-blue-700' />
                        </Button>
                        <Button
                          variant='ghost'
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className='text-red-500 hover:text-red-700' />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {user && (
            <div className='mt-8'>
              <h3 className='text-xl mb-4'>
                {editingReviewId ? "Editar Reseña" : "Agregar Reseña"}
              </h3>
              <Textarea
                placeholder='Escribe tu reseña aquí...'
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
                className='bg-gray-700 border-blue-500 text-white placeholder-blue-300'
              />
              <input
                type='number'
                max={5}
                min={0}
                value={newReview.rating}
                onChange={(e) =>
                  setNewReview({ ...newReview, rating: Number(e.target.value) })
                }
                className='w-full bg-gray-800 mt-2 p-2 text-blue-200 rounded'
              />
              <Button
                onClick={editingReviewId ? handleUpdateReview : handleAddReview}
                className='mt-4'
              >
                {editingReviewId ? "Actualizar Reseña" : "Agregar Reseña"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};