import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';
import { supabase } from '../../utils/supabase-client';
import './AddBookPage.css';

export const AddBookPage = () => {
  const { authState: { user } } = useContext(AuthContext);
  const [bookData, setBookData] = useState({
    title: '',
    author: user?.firstName + " " + user?.lastName || '',
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
    <form className="add-book-form" onSubmit={handleSubmit}>
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
  );
};