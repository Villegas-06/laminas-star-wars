import React, { useState, useEffect } from 'react';
import { getFilms, getPeople, getStarships } from '../../services/swapiService';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/obtainpacks.css';

const ObtainPacks: React.FC = () => {
  const [clickLamina, setClickLamina] = useState<number>(0);
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

        const updatedNewLaminas = laminas.map(lamina => {
          const isDuplicate = album.some((item: any) => item.uniqueId === lamina.uniqueId);
          if (isDuplicate) {
            return { ...lamina, agregada: true, descartada: true };
          }
          return lamina;
        });

        setNewLaminas(updatedNewLaminas);

        setClickLamina(prevClicks => prevClicks + 1);

        if (clickLamina === 4) {
          setCooldown(false);
          setCooldownTime(60);
        }

        setCooldown(true);
        setTimeout(() => {
          setCooldown(false);
        }, 60000); // 60 seconds
      } catch (error) {
        console.error('Error al obtener las láminas:', error);
      }
    }
  };

  const generateLaminas = (films: any[], people: any[], starships: any[]) => {
    const laminas: any[] = [];

    const isSpecialFilm = (index: number) => {
      return index < 6; // Los primeros 6 elementos son especiales
    };

    const isSpecialPerson = (index: number) => {
      return index < 20; // Los primeros 20 elementos son especiales
    };

    const isSpecialStarship = (index: number) => {
      return index < 10; // Los primeros 10 elementos son especiales
    };

    const configIndex = Math.floor(Math.random() * 2);

    if (configIndex === 0) {
      const pelicula = getRandomItem(films.filter((_, index) => isSpecialFilm(index)));
      const personajes = getRandomItems(people.filter((_, index) => isSpecialPerson(index)), 3);
      const nave = getRandomItems(starships.filter((_, index) => isSpecialStarship(index)), 1)[0];

      laminas.push(
        { apiId: pelicula.url.split('/').reverse()[0], uniqueId: generateUniqueId(pelicula.title, pelicula.url.split('/').reverse()[0], pelicula.url.split('/').reverse()[1]), nombre: `${pelicula.title}`, seccion: pelicula.url.split('/').reverse()[1], categoria: 'Especial', agregada: false },
        ...personajes.map(personaje => ({ apiId: personaje.url.split('/').reverse()[0], uniqueId: generateUniqueId(personaje.name, personaje.url.split('/').reverse()[0], personaje.url.split('/').reverse()[1]), nombre: `${personaje.name}`, seccion: personaje.url.split('/').reverse()[1], categoria: 'Especial', agregada: false })),
        { apiId: nave.url.split('/').reverse()[0], uniqueId: generateUniqueId(nave.name, nave.url.split('/').reverse()[0], nave.url.split('/').reverse()[1]), nombre: `${nave.name}`, seccion: nave.url.split('/').reverse()[1], categoria: 'Especial', agregada: false }
      );
    } else {
      const personajes = getRandomItems(people, 3);
      const naves = getRandomItems(starships, 2);

      laminas.push(
        ...personajes.map(personaje => ({ apiId: personaje.url.split('/').reverse()[0], uniqueId: generateUniqueId(personaje.name, personaje.url.split('/').reverse()[0], personaje.url.split('/').reverse()[1]), nombre: `${personaje.name}`, seccion: personaje.url.split('/').reverse()[1], categoria: 'Regular', agregada: false })),
        ...naves.map(nave => ({ apiId: nave.url.split('/').reverse()[0], uniqueId: generateUniqueId(nave.name, nave.url.split('/').reverse()[0], nave.url.split('/').reverse()[1]), nombre: `${nave.name}`, seccion: nave.url.split('/').reverse()[1], categoria: 'Regular', agregada: false }))
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
    const actualAlbum = JSON.parse(localStorage.getItem('laminas') || '[]') as any[];

    const isDuplicate = actualAlbum.some((item: any) => item.uniqueId === lamina.uniqueId);

    if (!isDuplicate) {
      const updatedAlbum = [...actualAlbum, lamina];
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
          return { ...l, agregada: true };
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

      // Descartar la lámina
      const updatedNewLaminas = newLaminas.map(l => {
        if (l.uniqueId === lamina.uniqueId) {
          return { ...l, descartada: true };
        }
        return l;
      });
      setNewLaminas(updatedNewLaminas);
    }
  };

  const generateUniqueId = (title: string, number: string, seccion: string) => {
    return number + '_' + title.toLowerCase().slice(0, 2) + '_' + seccion.toLowerCase().slice(0, 2);
  };

  const isPackDisabled = packs <= 0 || cooldown;

  const allLaminasAddedToAlbum = newLaminas.every(lamina => lamina.agregada);

  useEffect(() => {
    if (allLaminasAddedToAlbum) {
      setCooldown(false);
      setCooldownTime(60);
    }
  }, [allLaminasAddedToAlbum]);

  return (
    <div className="obtain-packs-container">
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="obtain-packs-header">Obtener Sobres</h2>
        <div className="navigation-buttons ms-auto">
          <button className="btn btn-primary me-2" onClick={() => goToPage('/my-album')}>
            Mi Album
          </button>
          <button className="btn btn-primary" onClick={() => goToPage('/home')}>
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
                  disabled={isPackDisabled}
                  onClick={openPack}
                >
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
                <>
                  {lamina.descartada ? (
                    <button className="btn btn-danger" disabled>Descartada</button>
                  ) : (
                    <button className="btn btn-success" onClick={() => handleAddToAlbum(lamina)}>Agregar al Álbum</button>
                  )}
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

