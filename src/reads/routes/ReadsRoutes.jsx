import React from "react";
import { Route, Routes } from 'react-router-dom';
import { Navbar } from '../../ui/components';
import { HomePage, ProfilePage, AddBookPage, BookProfile } from '../pages';

export const ReadsRoutes = () => {
  return (
    <> 
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="add-book" element={<AddBookPage />} />
          <Route path="/book/:isbn" element={<BookProfile />} />
        </Routes> 
      </div>
    </>
  );
};