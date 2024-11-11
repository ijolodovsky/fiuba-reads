import React from 'react';
import {
    Card,
    CardContent,
  } from '@/components/ui/card';

  import { Button } from '@/components/ui/button';
  import { BookOpen, BookPlus } from 'lucide-react';

  import { useNavigate } from 'react-router-dom';

export const UserBooks = ({booksData, handleAddBook}) => {
    const navigate = useNavigate();
    
    const handleViewBook = (bookId) => {
        navigate(`/books/${bookId}`);
    };

    return <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
        Libros Escritos
      </h3>
      <Button 
        className="mb-4 bg-blue-600 hover:bg-blue-700 text-white btn"
        onClick={handleAddBook}
      >
        <BookPlus className="mr-2 h-4 w-4" />
        Agregar Libro
      </Button>     
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
                className="bg-blue-600 hover:bg-blue-700 text-white btn"
                onClick={() => handleViewBook(book.isbn)}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Ver Libro
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>;
  }