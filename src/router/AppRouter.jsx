import { Route, Routes } from 'react-router-dom';
import { HomePage, ProfilePage} from '../reads';
import { RegisterPage, LoginPage } from '../auth';
import { Navbar } from '../ui/components/Navbar';

export const AppRouter = () => {
  return (
    <>
    <Navbar />
     <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Routes> 
    </>
  )
}
