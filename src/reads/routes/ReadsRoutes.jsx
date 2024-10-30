import React from "react";
import { Route, Routes } from 'react-router-dom';
import { Navbar } from '../../ui/components';
import { HomePage, ProfilePage } from '../pages';

export const ReadsRoutes = () => {
  return (
   <> 
    <Navbar />

    <div className="container">
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        {/* TODO: Agregar el resto de rutas correspondientes (Friends, Books, etc) */}
    </Routes> 
    </div>
   </>
  )
}


