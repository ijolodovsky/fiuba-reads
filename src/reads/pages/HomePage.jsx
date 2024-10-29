import { BookOpen, Search, User } from 'lucide-react';

//aca deberian ir los components de shadcn ??
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import './homePage.css';
import bookBlueImage from '../../assets/book_blue.svg';
import bookRedImage from '../../assets/book_red.svg';

export const HomePage = () => {
  const books = [
    {
      id: 1,
      title: "Cien Años de Soledad",
      author: "Gabriel García Márquez",
      coverUrl: "/placeholder.svg?height=240&width=160"
    },
    {
      id: 2,
      title: "La Sombra del Viento",
      author: "Carlos Ruiz Zafón",
      coverUrl: "/placeholder.svg?height=240&width=160"
    },
    {
      id: 3,
      title: "El Laberinto de los Espíritus",
      author: "Carlos Ruiz Zafón",
      coverUrl: "/placeholder.svg?height=240&width=160"
    },
    {
      id: 4,
      title: "Rayuela",
      author: "Julio Cortázar",
      coverUrl: "/placeholder.svg?height=240&width=160"
    },
    {
      id: 5,
      title: "La Casa de los Espíritus",
      author: "Isabel Allende",
      coverUrl: "/placeholder.svg?height=240&width=160"
    },
    {
      id: 6,
      title: "2666",
      author: "Roberto Bolaño",
      coverUrl: "/placeholder.svg?height=240&width=160"
    },
    {
      id: 7,
      title: "Ficciones",
      author: "Jorge Luis Borges",
      coverUrl: "/placeholder.svg?height=240&width=160"
    },
    {
      id: 8,
      title: "La Ciudad y los Perros",
      author: "Mario Vargas Llosa",
      coverUrl: "/placeholder.svg?height=240&width=160"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <img src={bookBlueImage} alt="Book Blue" className="book-image"/>
            <img src={bookRedImage} alt="Book Red" className="book-image"/>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Buscar libros..."
                className="pl-9 w-64"
              />
            </div>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Perfil</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Estantería de Libros</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {books.map((book) => (
            <TooltipProvider key={book.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-auto object-cover aspect-[2/3]"
                      />
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-semibold">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </main>

      <footer className="bg-white py-4 text-center text-sm text-gray-600">
        <p>FiubaReads © 2024</p>
      </footer>
    </div>
  );
};