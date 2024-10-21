import './App.css';
import {AppRouter} from './router/AppRouter';

export const App = () =>  {
  return (
    <div className="App container mt-5">
      {/* <h1 className="text-center mb-4">FIUBA Reads</h1> */}
      <AppRouter />
      
    </div>
  );
}
