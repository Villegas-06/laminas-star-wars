import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/notfound.css';

const NotFound: React.FC = () => {
  return (
    <div className="notfound-container">
      <h1 className="notfound-heading">404 - Página no encontrada</h1>
      <p className="notfound-text">Lo sentimos, la página que estás buscando no existe.</p>
      <Link to="/home" className="notfound-link">Volver a la página de inicio</Link>
    </div>
  );
};

export default NotFound;
