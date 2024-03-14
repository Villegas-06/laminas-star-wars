import React, { useState, useEffect } from 'react';
import { getFilms, getPeople, getStarships } from '../../services/swapiService';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/obtainpacks.css';

const ObtainPacks: React.FC = () => {
  const [packs, setPacks] = useState<number>(4);
  const [packOpened, setPackOpened] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(60);
  const [newLaminas, setNewLaminas] = useState<any[]>([]);
  const [allLaminas, setAllLaminas] = useState<any[]>([]);
  const [album, setAlbum] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown && cooldownTime > 0) {
      timer = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
    } else if (cooldown && cooldownTime === 0) {
      setCooldown(false);
      setCooldownTime(60); 
    }
  
    return () => clearTimeout(timer);
  }, [cooldown, cooldownTime]);

  useEffect(() => {
    const storedLaminas = localStorage.getItem('laminas');
    if (storedLaminas) {
      setAllLaminas(JSON.parse(storedLaminas));
    }
  }, []);

  
  const goToPage = (path: string) => {
    navigate(path); 
  };

  const openPack = async () => {
    if (packs > 0 && !cooldown) {
      setPackOpened(true);
      setPacks(prevPacks => prevPacks - 1);
      setCooldown(true);
  
      try {
        const films = await getFilms();
        const people = await getPeople();
        const starships = await getStarships();
  
        const laminas = generateLaminas(films, people, starships);
        setNewLaminas(laminas);
  
        if (cooldownTime === 0) {
          setCooldown(false);
        }
      } catch (error) {
        console.error('Error al obtener las láminas:', error);
      }
    }
  };

  const generateLaminas = (films: any[], people: any[], starships: any[]) => {
    const laminas: any[] = [];
  
    const isSpecialFilm = (index: number) => {
      return index < 6; 
    };
  
    const isSpecialPerson = (index: number) => {
      return index < 20;
    };
  
    const isSpecialStarship = (index: number) => {
      return index < 10;
    };
  
    const configIndex = Math.floor(Math.random() * 2);
  
    if (configIndex === 0) {
      const pelicula = getRandomItem(films.filter((_, index) => isSpecialFilm(index)));
      const personajes = getRandomItems(people.filter((_, index) => isSpecialPerson(index)), 3);
      const nave = getRandomItems(starships.filter((_, index) => isSpecialStarship(index)), 1)[0];
  
      laminas.push(
        { uniqueId: generateUniqueId(), nombre: `${pelicula.title} - ID: ${pelicula.url.split('/').reverse()[1]}`, seccion: pelicula.url.split('/').reverse()[1], categoria: 'Especial', agregada: false },
        ...personajes.map(personaje => ({ uniqueId: generateUniqueId(), nombre: `${personaje.name} - ID: ${personaje.url.split('/').reverse()[1]}`, seccion: personaje.url.split('/').reverse()[1], categoria: 'Especial', agregada: false })),
        { uniqueId: generateUniqueId(), nombre: `${nave.name} - ID: ${nave.url.split('/').reverse()[1]}`, seccion: nave.url.split('/').reverse()[1], categoria: 'Especial', agregada: false }
      );
    } else {
      const personajes = getRandomItems(people, 3);
      const naves = getRandomItems(starships, 2);
  
      laminas.push(
        ...personajes.map(personaje => ({ uniqueId: generateUniqueId(), nombre: `${personaje.name} - ID: ${personaje.url.split('/').reverse()[1]}`, seccion: personaje.url.split('/').reverse()[1], categoria: 'Regular', agregada: false })),
        ...naves.map(nave => ({ uniqueId: generateUniqueId(), nombre: `${nave.name} - ID: ${nave.url.split('/').reverse()[1]}`, seccion: nave.url.split('/').reverse()[1], categoria: 'Regular', agregada: false }))
      );
    }
  
    return laminas;
  };

  
  const getRandomItem = (items: any[]) => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const getRandomItems = (items: any[], count: number) => {
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleAddToAlbum = (lamina: any) => {
    const isDuplicate = album.some(item => item.uniqueId === lamina.uniqueId);

    if (!isDuplicate) {
      setAlbum(prevAlbum => [...prevAlbum, lamina]);
      toast.success('Lamina agregada al álbum.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      const updatedNewLaminas = newLaminas.map(l => {
        if (l.uniqueId === lamina.uniqueId) {
          return { ...l, agregada: true };
        }
        return l;
      });
      setNewLaminas(updatedNewLaminas);

      const updatedAllLaminas = [...allLaminas, lamina];
      setAllLaminas(updatedAllLaminas);
      localStorage.setItem('laminas', JSON.stringify(updatedAllLaminas));
    } else {
      toast.error('Esta lámina ya está en tu álbum.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const isPackDisabled = packs <= 0 || cooldown;

  const generateUniqueId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  };

  return (
    <div className="obtain-packs-container">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="obtain-packs-header">Obtener Sobres</h2>
        <div className="navigation-buttons ms-auto">
          <button className="btn btn-primary me-2" onClick={() => goToPage('/my-album')}>Mi Album</button>
          <button className="btn btn-primary" onClick={() => goToPage('/home')}>Home</button>
        </div>
      </div>
      <div className="row">
        {Array.from({ length: packs }).map((_, index) => (
          <div key={`pack-${index}`} className="col-md-3 mt-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Sobre {index + 1}</h5>
                <button className="btn btn-primary" disabled={isPackDisabled} onClick={openPack}>
                  {isPackDisabled ? 'Cooldown' : 'Abrir Sobre'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {packOpened && (
        <div className="mt-4">
            <h3>Láminas del Sobre Actual:</h3>
            {newLaminas.map((lamina, index) => (
            <div key={`lamina-${index}`} className={`lamina-card ${lamina.categoria === 'Especial' ? 'lamina-especial' : ''}`}>
                <p>{`Lámina ${index + 1}: ${lamina.nombre}`}</p>
                <p>{`Sección: ${lamina.seccion}`}</p>
                <p>{`Categoría: ${lamina.categoria}`}</p>
                {lamina.agregada ? (
                <button className="btn btn-secondary" disabled>Agregada al Álbum</button>
                ) : (
                <button className="btn btn-success" onClick={() => handleAddToAlbum(lamina)}>Agregar al Álbum</button>
                )}
            </div>
            ))}
            {cooldown && (
            <div className="cooldown-container">
                <p className="cooldown-text">
                <strong>Cooldown activo, espera {cooldownTime} segundos antes de abrir otro sobre.</strong>
                </p>
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

export default ObtainPacks;
