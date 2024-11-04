import React, { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import { Star, Clock, Edit, Trash2} from 'lucide-react'; // Iconos adicionales de lucide-react
import { Card, CardContent, Badge, Avatar, AvatarFallback, AvatarImage, Button, Textarea } from "../../ui/components";
import { supabase } from '../../utils/supabase-client';
import { useParams } from 'react-router-dom';
import { BookOpen, User, BookPlus } from "lucide-react";
import { AuthContext } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookProfile() {
  const { isbn } = useParams(); // Extrae el isbn de la URL
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ content: '', rating: 0 });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const { authState: { user } } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchBookData = async () => {

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

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('book_id', isbn);

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
      Swal.fire('Debes iniciar sesión para agregar una reseña.');
      return;
    }
  
    const { data, error } = await supabase.from('reviews').insert({
      user_id: user.id,
      username: user.username,
      book_id: isbn,
      content: newReview.content,
      rating: newReview.rating,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  
    if (error) {
      console.error('Error al agregar la reseña:', error);
      return; // Salir si hay un error
    }
  
    // Asegúrate de que 'data' no sea null y agrega la nueva reseña al estado
    if (!data || data.length === 0) {
      console.error('No se recibió ningún dato de la base de datos');
      return; // Salir si no hay datos
    }
  
    // Aquí puedes acceder al primer elemento de data y agregarlo a reviews
    const newReviewData = data[0];
    setReviews([...reviews, newReviewData]); // Actualiza el estado de reviews
    setNewReview({ content: '', rating: 0 }); // Resetea el formulario
    Swal.fire('Reseña agregada correctamente');
  };
  

  const handleEditReview = async (review) => {
    setEditingReviewId(review.id);
    setNewReview({ content: review.content, rating: review.rating });
  };

  const handleUpdateReview = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .update({ content: newReview.content, rating: newReview.rating })
      .eq('id', editingReviewId);

    if (error) {
      Swal.fire('Error al actualizar la reseña');
      console.error("Error:", error);
    } else {
      setReviews(reviews.map(review => (review.id === editingReviewId ? data[0] : review)));
      setEditingReviewId(null);
      setNewReview({ content: '', rating: 0 });
      Swal.fire('Reseña actualizada correctamente');
    }
  };

  const handleDeleteReview = async (id) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id);

    if (error) {
      Swal.fire('Error al eliminar la reseña');
      console.error("Error:", error);
    } else {
      setReviews(reviews.filter(review => review.id !== id));
      Swal.fire('Reseña eliminada correctamente');
    }
  };

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

  if (loading) return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12 text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
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

  const handleModifyBook = () => {
    navigate(`/modify-book/${isbn}`);
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
                className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
              >
                Comprar libro
              </button>
              {isAuthor && (
                <button
                  className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300"
                  onClick={handleModifyBook}
                >
                  Modificar Libro
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Reseñas de lectores</h2>
          <div className="space-y-6">
          {reviews.map((review) => (
  <Card key={review.id} className="bg-gray-800 border border-blue-500 rounded-lg shadow-lg">
    <CardContent className="p-6 bg-gray-800 rounded-lg border border-blue-500 shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar>
          <AvatarImage src="/placeholder.svg" alt={review.username} />
          <AvatarFallback>{review.username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p>{review.username}</p>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
            ))}
          </div>
        </div>
      </div>
      <p>{review.content}</p>
      {review.user_id === user?.id && (
        <div className="flex space-x-2 mt-4">
          <Button onClick={() => handleEditReview(review)}>
            <Edit className="mr-1" /> Editar
          </Button>
          <Button onClick={() => handleDeleteReview(review.id)} variant="danger">
            <Trash2 className="mr-1" /> Eliminar
          </Button>
        </div>
      )}
    </CardContent>
  </Card>
))}

          </div>

          {user && (
            <div className="mt-8">
              <h3 className="text-xl mb-4">{editingReviewId ? 'Editar Reseña' : 'Agregar Reseña'}</h3>
              <Textarea
                placeholder="Escribe tu reseña aquí..."
                value={newReview.content}
                onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
              />
              <input
                type="number"
                max={5}
                min={0}
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="w-full bg-gray-800 mt-2 p-2 text-blue-200 rounded"
              />
              <Button
                onClick={editingReviewId ? handleUpdateReview : handleAddReview}
                className="mt-4"
              >
                {editingReviewId ? 'Actualizar Reseña' : 'Agregar Reseña'}
              </Button>
            </div>
          )}
          </div>
        </div>
      </div>
  );
}
