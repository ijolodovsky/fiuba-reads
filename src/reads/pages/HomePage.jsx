import '../styles/styles.css';
import './homePage.css';
import bookBlueImage from '../../assets/book_blue.svg';
import bookRedImage from '../../assets/book_red.svg';

export const HomePage = () => {
  const books = [
    {
      id: 1,
      title: "Cien Años de Soledad",
      author: "Gabriel García Márquez",
      review: "Una obra maestra de realismo mágico, que explora generaciones de la familia Buendía.",
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      review: "Una crítica profunda sobre los peligros de un régimen totalitario y la vigilancia masiva.",
    },
    {
      id: 3,
      title: "El Aleph",
      author: "Jorge Luis Borges",
      review: "Un viaje por la mente de Borges, explorando lo infinito en lo finito.",
    },
  ];

  return (
    <div className="homepage-container">
      <header className="header">
        <img src={bookBlueImage} alt="Book Blue" className="book-image"/>
        <img src={bookRedImage} alt="Book Red" className="book-image"/>
      </header>

      <section className="reviews-section">
        <h2>Reseñas de libros</h2>
        <div className="reviews-list">
          {books.map((book) => (
            <div key={book.id} className="review-card">
              <h3>{book.title}</h3>
              <h4>{book.author}</h4>
              <p>{book.review}</p>
            </div>
          ))}
        </div>
      </section>

      <footer>
        <p>FIUBA READS © 2024.</p>
      </footer>
    </div>
  );
};
