import React, { useEffect, useState } from 'react';

const MyAlbum: React.FC = () => {
  const [album, setAlbum] = useState<any[]>([]);

  // Obtenemos los datos del localStorage al cargar el componente
  useEffect(() => {
    const storedAlbum = localStorage.getItem('laminas');
    if (storedAlbum) {
      const parsedAlbum = JSON.parse(storedAlbum);
      setAlbum(parsedAlbum);
    }
  }, []);

  const handleRemoveFromAlbum = (uniqueId: string) => {
    const updatedAlbum = album.filter(item => item.uniqueId !== uniqueId);
    setAlbum(updatedAlbum);
    localStorage.setItem('laminas', JSON.stringify(updatedAlbum));
  };

  return (
    <div>
      <h2>Mi Álbum</h2>
      {album.length === 0 ? (
        <p>No tienes láminas en tu álbum.</p>
      ) : (
        <div>
          {album.map(lamina => (
            <div key={lamina.uniqueId}>
              <h3>{lamina.nombre}</h3>
              <p>Sección: {lamina.seccion}</p>
              <p>Categoría: {lamina.categoria}</p>
              <button onClick={() => handleRemoveFromAlbum(lamina.uniqueId)}>
                Quitar del Álbum
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAlbum;
