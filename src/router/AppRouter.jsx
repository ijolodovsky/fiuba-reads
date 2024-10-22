import { Route, Routes } from 'react-router-dom';
import { ReadsRoutes} from '../reads';
import { RegisterPage, LoginPage } from '../auth';
import { PrivateRouter } from './PrivateRouter';
import { PublicRouter } from './PublicRouter';

export const AppRouter = () => {
  return (
    <>
     <Routes>

        <Route path="login" element={
          <PublicRouter>
            <LoginPage />
          </PublicRouter>
          } />
        <Route path="register" element={
          <PublicRouter>
            <RegisterPage />
          </PublicRouter>
          } />

        <Route path="/*" element={
          <PrivateRouter>
            <ReadsRoutes />
          </PrivateRouter>}>
        </Route>
      </Routes> 
    </>
  )
}
