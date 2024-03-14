import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/myalbum.css';

const MyAlbum: React.FC = () => {
  const [album, setAlbum] = useState<any[]>([]);

  useEffect(() => {
    const storedAlbum = localStorage.getItem('laminas');
    if (storedAlbum) {
      const parsedAlbum = JSON.parse(storedAlbum);
      setAlbum(parsedAlbum);
    }
  }, []);

  const handleRemoveFromAlbum = (uniqueId: string, nombre: string) => {
    const updatedAlbum = album.filter(item => item.uniqueId !== uniqueId);
    setAlbum(updatedAlbum);
    localStorage.setItem('laminas', JSON.stringify(updatedAlbum));
    toast.error(`"${nombre}" ha sido quitado del álbum.`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="obtain-packs-container">
      <h2 className="obtain-packs-header">Mi Álbum</h2>
      {album.length === 0 ? (
        <p className="obtain-packs-text">No tienes láminas en tu álbum.</p>
      ) : (
        <div className="row">
          {album.map(lamina => (
            <div key={lamina.uniqueId} className="col-md-3 mt-3">
              <div className="card album-card">
                <div className="card-body">
                  <h5 className="card-title">{lamina.nombre}</h5>
                  <p className="card-text">Sección: {lamina.seccion}</p>
                  <p className="card-text">Categoría: {lamina.categoria}</p>
                  <button className="btn btn-danger remove-button" onClick={() => handleRemoveFromAlbum(lamina.uniqueId, lamina.nombre)}>
                    Quitar del Álbum
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default MyAlbum;
