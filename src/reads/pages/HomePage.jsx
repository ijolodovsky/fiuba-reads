import { Search} from 'lucide-react';

import { Input, Card, CardContent, Tooltip, Grid2,Typography, Box } from "@mui/material"

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
    <div className="container">
      <header className="header">
        <div className="images-container">
          <img src={bookBlueImage} alt="Book Blue" className="book-image"/>
          <img src={bookRedImage} alt="Book Red" className="book-image"/>
        </div>
        <div className="search-bar">
          <Search className="search-icon" />
          <Input
            type="search"
            placeholder="Buscar libros..."
            className="search-input"
          />
        </div>
      </header>

      <main>
        <Box py={4} px={4}>
          <Typography variant="h5" mb={3}>Estantería de Libros</Typography>
          <Grid2 container spacing={2}>
            {books.map((book) => (
              <Grid2 item key={book.id} xs={6} sm={4} md={3} lg={2}>
                <Tooltip title={`${book.title} - ${book.author}`} arrow>
                  <Card>
                    <CardContent style={{ padding: 0 }}>
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover', aspectRatio: '2/3' }}
                      />
                    </CardContent>
                  </Card>
                </Tooltip>
              </Grid2>
            ))}
          </Grid2>
        </Box>
      </main>

      <footer className="footer">
        <Typography variant="body2">FiubaReads © 2024</Typography>
      </footer>
    </div>
  );
};