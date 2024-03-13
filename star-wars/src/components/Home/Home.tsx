import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/home.css'

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-section">
        <h2>Ir al Álbum</h2>
        <Link to="/my-album" className="btn">
          Ir al Álbum
        </Link>
      </div>
      <div className="home-section">
        <h2>Obtener Láminas</h2>
        <Link to="/obtain-packs" className="btn">
          Obtener Láminas
        </Link>
      </div>
    </div>
  );
};

export default Home;
