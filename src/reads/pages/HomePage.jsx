import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase-client';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import bookBlueImage from '../../assets/book_blue.svg';
import bookRedImage from '../../assets/book_red.svg';
import placeholder from '../../assets/placeholder.svg';

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const fetchBooks = async () => {
    const { data, error } = await supabase.from("books").select("*");

    if (error) {
      console.error("Error fetching books:", error);
    } else {
      setBooks(data);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-blue-900 text-white'>
      <main className='flex-grow container mx-auto px-4 py-8'>
        <header className='text-center mb-12'>
          <div className='flex justify-center space-x-4'>
            <img
              src={bookBlueImage}
              alt='Book Blue'
              width={80}
              height={80}
              className='animate-float'
            />
            <img
              src={bookRedImage}
              alt='Book Red'
              width={80}
              height={80}
              className='animate-float-delayed'
            />
          </div>
        </header>
        <div className='relative w-full max-w-2xl mx-auto mb-12'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-blue-400' />
          </div>
          <Input
            type='search'
            placeholder='Explora el universo de libros...'
            className='w-full px-20 pl-10 pr-4 py-3 bg-gray-800 text-white placeholder-blue-300 border-2 border-blue-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-lg shadow-blue-500/20'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h2 className='text-3xl font-semibold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600'>
          Descubre Nuevos Mundos
        </h2>

        {filteredBooks.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-7xl mx-auto'>
            {filteredBooks.map((book) => (
              <TooltipProvider key={book.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card className='group relative overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2 bg-gray-800 border-2 border-blue-500 rounded-lg mb-3'>
                      <CardContent className='p-0'>
                        <div className='relative aspect-[2/3] w-full'>
                          <img
                            src={book.cover_image_url || placeholder}
                            alt={book.title}
                            className='rounded-t-lg object-cover w-full h-full'
                          />
                          <div className='absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-end justify-center pb-4 mt-3'>
                            <Button
                              variant='secondary'
                              size='sm'
                              className='opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-blue-600 hover:bg-blue-700 text-white mt-4 btn'
                              onClick={() => navigate(`/books/${book.isbn}`)}
                            >
                              Explorar <ChevronRight className='ml-2 h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className='flex justify-center flex-col items-center p-2 bg-gray-800 mt-4'>
                        <p className='line-clamp-2 text-sm text-center font-medium text-blue-300'>
                          {book.title}
                        </p>
                      </CardFooter>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent
                    side='top'
                    className='bg-gray-800 text-blue-300 border border-blue-500'
                  >
                    <p className='font-semibold'>{book.title}</p>
                    <p className='text-sm text-blue-400'>{book.author}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ) : (
          <div className='text-center text-blue-300 mt-8 text-lg font-medium'>
            No se encontró lo que buscabas
          </div>
        )}
      </main>
    </div>
  );
};
