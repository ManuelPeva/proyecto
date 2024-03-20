// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [token, setToken] = useState('');

  const handleRegister = async () => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error(error);
      alert('Error al registrar usuario');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await response.json();
      setToken(data.token);
      alert(`Token de autenticación: ${data.token}`);
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="App">
      <h1>Bienvenido al Proveedor de Películas</h1>
      
      <div>
        <h2>Registrarse</h2>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleRegister}>Registrarse</button>
      </div>

      <div>
        <h2>Iniciar sesión</h2>
        <input type="email" placeholder="Correo electrónico" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
        <button onClick={handleLogin}>Iniciar sesión</button>
      </div>

      {token && (
        <div>
          <h2>Películas</h2>
          <p>Aquí se mostrará la lista de películas</p>
        </div>
      )}
    </div>
  );
}

export default App;
