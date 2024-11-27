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
import {
  Edit
} from 'lucide-react';
import { UserBooks, UserReviews } from '../components';
import { supabase } from '../../utils/supabase-client';
import { LoadingSpinner, NotFound } from '@/src/ui/components';
import './profilePage.css';
import { UserInformation } from '../components/UserInformation';
import { useFollowCounts } from '../hooks/useFollowCounts';
import { Carousel } from '@/components/ui/carousel';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Toast } from '@/components/ui/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('reviews')


  const [reviews, setReviews] = useState([]);
  const [toast, setToast] = useState({ visible: false, message: '' });

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
          return { ...review, title };
        })
      );
      setReviews(titles);
    }
  };

  const fetchUserBooks = async () => {
    if (!user) return;

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

  const fetchPurchasedBooks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("bookPurchases")
        .select(`
          book_id,
          price,
          purchase_date,
          books:book_id (
            isbn,
            title,
            author,
            cover_image_url
          )
        `)
        .eq("username", user.username);

      if (error) throw error;

      const purchased = data.map(item => ({
        ...item.books,
        price: item.price,
        purchaseDate: item.purchase_date
      })).filter(book => book !== null);

      setPurchasedBooks(purchased);
    } catch (error) {
      console.error("Error buscando libros comprados:", error);
      setToast({ visible: true, message: 'Error al cargar libros comprados' });
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBooks();
      fetchPurchasedBooks();
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

  const Reviews = ({ reviews }) => (
    <>
      <h3 className='text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600'>
        Reseñas de Libros
      </h3>
      <UserReviews reviews={reviews} />
    </>
  );

  const ReadingLists = () => (
    <>
      <BookCarousel books={readBooks} title="Leídos" />
      <BookCarousel books={readingBooks} title="Leyendo" />
      <BookCarousel books={wantToReadBooks} title="Quiero Leer" />
      <BookCarousel books={purchasedBooks} title="Libros Comprados" />
    </>
  );

  const BookCarousel = ({ books, title }) => {
    const [startIndex, setStartIndex] = useState(0);
    const booksPerPage = 10;

    const nextBooks = () => {
      if (startIndex + booksPerPage < books.length) {
        setStartIndex(startIndex + 1);
      }
    };

    const prevBooks = () => {
      if (startIndex > 0) {
        setStartIndex(startIndex - 1);
      }
    };

    return (
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          {title}
        </h3>
        <div className="relative">
          {books.length > 0 ? (
            <div className="flex items-center">
              <Button onClick={prevBooks} disabled={startIndex === 0} className="mr-2">
                <ChevronLeft />
              </Button>
              <div className="flex overflow-hidden">
                {books.slice(startIndex, startIndex + booksPerPage).map((book) => (
                  <Link to={`/books/${book.isbn}`} key={book.isbn} className="flex-shrink-0 mx-2">
                    <img
                      src={book.cover_image_url}
                      alt={book.title}
                      className="w-32 h-48 object-cover rounded-lg shadow-lg hover:opacity-75 transition-opacity"
                    />
                  </Link>
                ))}
              </div>
              <Button onClick={nextBooks} disabled={startIndex + booksPerPage >= books.length} className="ml-2">
                <ChevronRight />
              </Button>
            </div>) : (<p className="text-sm text-blue-200">No tienes libros en {title}</p>)}
        </div>
      </div>
    );
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <NotFound />;

  const { username, role, age, firstName, lastName, email, profilePicture } = user;
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
            <Button
              onClick={handleUpdateProfile}
              className="text-white rounded-full p-2 absolute btn"
              size="icon"
              variant="ghost"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar perfil</span>
            </Button>
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
            <div className='mt-8'>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className={`grid w-full ${isAuthor ? 'grid-cols-3' : 'grid-cols-2'} bg-gradient-to-r from-blue-700 to-purple-700 rounded-lg p-1`}            >
                  <TabsTrigger value="reviews" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md transition-all duration-300">Reseñas de libros</TabsTrigger>
                  <TabsTrigger value="lists" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md transition-all duration-300">Listas de Lectura</TabsTrigger>
                  {isAuthor && (
                    <TabsTrigger
                      value="writtenBooks"
                      className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-md transition-all duration-300"
                    >
                      Libros Escritos
                    </TabsTrigger>
                  )}
                </TabsList>
                <TabsContent value="reviews">
                  <Reviews reviews={reviews} />
                </TabsContent>
                <TabsContent value="lists">
                  <ReadingLists />
                </TabsContent>
                {isAuthor && (
                  <TabsContent value="writtenBooks">
                    <UserBooks
                      booksData={booksData}
                      handleAddBook={handleAddBook}
                      isCurrentUser={true}
                    />
                  </TabsContent>
                )}
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
      {toast.visible && (
        <Toast message={toast.message} onClose={() => setToast({ visible: false, message: '' })} />
      )}
    </div>
  );
}