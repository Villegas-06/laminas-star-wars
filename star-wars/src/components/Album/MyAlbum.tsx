import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/myalbum.css';

const MyAlbum: React.FC = () => {
  const [album, setAlbum] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAlbum = localStorage.getItem('laminas');
    if (storedAlbum) {
      const parsedAlbum = JSON.parse(storedAlbum);
      setAlbum(parsedAlbum);
    }
  }, []);
  
  const goToPage = (path: string) => {
    navigate(path); 
  };

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
        <div className="d-flex justify-content-between align-items-center">
        <h2 className="obtain-packs-header">Mi Álbum</h2>
            <div className="navigation-buttons">
                <button className="btn btn-primary me-2" onClick={() => goToPage('/obtain-packs')}>Obtener Sobres</button>
                <button className="btn btn-primary" onClick={() => goToPage('/home')}>Home</button>
            </div> 
        </div>
        {album.length === 0 ? (
            <p className="obtain-packs-text">No tienes láminas en tu álbum.</p>
        ) : (
            <div className="row">
            {album.map(lamina => (
                <div key={lamina.uniqueId} className='col-md-3 mt-3'>
                    <div className={`card album-card ${lamina.categoria === 'Especial' ? 'album-lamina-especial' : ''}`}>
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
