import React from 'react';
import LaminaCard from './Lamina';

interface AlbumProps {
  laminas: any[];
  handleAddToAlbum: (lamina: any) => void;
  handleDiscard: (laminaId: number) => void;
}

const Album: React.FC<AlbumProps> = ({ laminas, handleAddToAlbum, handleDiscard }) => {
  return (
    <div>
      <h2>Álbum</h2>
      <div>
        {laminas.map((lamina, index) => (
          <LaminaCard
            key={index}
            lamina={lamina}
            onAgregar={() => handleAddToAlbum(lamina)}
            onDescartar={() => handleDiscard(lamina.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Album;
