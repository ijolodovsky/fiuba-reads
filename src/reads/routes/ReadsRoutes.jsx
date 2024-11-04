import React from "react";
import { Route, Routes } from 'react-router-dom';
import { Navbar } from '../../ui/components';
import { HomePage, ProfilePage, AddBookPage, BookProfile, ModifyBookPage, FriendProfilePage } from '../pages';

export const ReadsRoutes = () => {
  return (
    <> 
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="add-book" element={<AddBookPage />} />
          <Route path="modify-book/:isbn" element={<ModifyBookPage />} />
          <Route path="/book/:isbn" element={<BookProfile />} />
          <Route path="/users/:userID" element={<FriendProfilePage />} />
        </Routes> 
      </div>
    </>
  );
};