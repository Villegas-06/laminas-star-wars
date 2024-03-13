import React from 'react';

interface Lamina {
  id: number;
  nombre: string;
  seccion: string;
  categoria: string;
  agregada?: boolean;
}

interface LaminaCardProps {
  lamina: Lamina;
  onAgregar: () => void;
  onDescartar: () => void;
}

const LaminaCard: React.FC<LaminaCardProps> = ({ lamina, onAgregar, onDescartar }) => {
  const handleAgregarClick = () => {
    if (lamina.agregada) {
      onDescartar(); // Si está agregada, descartar
    } else {
      onAgregar(); // Si no está agregada, agregar
    }
  };

  return (
    <div>
      <h3>{lamina.nombre}</h3>
      <p>Sección: {lamina.seccion}</p>
      <p>Categoría: {lamina.categoria}</p>
      {lamina.agregada ? (
        <div>
          <button disabled>Agregada al Álbum</button>
          <button onClick={handleAgregarClick}>Descartar</button>
        </div>
      ) : (
        <button onClick={handleAgregarClick}>Agregar al Álbum</button>
      )}
    </div>
  );
};

export default LaminaCard;
