import React, { useEffect, useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/myalbum.css';
import { getFilmById, getPersonById, getStarshipById } from '../../services/swapiService';

const MyAlbum: React.FC = () => {
  const [album, setAlbum] = useState<any[]>([]);
  const [resourceInfo, setResourceInfo] = useState<Record<string, any>>({});
  const [selectedLamina, setSelectedLamina] = useState<any | null>(null);
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

  const fetchResourceInfo = useCallback(async (apiId: string, seccion: string) => {
    try {
      let info: any;
      if (seccion === 'films') {
        info = await getFilmById(apiId);
        setResourceInfo(prevState => ({
          ...prevState,
          [apiId]: {
            title: info.title,
            release_date: info.release_date,
            opening_crawl: info.opening_crawl,
            director: info.director,
            producer: info.producer,
          }
        }));
      } else if (seccion === 'people') {
        info = await getPersonById(apiId);
        setResourceInfo(prevState => ({
          ...prevState,
          [apiId]: {
            name: info.name,
            height: info.height,
            mass: info.mass,
            hair_color: info.hair_color,
            skin_color: info.skin_color,
            eye_color: info.eye_color,
            birth_year: info.birth_year,
            gender: info.gender,
          }
        }));
      } else if (seccion === 'starships') {
        info = await getStarshipById(apiId);
        setResourceInfo(prevState => ({
          ...prevState,
          [apiId]: {
            name: info.name,
            model: info.model,
            manufacturer: info.manufacturer,
            cost_in_credits: info.cost_in_credits,
            length: info.length,
            max_atmosphering_speed: info.max_atmosphering_speed,
            crew: info.crew,
            passengers: info.passengers,
            cargo_capacity: info.cargo_capacity,
            consumables: info.consumables,
            hyperdrive_rating: info.hyperdrive_rating,
            MGLT: info.MGLT,
            starship_class: info.starship_class,
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching resource info:', error);
    }
  }, []);

  useEffect(() => {
    album.forEach((lamina) => {
      if (lamina.apiId && !resourceInfo[lamina.apiId]) {
        fetchResourceInfo(lamina.apiId, lamina.seccion);
      }
    });
  }, [album, resourceInfo, fetchResourceInfo]);

  const handleRemoveFromAlbum = (uniqueId: string, nombre: string) => {
    const updatedAlbum = album.filter(item => item.uniqueId !== uniqueId);
    setAlbum(updatedAlbum);
    localStorage.setItem('laminas', JSON.stringify(updatedAlbum));
    toast.error(`"${nombre}" has been removed from the album.`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const openModal = (lamina: any) => {
    setSelectedLamina(lamina);
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.add('show');
    }
  };
  
  const closeModal = () => {
    setSelectedLamina(null);
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
    }
  };

  return (
    <div className="my-album-container">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="my-album-header">Mi Álbum</h2>
        <div className="navigation-buttons">
          <button className="btn btn-primary me-2" onClick={() => goToPage('/obtain-packs')}>Obtener Sobres</button>
          <button className="btn btn-primary" onClick={() => goToPage('/home')}>Home</button>
        </div>
      </div>
      {album.length === 0 ? (
        <p className="my-album-text">No tienes láminas en tu álbum.</p>
      ) : (
        <>
          <div className="row">
            <h3>Films</h3>
            {album.map((lamina) => (
              lamina.seccion === 'films' && (
                <div key={lamina.uniqueId} className='col-md-3 mt-3'>
                  <div className={`card album-card ${lamina.categoria === 'Especial' ? 'album-lamina-especial' : ''}`} onClick={() => openModal(lamina)}>
                    <div className="card-body">
                      <h5 className="card-title">Nombre: {lamina.nombre}</h5>
                      <p className="card-text">Sección: {lamina.seccion}</p>
                      <p className="card-text">Categoría: {lamina.categoria}</p>
                      {lamina.apiId && resourceInfo[lamina.apiId] ? (
                        <>
                          <p className="card-text">Título: {resourceInfo[lamina.apiId].title}</p>
                          <p className="card-text">Fecha de lanzamiento: {resourceInfo[lamina.apiId].release_date}</p>
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
              )
            ))}
          </div>
          <div className="row">
            <h3>People</h3>
            {album.map((lamina) => (
              lamina.seccion === 'people' && (
                <div key={lamina.uniqueId} className='col-md-3 mt-3'>
                  <div className={`card album-card ${lamina.categoria === 'Especial' ? 'album-lamina-especial' : ''}`} onClick={() => openModal(lamina)}>
                    <div className="card-body">
                      <h5 className="card-title">Nombre: {lamina.nombre}</h5>
                      <p className="card-text">Sección: {lamina.seccion}</p>
                      <p className="card-text">Categoría: {lamina.categoria}</p>
                      {lamina.apiId && resourceInfo[lamina.apiId] ? (
                        <>
                          <p className="card-text">Nombre: {resourceInfo[lamina.apiId].name}</p>
                          <p className="card-text">Género: {resourceInfo[lamina.apiId].gender}</p>
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
              )
            ))}
          </div>
          <div className="row">
            <h3>Starships</h3>
            {album.map((lamina) => (
              lamina.seccion === 'starships' && (
                <div key={lamina.uniqueId} className='col-md-3 mt-3'>
                  <div className={`card album-card ${lamina.categoria === 'Especial' ? 'album-lamina-especial' : ''}`} onClick={() => openModal(lamina)}>
                    <div className="card-body">
                      <h5 className="card-title">Nombre: {lamina.nombre}</h5>
                      <p className="card-text">Sección: {lamina.seccion}</p>
                      <p className="card-text">Categoría: {lamina.categoria}</p>
                      {lamina.apiId && resourceInfo[lamina.apiId] ? (
                        <>
                          <p className="card-text">Nombre: {resourceInfo[lamina.apiId].name}</p>
                          <p className="card-text">Clase de nave: {resourceInfo[lamina.apiId].starship_class}</p>
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
              )
            ))}
          </div>
        </>
      )}
      {/* Modal */}
      {selectedLamina && (
        <div className="modal fade show" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">{selectedLamina.nombre}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <p>Sección: {selectedLamina.seccion}</p>
                <p>Categoría: {selectedLamina.categoria}</p>
                {selectedLamina.apiId && resourceInfo[selectedLamina.apiId] ? (
                  <>
                    {selectedLamina.seccion === 'films' && (
                      <>
                        <p>Título: {resourceInfo[selectedLamina.apiId].title}</p>
                        <p>Fecha de lanzamiento: {resourceInfo[selectedLamina.apiId].release_date}</p>
                        <p>Director: {resourceInfo[selectedLamina.apiId].director}</p>
                        <p>Productor: {resourceInfo[selectedLamina.apiId].producer}</p>
                        <p>Sipnosis: {resourceInfo[selectedLamina.apiId].opening_crawl}</p>
                      </>
                    )}
                    {selectedLamina.seccion === 'people' && (
                      <>
                        <p>Nombre: {resourceInfo[selectedLamina.apiId].name}</p>
                        <p>Género: {resourceInfo[selectedLamina.apiId].gender}</p>
                        <p>Altura: {resourceInfo[selectedLamina.apiId].height}</p>
                        <p>Peso: {resourceInfo[selectedLamina.apiId].mass}</p>
                        <p>Color de cabello: {resourceInfo[selectedLamina.apiId].hair_color}</p>
                        <p>Color de piel: {resourceInfo[selectedLamina.apiId].skin_color}</p>
                        <p>Color de ojos: {resourceInfo[selectedLamina.apiId].eye_color}</p>
                        <p>Año de nacimiento: {resourceInfo[selectedLamina.apiId].birth_year}</p>
                      </>
                    )}
                    {selectedLamina.seccion === 'starships' && (
                      <>
                        <p>Nombre: {resourceInfo[selectedLamina.apiId].name}</p>
                        <p>Clase de nave: {resourceInfo[selectedLamina.apiId].starship_class}</p>
                        <p>Modelo: {resourceInfo[selectedLamina.apiId].model}</p>
                        <p>Fabricante: {resourceInfo[selectedLamina.apiId].manufacturer}</p>
                        <p>Costo en créditos: {resourceInfo[selectedLamina.apiId].cost_in_credits}</p>
                        <p>Longitud: {resourceInfo[selectedLamina.apiId].length}</p>
                        <p>Velocidad máxima en atmósfera: {resourceInfo[selectedLamina.apiId].max_atmosphering_speed}</p>
                        <p>Tripulación: {resourceInfo[selectedLamina.apiId].crew}</p>
                        <p>Pasajeros: {resourceInfo[selectedLamina.apiId].passengers}</p>
                        <p>Capacidad de carga: {resourceInfo[selectedLamina.apiId].cargo_capacity}</p>
                        <p>Consumibles: {resourceInfo[selectedLamina.apiId].consumables}</p>
                        <p>Índice de velocidad hiperespacial: {resourceInfo[selectedLamina.apiId].hyperdrive_rating}</p>
                        <p>Velocidad en MGLT: {resourceInfo[selectedLamina.apiId].MGLT}</p>
                      </>
                    )}
                  </>
                ) : (
                  <p>Número de lámina: {selectedLamina.uniqueId.split('_')[0]}</p>
                )}
              </div>
            </div>
          </div>
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
