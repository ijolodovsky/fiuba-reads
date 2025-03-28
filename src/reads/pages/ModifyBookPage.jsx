import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';
import { supabase } from '../../utils/supabase-client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookPlus, Calendar, BookOpen, Bookmark, DollarSign, Building,  FileText, Hash, FileSpreadsheet, Image} from "lucide-react";
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import './AddBookPage.css';
import bookBlueImage from '../../assets/book_blue.svg';
import bookRedImage from '../../assets/book_red.svg';

export const ModifyBookPage = () => {
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

  const {isbn} = useParams();

  useEffect(() => {
    const fetchBookData = async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('isbn', isbn)
        .single();

      if (data) {
        setBookData(data);
      } else if (error) {
        console.error('Error al cargar el libro:', error);
      }
    };

    if (isbn) fetchBookData();
  }, [isbn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('books')
      .update(bookData)
      .eq('isbn', isbn);
    if (!error) navigate('/');
    else console.error(error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
            <div className="flex justify-center space-x-4">
              <img src={bookBlueImage} alt="Book Blue" width={80} height={80} className="animate-float" />
              <img src={bookRedImage} alt="Book Red" width={80} height={80} className="animate-float-delayed" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Actualiza tus libros en FIUBA Reads</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-center text-blue-300 mb-6">Completa el siguiente formulario para agregar un libro a la plataforma. Solo puedes subir libros de tu autoría :) Los campos marcados con <span className="text-red-500">*</span> son obligatorios.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center space-x-4">
                <BookOpen className="text-blue-400" />
                <span className="text-red-500">*</span>
                <Input
                  type="text"
                  name="title"
                  value={bookData.title}
                  onChange={handleChange}
                  placeholder="Título"
                  required
                  className="bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                />
              </div>

              <div className="flex items-center space-x-10">
                <BookPlus className="text-blue-400" />
                <Input
                  type="text"
                  name="author"
                  value={bookData.author}
                  disabled
                  className="bg-gray-700 border-blue-500 text-white"
                />
              </div>

              <div className="flex items-center space-x-10">
                <Hash className="text-blue-400" />
                <Input
                  type="text"
                  name="isbn"
                  value={bookData.isbn}
                  disabled
                  placeholder="ISBN"
                  className="bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                />
              </div>

              <div className="flex items-center space-x-10">
                <DollarSign className="text-blue-400" />
                
                <Input
                  type="number"
                  name="price"
                  value={bookData.price}
                  onChange={handleChange}
                  placeholder="Precio"
                  required
                  className="bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Calendar className="text-blue-400" />
                <span className="text-red-500">*</span>
                <Input
                  type="date"
                  name="published_date"
                  value={bookData.published_date}
                  onChange={handleChange}
                  required
                  className="bg-gray-700 border-blue-500 text-white"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Building className="text-blue-400" />
                <span className="text-red-500">*</span>
                <Input
                  type="text"
                  name="publisher"
                  value={bookData.publisher}
                  onChange={handleChange}
                  required
                  placeholder="Editorial"
                  className="bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                />
              </div>

              <div className="flex items-center space-x-10">
                <FileText className="text-blue-400" />
                <Textarea
                  name="description"
                  value={bookData.description}
                  onChange={handleChange}
                  placeholder="Descripción"
                  className="bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                />
              </div>

              <div className="flex items-center space-x-4">
                <Bookmark className="text-blue-400" />
                <span className="text-red-500">*</span>
                <Input
                  type="text"
                  name="genre"
                  value={bookData.genre}
                  onChange={handleChange}
                  placeholder="Género"
                  required
                  className="bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                />
              </div>

              <div className="flex items-center space-x-4">
                <FileSpreadsheet className="text-blue-400" />
                <span className="text-red-500">*</span>
                <Input
                  type="number"
                  name="page_count"
                  value={bookData.page_count}
                  onChange={handleChange}
                  required
                  placeholder="Número de Páginas"
                  className="bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                />
              </div>

              <div className="flex items-center space-x-10">
                <Image className="text-blue-400" />
                <Input
                  type="url"
                  name="cover_image_url"
                  value={bookData.cover_image_url}
                  onChange={handleChange}
                  placeholder="URL de la Imagen de Portada"
                  className="bg-gray-700 border-blue-500 text-white placeholder-blue-300"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white btn">
                Modificar Libro
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};