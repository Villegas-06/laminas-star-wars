import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/myalbum.css';
import { getFilmById, getPersonById, getStarshipById } from '../../services/swapiService';

const MyAlbum: React.FC = () => {
  const [album, setAlbum] = useState<any[]>([]);
  const [resourceInfo] = useState<Record<string, any>>({});
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

  const fetchResourceInfo = async (apiId: string, seccion: string) => {
    try {
      let info;
      if (seccion === 'films') {
        info = await getFilmById(apiId);
      } else if (seccion === 'people') {
        info = await getPersonById(apiId);
      } else if (seccion === 'starships') {
        info = await getStarshipById(apiId);
      }
  
      return {
        name: info.name,
        // Agrega las otras propiedades que necesitas mostrar
      };
    } catch (error) {
      console.error('Error al obtener información del recurso:', error);
      return {
        name: 'Información no disponible',
        // Agrega las otras propiedades que necesitas mostrar
      };
    }
  };
  
  console.log(album);
  

  useEffect(() => {
    album.forEach((lamina) => {
      if (lamina.apiId && !resourceInfo[lamina.apiId]) {
        fetchResourceInfo(lamina.apiId, lamina.seccion);
      }
    });
  }, [album, resourceInfo]);

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
           {album.length === 0 ? (
          <p className="obtain-packs-text">No tienes láminas en tu álbum.</p>
          ) : (
            <div className="row">
                {album.map((lamina, index) => (
                    <div key={lamina.uniqueId} className='col-md-3 mt-3'>
                        <div className={`card album-card ${lamina.categoria === 'Especial' ? 'album-lamina-especial' : ''}`}>
                        <div className="card-body">
                            <h5 className="card-title">Nombre: {lamina.nombre}</h5>
                            <p className="card-text">Sección: {lamina.seccion}</p>
                            <p className="card-text">Categoría: {lamina.categoria}</p>
                            {lamina.apiId && resourceInfo[lamina.apiId] ? (
                              <>
                                <p className="card-text">Nombre: {resourceInfo[lamina.apiId].name}</p>
                                {/* Agrega otras propiedades aquí */}
                              </>
                            ) : (
                              <p className="card-text">Número de lámina: {lamina.uniqueId.split('_')[0]}</p>
                            )}
                            <button className="btn btn-danger remove-button" onClick={() => handleRemoveFromAlbum(lamina.uniqueId, lamina.nombre)}>
                            Quitar del Álbum
                            </button>
                        </div>
                        </div>
                    </div>          
                ))}
                </div>
            )}
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
