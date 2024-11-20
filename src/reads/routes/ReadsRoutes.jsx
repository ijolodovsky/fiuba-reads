import React from "react";
import { Route, Routes } from 'react-router-dom';
import { Navbar, NotificationListener } from '../../ui/components';
import { HomePage, ProfilePage, AddBookPage, BookProfile, ModifyBookPage, FriendProfilePage, UserSearch, ModifyProfilePage, ChatPage, ListChatPage, NotificationPage, SuccessPage } from '../pages';
import { ToastContainer } from 'react-toastify';

export const ReadsRoutes = () => {
  return (
    <>
    <NotificationListener />
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="add-book" element={<AddBookPage />} />
          <Route path="update-book/:isbn" element={<ModifyBookPage />} />
          <Route path="/books/:isbn" element={<BookProfile />} />
          <Route path="/users/:userID" element={<FriendProfilePage />} />
          <Route path="users" element={<UserSearch />} />
          <Route path="chatlist" element={<ListChatPage />} />
          <Route path="chat/:chatroomID" element={<ChatPage />} />
          <Route path="update-profile" element={<ModifyProfilePage />} />
          <Route path="notifications" element={<NotificationPage />} />
          <Route path="success" element={<SuccessPage/>} />
        </Routes> 
      </div>
    </>
  );
};