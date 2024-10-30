import React, { useState, useEffect } from "react";
import { supabase } from '../../utils/supabase-client';
import { Search} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button"


import './homePage.css';
import bookBlueImage from '../../assets/book_blue.svg';
import bookRedImage from '../../assets/book_red.svg';
import placeholder from '../../assets/placeholder.svg';

export const HomePage = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState([]);
  
  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*');

    if (error) {
      console.error("Error fetching books:", error);
    } else {
      console.log(data);
      setBooks(data);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);


  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="header">
          <img src={bookBlueImage} alt="Book Blue" className="book-image"/>
          <img src={bookRedImage} alt="Book Red" className="book-image"/>
        </header>
        <div className="relative w-full max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-900" />
          <Input
            type="search"
            placeholder="Buscar libros..."
            className="w-full pl-10 py-2 bg-gray-100 text-amber-900 placeholder-amber-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-amber-900">Estantería de Libros</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {filteredBooks.map((book) => (
            <TooltipProvider key={book.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="group relative overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1">
                    <CardContent className="p-0">
                      <img
                        src={(book.cover_image_url) ? book.cover_image_url : placeholder}
                        alt={book.title}
                        className="w-full h-auto object-cover aspect-[2/3]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-amber-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                      <Button variant="secondary" size="sm" className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Ver detalles
                      </Button>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="font-semibold">{book.title}</p>
                  <p className="text-sm text-amber-700">{book.author}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </main>
    </div>
  )
};