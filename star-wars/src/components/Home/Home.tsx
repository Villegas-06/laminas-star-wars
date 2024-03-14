import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/home.css';

const Home: React.FC = () => {
  useEffect(() => {
    createStars();
  }, []);

  const createStars = () => {
    const starsContainer = document.getElementById('stars-container');
    if (starsContainer) {
      const starCount = 100;
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random()}s`;
        starsContainer.appendChild(star);
      }
    }
  };

  return (
    <div className="home-container">
      <div id="stars-container" className="stars"></div>
      <div className="home-content">
        <div className="home-section">
          <Link to="/my-album" className="home-link">
            Ir al Álbum
          </Link>
        </div>
        <div className="home-section">
          <Link to="/obtain-packs" className="home-link">
            Obtener Láminas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
