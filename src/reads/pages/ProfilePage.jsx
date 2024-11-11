import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { UserBooks, FollowedUsersModal, UserReviews } from '../components';
import { supabase } from '../../utils/supabase-client';
import { LoadingSpinner, NotFound } from '@/src/ui/components';
import './profilePage.css';
import { UserInformation } from '../components/UserInformation';
import { useFollowCounts } from '../hooks/useFollowCounts';

export const ProfilePage = () => {
  const { authState: { user } } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [booksData, setBooksData] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const [reviews, setReviews] = useState([]);

  const { followingCount, followersCount, followedUsers } = useFollowCounts(user.username);
  const navigate = useNavigate();

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleAddBook = () => {
    navigate('/add-book');
  };

  const isAuthor = user.role === 'escritor';

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

  const fetchBookTitle = async (bookId) => {
    const { data, error } = await supabase
      .from('books')
      .select('title')
      .eq('isbn', bookId)
      .single();
  
    if (error) {
      console.error(`Error fetching title for book ID ${bookId}:`, error);
      return 'Título desconocido';
    }
    return data?.title || 'Título desconocido';
  };

  const fetchReviews = async () => {
    const { data: reviewsData, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("username", user.username);
  
    if (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } else {
      // Usa Promise.all para obtener los títulos de todos los `book_id`
      const titles = await Promise.all(
        reviewsData.map(async (review) => {
          const title = await fetchBookTitle(review.book_id);
          console.log(title)
          return { ...review, title };
        })
      );
      setReviews(titles);
    }
  };

  useEffect(() => {
    if (user) {
      if (isAuthor) {
        fetchBookData(user.firstName, user.lastName);
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchReviews();
}, [user]);

  if (loading) return <LoadingSpinner />;
  if (error) return <NotFound />;

  const { username, role, age, firstName, lastName, email, profilePicture } = user;
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
            <CardTitle className="text-3xl font-bold text-white">{username}</CardTitle>
            <CardDescription className="text-xl text-blue-200">{role}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <UserInformation fullName={fullName} age={age} email={email} profile_picture={profilePicture} handleToggleModal={handleToggleModal} followingCount={followingCount} followersCount={followersCount} />
            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Reseñas de Libros
              </h3>
              <UserReviews reviews={reviews} />
            </div>
            {isAuthor && <UserBooks booksData={booksData} handleAddBook={handleAddBook}/>}
          </CardContent>
        </Card>
      </div>
      <FollowedUsersModal isOpen={isModalOpen} onClose={handleToggleModal} users={followedUsers} />
    </div>
  );
};