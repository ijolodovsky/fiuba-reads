import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'

export const PlaylistPage = () => {
    const [readBooks, setReadBooks] = useState([]);
    const [readingBooks, setReadingBooks] = useState([]);
    const [wantToReadBooks, setWantToReadBooks] = useState([]);
    const [purchasedBooks, setPurchasedBooks] = useState([]);

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

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12'>
      <div className='container mx-auto px-4'>
    <Card className='bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden'>
    <CardContent className="p-6">
    <BookCarousel books={readBooks} title="Leídos" />
    <BookCarousel books={readingBooks} title="Leyendo" />
    <BookCarousel books={wantToReadBooks} title="Quiero Leer" />
    <BookCarousel books={purchasedBooks} title="Libros Comprados" />
  </CardContent>
  </Card>
  </div>
  </div>
  )
}
