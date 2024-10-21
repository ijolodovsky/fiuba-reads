import { Route, Routes } from 'react-router-dom';
import { ReadsRoutes} from '../reads';
import { RegisterPage, LoginPage } from '../auth';

export const AppRouter = () => {
  return (
    <>
     <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        <Route path="/*" element={<ReadsRoutes />} />
      </Routes> 
    </>
  )
}
