import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../../auth/authProvider';

const HomeComponent: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/')
    
  };

  return (
    <div>
      <h2>Bienvenido, {user?.username}</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default HomeComponent;
