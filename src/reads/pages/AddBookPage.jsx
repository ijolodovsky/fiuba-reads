import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext'; // Asegúrate de tener el contexto de autenticación
import { supabase } from '../../utils/supabase-client';
import './AddBookPage.css';
import bookBlueImage from '../../assets/book_blue.svg';
import bookRedImage from '../../assets/book_red.svg';

export const AddBookPage = () => {
  const { authState: { user } } = useContext(AuthContext);
  const [bookData, setBookData] = useState({
    title: '',
    author: user?.firstName + " " + user?.lastName || '', // Nombre del usuario loggeado
    isbn: '',
    published_date: '',
    publisher: '',
    description: '',
    genre: '',
    page_count: '',
    cover_image_url: ''
  });
  const navigate = useNavigate();
  console.log(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('books').insert([bookData]);
    if (!error) navigate('/');
    else console.error(error);
  };

  return (
    <div className="container mb-3">
    <header className="header">
          <img src={bookBlueImage} alt="Book Blue" className="book-image"/>
          <img src={bookRedImage} alt="Book Red" className="book-image"/>
        </header>
    <h2 className='text-center'>Agregá tus libros a FIUBA Reads</h2>
    <p className='text-center'>Completá el siguiente formulario para agregar un libro a la plataforma. <br />Solo podés subir libros de tu autoría :)</p>
    <form className="add-book-form mb-4" onSubmit={handleSubmit}>
      <label>
        Título
        <input type="text" name="title" value={bookData.title} onChange={handleChange} required />
      </label>

      <label>
        Autor
        <input type="text" name="author" value={bookData.author} disabled />
      </label>

      <label>
        ISBN
        <input type="text" name="isbn" value={bookData.isbn} onChange={handleChange} />
      </label>

      <label>
        Fecha de Publicación
        <input type="date" name="published_date" value={bookData.published_date} onChange={handleChange} />
      </label>

      <label>
        Editorial
        <input type="text" name="publisher" value={bookData.publisher} onChange={handleChange} />
      </label>

      <label>
        Descripción
        <textarea name="description" value={bookData.description} onChange={handleChange}></textarea>
      </label>

      <label>
        Género
        <input type="text" name="genre" value={bookData.genre} onChange={handleChange} />
      </label>

      <label>
        Número de Páginas
        <input type="number" name="page_count" value={bookData.page_count} onChange={handleChange} />
      </label>

      <label>
        URL de la Imagen de Portada
        <input type="url" name="cover_image_url" value={bookData.cover_image_url} onChange={handleChange} />
      </label>

      <button type="submit">Agregar Libro</button>
    </form>
    </div>
  );
};