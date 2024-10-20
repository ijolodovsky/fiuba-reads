// src/App.js
import './App.css';
import React from 'react';
import Register from './routes/register';
import Login from './routes/login'; // Importa el nuevo componente de Login

function App() {
  return (
    <div className="App container mt-5">
      <h1 className="text-center mb-4">FIUBA Reads</h1>
    </div>
  );
}

export default App;
