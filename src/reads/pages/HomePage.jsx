import React, { useState, useEffect } from "react"
// import Image from "next/image"
import { supabase } from '../../utils/supabase-client'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import bookBlueImage from '../../assets/book_blue.svg';
import bookRedImage from '../../assets/book_red.svg';
import placeholder from '../../assets/placeholder.svg';


export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [books, setBooks] = useState([])
  const navigate = useNavigate(); 

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*')

    if (error) {
      console.error("Error fetching books:", error)
    } else {
      setBooks(data)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 to-amber-100">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">Biblioteca Virtual</h1>
          <div className="flex justify-center space-x-4">
            <img src={bookBlueImage} alt="Book Blue" width={60} height={60} />
            <img src={bookRedImage} alt="Book Red" width={60} height={60} />
          </div>
        </header>
        <div className="relative w-full max-w-md mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-500" />
          <Input
            type="search"
            placeholder="Buscar libros..."
            className="w-full pl-10 py-2 bg-white text-amber-900 placeholder-amber-400 border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-amber-900 text-center">Estantería de Libros</h2>
        <div className="flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-6xl">
            {filteredBooks.map((book) => (
              <TooltipProvider key={book.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card 
                      className="group relative overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 bg-white"
                    >
                      <CardContent className="p-0">
                        <div className="relative aspect-[2/3] w-full">
                          <img
                            src={book.cover_image_url || placeholder}
                            alt={book.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-amber-900 to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end justify-center pb-4">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              onClick={() => navigate(`/book/${book.isbn}`)}
                            >
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-center flex-col items-center p-2">
                        <p className="line-clamp-2 text-sm text-center font-medium text-amber-900">{book.title}</p>
                      </CardFooter>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-amber-100 text-amber-900 border border-amber-200">
                    <p className="font-semibold">{book.title}</p>
                    <p className="text-sm text-amber-700">{book.author}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}