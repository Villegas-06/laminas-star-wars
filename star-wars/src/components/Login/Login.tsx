import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/authProvider';
import Swal from 'sweetalert2';

import '../../styles/login.css'

const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  const handleUsernameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSumbit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || username.trim() === '') {
      setError('Por favor ingresa un nombre de usuario');
      return;
    }

    if (!password || password.trim() === '') {
      setError('Por favor ingresa una contraseña');
      return;
    }

    try {
      await login(username, password);

      if (!isLoggedIn()) {
        setError('Usuario o contraseña incorrectos');
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: 'Inicio de Sesión Exitoso!',
        text: 'Bienvenido de nuevo',
        confirmButtonText: 'Ok',
      });

      navigate('/home');
    } catch (error) {
      setError('Error al iniciar sesión. Verifica tus credenciales.');
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSumbit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Nombre de usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameInputChange}
              placeholder="TheUnicReal"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordInputChange}
              placeholder="Contraseña"
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="login-submit" type="submit">
            Iniciar Sesión
          </button>
          <p className="register-account">
            ¿Deseas registrarte? Regístrate <Link to="/register">aquí</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
