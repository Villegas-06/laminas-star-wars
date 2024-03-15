import React, { useState, useEffect } from 'react';
import { getFilms, getPeople, getStarships } from '../../services/swapiService';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/obtainpacks.css';
import { useCooldown } from '../Context/CooldownContext';

const ObtainPacks: React.FC = () => {
  const [packOpened, setPackOpened] = useState<boolean>(false);
  const [newLaminas, setNewLaminas] = useState<any[]>([]);
  const [album, setAlbum] = useState<any[]>([]);
  const navigate = useNavigate();
  const {
    cooldown,
    setCooldown,
    cooldownTime,
    setCooldownTime,
    packs,
    setPacks,
    isObtainPacksMounted,
    setIsObtainPacksMounted,
  } = useCooldown();

  useEffect(() => {
    const storedLaminas = localStorage.getItem('laminas');
    if (storedLaminas) {
      setAlbum(JSON.parse(storedLaminas));
    }
  }, []);

  useEffect(() => {
    setIsObtainPacksMounted(true);

    // Restore state from localStorage if available
    const storedCooldown = localStorage.getItem('cooldown');
    const storedCooldownTime = localStorage.getItem('cooldownTime');
    const storedPacks = localStorage.getItem('packs');

    if (storedCooldown && storedCooldownTime && storedPacks && isObtainPacksMounted) {
      setCooldown(JSON.parse(storedCooldown));
      setCooldownTime(JSON.parse(storedCooldownTime));
      setPacks(JSON.parse(storedPacks));
    }

    return () => {
      setIsObtainPacksMounted(false);
    };
  }, [setCooldown, setCooldownTime, setPacks, isObtainPacksMounted]);

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

    return () => {
      clearTimeout(timer);
    };
  }, [cooldown, cooldownTime, setCooldownTime]);

  const timeLeft = () => {
    const minutes = Math.floor(cooldownTime / 60);
    const seconds = cooldownTime % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const goToPage = (path: string) => {
    navigate(path);
  };

  const openPack = async () => {
    if (packs > 0 && !cooldown) {
      setPackOpened(true);
      setPacks((prevPacks: number) => prevPacks - 1);
      setCooldown(true);

      try {
        const films = await getFilms();
        const people = await getPeople();
        const starships = await getStarships();

        const laminas = generateLaminas(films, people, starships);

        const updatedNewLaminas = laminas.map(lamina => {
          const isDuplicate = album.some((item: any) => item.uniqueId === lamina.uniqueId);
          if (isDuplicate) {
            return { ...lamina, agregada: true, descartada: true };
          }
          return lamina;
        });

        setNewLaminas(updatedNewLaminas);

        if (updatedNewLaminas.every(lamina => lamina.agregada || lamina.descartada)) {
          setCooldown(false);
          setCooldownTime(60);
          localStorage.setItem('laminas', JSON.stringify([...album, ...updatedNewLaminas]));
        } else {
          setCooldown(true);
        }
      } catch (error) {
        console.error('Error al obtener las láminas:', error);
      }
    }
  };

  const generateLaminas = (films: any[], people: any[], starships: any[]) => {
    const laminas: any[] = [];
  
    // Filtrar las láminas especiales
    const specialFilms = films.slice(0, 6);
    const specialPeople = people.slice(0, 20);
    const specialStarships = starships.slice(0, 10);
  
    // Configuración aleatoria de sobre
    const configIndex = Math.floor(Math.random() * 2);
  
    if (configIndex === 0) {
      // Primera configuración: 1 película especial, 3 personajes especiales y 1 nave especial
      const peliculaEspecial = getRandomItem(specialFilms);
      const personajesEspeciales = getRandomItems(specialPeople, 3);
      const naveEspecial = getRandomItem(specialStarships);
  
      laminas.push(
        createLamina(peliculaEspecial, 'Especial'),
        ...personajesEspeciales.map(personaje => createLamina(personaje, 'Especial')),
        createLamina(naveEspecial, 'Especial')
      );
    } else {
      // Segunda configuración: 3 personajes regulares y 2 naves regulares
      const personajesRegulares = getRandomItems(people.slice(20), 3);
      const navesRegulares = getRandomItems(starships.slice(10), 2);
  
      laminas.push(
        ...personajesRegulares.map(personaje => createLamina(personaje, 'Regular')),
        ...navesRegulares.map(nave => createLamina(nave, 'Regular'))
      );
    }
  
    return laminas;
  };
  
  const createLamina = (item: any, categoria: string) => {
    return {
      apiId: item.url.split('/').reverse()[0],
      uniqueId: generateUniqueId(item.name || item.title, item.url.split('/').reverse()[0], item.url.split('/').reverse()[1]),
      nombre: `${item.name || item.title}`,
      seccion: item.url.split('/').reverse()[1],
      categoria: categoria,
      agregada: false
    };
  };
  
  const getRandomItem = (items: any[]) => {
    return items[Math.floor(Math.random() * items.length)];
  };
  
  const getRandomItems = (items: any[], count: number) => {
    const shuffled = items.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const handleAddToAlbum = (lamina: any) => {
    const isDuplicate = album.some((item: any) => item.uniqueId === lamina.uniqueId);

    if (!isDuplicate) {
      const updatedAlbum = [...album, lamina];
      setAlbum(updatedAlbum);

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
          return { ...l, agregada: true, descartada: false };
        }
        return l;
      });
      setNewLaminas(updatedNewLaminas);

      localStorage.setItem('laminas', JSON.stringify(updatedAlbum));
    } else {
      toast.error('Esta lámina ya está en tu álbum. Descartando...', {
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
          return { ...l, descartada: true, agregada: false };
        }
        return l;
      });
      setNewLaminas(updatedNewLaminas);
    }
  };

  const generateUniqueId = (title: string, number: string, seccion: string) => {
    return number + '_' + title.toLowerCase().slice(0, 2) + '_' + seccion.toLowerCase().slice(0, 2);
  };

  const isPackReadyToOpen = newLaminas.every(lamina => lamina.agregada || lamina.descartada);

  useEffect(() => {
    if (isPackReadyToOpen) {
      setCooldown(false);
      setCooldownTime(60);
      setPackOpened(false);
    }
  }, [isPackReadyToOpen, setCooldown, setCooldownTime]);

  return (
    <div className="obtain-packs-container">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="obtain-packs-header">Obtener Sobres</h2>
        <div className="navigation-buttons ms-auto">
          <button className="btn btn-primary me-2" onClick={() => navigate('/my-album')}>
            Mi Album
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/home')}>
            Home
          </button>
        </div>
      </div>
      <div className="row">
        {Array.from({ length: packs }).map((_, index) => (
          <div key={`pack-${index}`} className="col-md-3 mt-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Sobre {index + 1}</h5>
                <button
                  className="btn btn-primary"
                  disabled={cooldown || packs <= 0}
                  onClick={openPack}
                >
                  {cooldown ? `Cooldown: ${cooldownTime}s` : 'Abrir Sobre'}
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
            <div
              key={`lamina-${index}`}
              className={`lamina-card ${lamina.categoria === 'Especial' ? 'lamina-especial' : ''}`}
            >
              <p>{`Lámina ${index + 1}: ${lamina.nombre}`}</p>
              <p>{`Sección: ${lamina.seccion}`}</p>
              <p>{`Categoría: ${lamina.categoria}`}</p>
              {lamina.agregada ? (
                <button className="btn btn-success" disabled>
                  Agregada al Álbum
                </button>
              ) : lamina.descartada ? (
                <button className="btn btn-danger" disabled>
                  Descartada
                </button>
              ) : (
                <>
                  <button className="btn btn-success" onClick={() => handleAddToAlbum(lamina)}>
                    Agregar al Álbum
                  </button>
                </>
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