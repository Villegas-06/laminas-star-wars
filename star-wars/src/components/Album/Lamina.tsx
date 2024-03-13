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
  return (
    <div>
      <h3>{lamina.nombre}</h3>
      <p>Sección: {lamina.seccion}</p>
      <p>Categoría: {lamina.categoria}</p>
      {lamina.agregada ? (
        <button onClick={onDescartar}>Descartar</button>
      ) : (
        <button onClick={onAgregar}>Agregar al Álbum</button>
      )}
    </div>
  );
};

export default LaminaCard;
