// src/App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/NavBar';

function App() {
  return (
    <div>
      <NavBar />

      <div className="container mt-4">
        <h1>Edit Names</h1>
      </div>
    </div>
  );
}

export default App;
