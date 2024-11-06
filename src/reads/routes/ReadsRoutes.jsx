import React from "react";
import { Route, Routes } from 'react-router-dom';
import { Navbar } from '../../ui/components';
import { HomePage, ProfilePage, AddBookPage, BookProfile, ModifyBookPage, FriendProfilePage, UserSearch } from '../pages';

export const ReadsRoutes = () => {
  return (
    <> 
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
        </Routes> 
      </div>
    </>
  );
};