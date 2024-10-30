import React, { useState, useEffect } from 'react';
import { Star, Clock } from 'lucide-react';
import { Button, Card, CardContent, Badge, Avatar, AvatarFallback, AvatarImage } from "../../ui/components";
import { supabase } from '../../utils/supabase-client';
import { useParams } from 'react-router-dom';

const defaultProps = {
  reviews: [
    { id: 1, user: "Ana García", avatar: "/placeholder.svg", rating: 5, comment: "Una obra maestra de la fantasía moderna." },
    { id: 2, user: "Carlos Rodríguez", avatar: "/placeholder.svg", rating: 4, comment: "Una historia fascinante con un sistema de magia único." }
  ]
};

export default function BookProfile() {
  const { isbn } = useParams(); // Extrae el isbn de la URL
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { reviews } = defaultProps;

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
    fetchBookData();
  }, [isbn]);

  if (loading) return <div className="text-center">Loading...</div>;
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img src={cover_image_url} alt={`Portada de ${title}`} className="w-48 h-auto rounded-lg shadow-lg" />
        </div>
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-xl text-muted-foreground">por {author}</p>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">{genre}</Badge>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{new Date(published_date).getFullYear()}</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Sinopsis</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Reseñas de lectores</h2>
        <div className="space-y-6">
          {reviews.map((review) => (
            <Card key={review.id} className="border rounded-lg shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar>
                    <AvatarImage src={review.avatar} alt={review.user} />
                    <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{review.user}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
