import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { UserBooks, FollowedUsersModal } from '../components';
import { supabase } from '../../utils/supabase-client';
import { LoadingSpinner, NotFound } from '@/src/ui/components';
import './profilePage.css';
import { UserInformation } from '../components/UserInformation';
import { useFollowCounts } from '../hooks/useFollowCounts';

export const ProfilePage = () => {
  const { authState: { user } } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [booksData, setBooksData] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const { followingCount, followersCount, followedUsers } = useFollowCounts(user.username);
  const navigate = useNavigate();

  const handleToggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleAddBook = () => {
    navigate('/add-book');
  };

  const isAuthor = user.role === 'escritor';

  const fetchBookData = async (firstName, lastName) => {
    const { data, error } = await supabase
      .from('books')
      .select('title, author, published_date, isbn')
      .eq('author', `${firstName} ${lastName}`);
  
    if (error) {
      setError('Error fetching book data');
    } else if (data.length > 0) {
      setBooksData(data);
    }
  
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      if (isAuthor) {
        fetchBookData(user.firstName, user.lastName);
      } else {
        setLoading(false);
      }
    }
  }, [user]);

  if (loading) return <LoadingSpinner />;
  if (error) return <NotFound />;

  const { username, role, age, firstName, lastName, email, profilePicture } = user;
  const fullName = `${firstName} ${lastName}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <Card className="bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6">
            <CardTitle className="text-3xl font-bold text-white">{username}</CardTitle>
            <CardDescription className="text-xl text-blue-200">{role}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <UserInformation fullName={fullName} age={age} email={email} profile_picture={profilePicture} handleToggleModal={handleToggleModal} followingCount={followingCount} followersCount={followersCount} />
            {isAuthor && <UserBooks booksData={booksData} handleAddBook={handleAddBook}/>}
          </CardContent>
        </Card>
      </div>
      <FollowedUsersModal isOpen={isModalOpen} onClose={handleToggleModal} users={followedUsers} />
    </div>
  );
};