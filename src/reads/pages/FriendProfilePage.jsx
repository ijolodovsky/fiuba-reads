import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../auth/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { UserPlus, UserCheck, MessageCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../utils/supabase-client';
import { LoadingSpinner, NotFound } from '@/src/ui/components';
import Swal from 'sweetalert2';

import { UserBooks, UserInformation, UserReviews } from '../components';
import { useFollowCounts } from '../hooks/useFollowCounts';
import { NotificationType } from '../utils/NotificationType';

export const FriendProfilePage = () => {
  const {
    authState: { user },
  } = useContext(AuthContext);
  const { userID } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { followingCount, followersCount, followersUsers, followingUsers } =
    useFollowCounts(userID);

  const fetchBookTitle = async (bookId) => {
    const { data, error } = await supabase
      .from("books")
      .select("title")
      .eq("isbn", bookId)
      .single();

    if (error) {
      console.error(`Error fetching title for book ID ${bookId}:`, error);
      return "Título desconocido";
    }
    return data?.title || "Título desconocido";
  };

  const fetchReviews = async () => {
    const { data: reviewsData, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("username", userID);

    if (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } else {
      // Usa Promise.all para obtener los títulos de todos los `book_id`
      const titles = await Promise.all(
        reviewsData.map(async (review) => {
          const title = await fetchBookTitle(review.book_id);
          return { ...review, title };
        })
      );
      setReviews(titles);
    }
  };

  const fetchBookData = async (firstName, lastName) => {
    const { data, error } = await supabase
      .from("books")
      .select("title, author, published_date, isbn")
      .eq("author", `${firstName} ${lastName}`);

    if (error) {
      setError("Error fetching book data");
    } else if (data.length > 0) {
      setBooksData(data);
    }

    setLoading(false);
  };

  const fetchUserData = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", userID);

    if (error) {
      console.error("Error fetching user data:", error);
      setError("Error fetching user data");
    } else if (data.length > 0) {
      const user = data[0];
      setUserData(user);
      if (user.role === "escritor") {
        await fetchBookData(user.first_name, user.last_name);
      }
    } else {
      setError("No user found");
    }

    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData();
  }, [userID]);

  useEffect(() => {
    fetchReviews();
  }, [userID]);

  useEffect(() => {
    const checkFollowingStatus = async () => {
      const { data, error } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", user.username)
        .eq("followed_id", userID);

      if (error) {
        console.error("Error checking following status:", error);
      } else {
        setIsFollowing(data.length > 0);
      }
    };

    if (userData) {
      checkFollowingStatus();
    }
  }, [userData]);

  const handleFollowToggle = async () => {
    if (isFollowing) {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Estás seguro que quieres dejar de seguir a este usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, dejar de seguir",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.username)
          .eq("followed_id", userID);

        if (error) {
          console.error("Error unfollowing user:", error);
        } else {
          setIsFollowing(false);
        }
      }
    } else {
      const { error } = await supabase.from("follows").insert({
        follower_id: user.username,
        followed_id: userID,
      });

      if (error) {
        console.error("Error following user:", error);
      } else {
        setIsFollowing(true);
      }


      // Crear la notificación asociada
      const { error: notificationError } = await supabase
      .from('notifications')
      .insert([{ 
      send_to: userID, 
      content: `${user.username} te ha comenzado a seguir.`,
      type: NotificationType.NEW_FOLLOWER,
      }]);

      if (notificationError) {
      console.error("Error creating notification:", notificationError.message);
      }
    }
  };


  const handleSendMessage = async () => {
    try {
      const { data: existingChatrooms, error } = await supabase
        .from('chatroom')
        .select('id')
        .or(`username1.eq.${user.username},username2.eq.${user.username}`)
        .or(`username1.eq.${userData.username},username2.eq.${userData.username}`);

      if (error) {
        console.error("Error al verificar el chatroom:", error.message);
        return;
      }

      let chatroomID;
      if (existingChatrooms && existingChatrooms.length > 0) {
        chatroomID = existingChatrooms[0].id;
      } else {
        const { data: newChatroom, error: creationError } = await supabase
          .from('chatroom')
          .insert([{ username1: user.username, username2: userData.username }])
          .select('id')
          .single();

        if (creationError) {
          console.error("Error al crear el chatroom:", creationError.message);
          return;
        }
        chatroomID = newChatroom.id;
      }

      navigate(`/chat/${chatroomID}`);
    } catch (error) {
      console.error("Error al iniciar o redirigir al chat:", error.message);
    }
  };


  if (loading) return <LoadingSpinner />;
  if (error) return <NotFound />;
  if (!userData) return null;

  const { username, role, age, first_name, last_name, email, profile_picture } = userData;

  const fullName = `${first_name} ${last_name}`;
  const isAuthor = role === "escritor";

  const FollowStatus = () => {
    return (
      <>
        <div className='mt-4 ml-4'>
          <Button
            className={`bg-blue-600 hover:bg-blue-700 text-white ${
              isFollowing ? "bg-purple-500" : ""
            }`}
            onClick={handleFollowToggle}
          >
            {isFollowing ? (
              <>
                <UserCheck className='inline-block mr-2' /> Siguiendo
              </>
            ) : (
              <>
                <UserPlus className='inline-block mr-2' /> Seguir usuario
              </>
            )}
          </Button>
          <Button
            className='ml-4 bg-green-600 hover:bg-green-700 text-white'
            onClick={handleSendMessage}
          >
            <MessageCircle className='inline-block mr-2' />
            Mandar Mensaje
          </Button>
        </div>
        {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-gray-800 border border-blue-500 rounded-lg p-6 max-w-md mx-auto">
                  <h3 className="text-2xl font-semibold text-white mb-4">Enviar Mensaje</h3>
                  <textarea
                    className="w-full p-2 text-black rounded-md"
                    rows="4"
                    placeholder="Escribe tu mensaje aquí..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleSendMessage}
                    >
                      Enviar Mensaje
                    </Button>
                  </div>
                </div>
              </div>
            )}
      </>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12'>
      <div className='container mx-auto px-4'>
        <Card className='bg-gray-800 border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden'>
          <CardHeader className='text-center bg-gradient-to-r from-blue-600 to-purple-600 py-6'>
            <CardTitle className='text-3xl font-bold text-white'>
              {username}
            </CardTitle>
            <CardDescription className='text-xl text-blue-200'>
              {role}
            </CardDescription>
          </CardHeader>
          <CardContent className='p-6'>
            <UserInformation
              fullName={fullName}
              age={age}
              email={email}
              profile_picture={profile_picture}
              followingCount={followingCount}
              followersCount={followersCount}
              followersUsers={followersUsers}
              followingUsers={followingUsers}
            />
            <FollowStatus />
            <div className='mt-8'>
              <h3 className='text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600'>
                Reseñas de Libros
              </h3>
              <UserReviews reviews={reviews} />
            </div>
            {isAuthor && <UserBooks booksData={booksData} isCurrentUser={false}/>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};