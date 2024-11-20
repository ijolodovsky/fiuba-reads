import React, { useContext, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { UserBooks, UserReviews } from '../components';
import { supabase } from '../../utils/supabase-client';
import { LoadingSpinner, NotFound } from '@/src/ui/components';
import './profilePage.css';
import { UserInformation } from '../components/UserInformation';
import { useFollowCounts } from '../hooks/useFollowCounts';
import { Carousel } from '@/components/ui/carousel';
import { Link } from 'react-router-dom';


export const ProfilePage = () => {
  const {
    authState: { user },
  } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [booksData, setBooksData] = useState([]);
  const [error, setError] = useState(null);
  const [readBooks, setReadBooks] = useState([]);
  const [readingBooks, setReadingBooks] = useState([]);
  const [wantToReadBooks, setWantToReadBooks] = useState([]);


  const [reviews, setReviews] = useState([]);

  const { followingCount, followersCount, followersUsers, followingUsers } =
    useFollowCounts(user.username);
  const navigate = useNavigate();

  const handleAddBook = () => {
    navigate("/add-book");
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  const isAuthor = user.role === "escritor";

  const fetchBookData = async (firstName, lastName) => {
    const { data, error } = await supabase
      .from("books")
      .select("title, author, published_date, isbn")
      .eq("author", `${firstName} ${lastName}`);

    if (error) {
      setError("Error fetching book data");
    } else if (data.length > 0) {
      setBooksData(data);
    }

    setLoading(false);
  };

  const fetchBookTitle = async (bookId) => {
    const { data, error } = await supabase
      .from("books")
      .select("title")
      .eq("isbn", bookId)
      .single();

    if (error) {
      console.error(`Error fetching title for book ID ${bookId}:`, error);
      return "Título desconocido";
    }
    return data?.title || "Título desconocido";
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
          console.log(title);
          return { ...review, title };
        })
      );
      setReviews(titles);
    }
  };

  const fetchUserBooks = async () => {
    const { data, error } = await supabase
        .from("user_books")
        .select(`
      status,
      books:book_isbn (
        isbn,
        title,
        author,
        cover_image_url
      )
    `)
        .eq("username", user.username);

    if (error) {
      console.error("Error fetching user books:", error);
      return;
    }

    const read = [];
    const reading = [];
    const wantToRead = [];

    data.forEach((item) => {
      if (item.books) {
        switch (item.status) {
          case "Leído":
            read.push(item.books);
            break;
          case "Leyendo":
            reading.push(item.books);
            break;
          case "Quiero leer":
            wantToRead.push(item.books);
            break;
        }
      }
    });

    setReadBooks(read);
    setReadingBooks(reading);
    setWantToReadBooks(wantToRead);
  };

  useEffect(() => {
    if (user) {
      fetchUserBooks();
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

  const BookCarousel = ({ books, title }) => (
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          {title}
        </h3>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {books.map((book) => (
              <Link to={`/books/${book.isbn}`} key={book.isbn} className="flex-shrink-0">
                <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="w-32 h-48 object-cover rounded-lg shadow-lg hover:opacity-75 transition-opacity"
                />
              </Link>
          ))}
        </div>
      </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <NotFound />;

  const { username, role, age, firstName, lastName, email, profilePicture } =
    user;
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12'>
      <div className='container mx-auto px-4'>
        <Card className='bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden'>
          <CardHeader className='text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6'>
            <CardTitle className='text-3xl font-bold text-white'>
              {username}
            </CardTitle>
            <CardDescription className='text-xl text-blue-200'>
              {role}
            </CardDescription>
          </CardHeader>
          <CardContent className='p-6'>
            <UserInformation
              fullName={fullName}
              age={age}
              email={email}
              profile_picture={profilePicture}
              followingCount={followingCount}
              followersCount={followersCount}
              followersUsers={followersUsers}
              followingUsers={followingUsers}
            />
            <Button
              onClick={handleUpdateProfile}
              className='mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
            >
              Editar perfil
            </Button>
            <CardContent className="p-6">
              <BookCarousel books={readBooks} title="Libros Leídos" />
              <BookCarousel books={readingBooks} title="Libros Leyendo" />
              <BookCarousel books={wantToReadBooks} title="Libros Quiero Leer" />
            </CardContent>
            <div className='mt-8'>
              <h3 className='text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600'>
                Reseñas de Libros
              </h3>
              <UserReviews reviews={reviews} />
            </div>
            {isAuthor && (
              <UserBooks booksData={booksData} handleAddBook={handleAddBook} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
