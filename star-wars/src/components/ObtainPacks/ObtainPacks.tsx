import React, { useState, useEffect } from 'react';
import { getFilms, getPeople, getStarships } from '../../services/swapiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ObtainPacks: React.FC = () => {
  const [packs, setPacks] = useState<number>(4);
  const [packOpened, setPackOpened] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<boolean>(false);
  const [newLaminas, setNewLaminas] = useState<any[]>([]);
  const [allLaminas, setAllLaminas] = useState<any[]>([]);
  const [album, setAlbum] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCooldown(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, [packOpened]);

  useEffect(() => {
    const storedLaminas = localStorage.getItem('laminas');
    if (storedLaminas) {
      setAllLaminas(JSON.parse(storedLaminas));
    }
  }, []);

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

        const filteredLaminas = laminas.filter(lamina => !album.some(a => a.uniqueId === lamina.uniqueId));

        const updatedLaminas = [...allLaminas, ...filteredLaminas];
        setAllLaminas(updatedLaminas);
        localStorage.setItem('laminas', JSON.stringify(updatedLaminas));
      } catch (error) {
        console.error('Error al obtener las láminas:', error);
      }
    }
  };

  const generateLaminas = (films: any[], people: any[], starships: any[]) => {
    const laminas: any[] = [];

    const configIndex = Math.floor(Math.random() * 2);

    if (configIndex === 0) {
      const pelicula = getRandomItem(films);
      const personajes = getRandomItems(people, 3);
      const nave = getRandomItems(starships, 1)[0];

      laminas.push(
        { uniqueId: generateUniqueId(), nombre: pelicula.title, seccion: 'Películas', categoria: 'Especial', agregada: false },
        ...personajes.map(personaje => ({ uniqueId: generateUniqueId(), nombre: personaje.name, seccion: 'Personajes', categoria: 'Regular', agregada: false })),
        { uniqueId: generateUniqueId(), nombre: nave.name, seccion: 'Naves', categoria: 'Regular', agregada: false }
      );
    } else {
      const personajes = getRandomItems(people, 3);
      const naves = getRandomItems(starships, 2);

      laminas.push(
        ...personajes.map(personaje => ({ uniqueId: generateUniqueId(), nombre: personaje.name, seccion: 'Personajes', categoria: 'Regular', agregada: false })),
        ...naves.map(nave => ({ uniqueId: generateUniqueId(), nombre: nave.name, seccion: 'Naves', categoria: 'Regular', agregada: false }))
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

      const updatedNewLaminas = newLaminas.filter(l => l.uniqueId !== lamina.uniqueId);
      setNewLaminas(updatedNewLaminas);
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
    <div>
      <h2>Obtener Sobres</h2>
      <div>
        {Array.from({ length: packs }).map((_, index) => (
          <div key={`pack-${index}`}>
            <h3>Sobre {index + 1}</h3>
            <button disabled={isPackDisabled} onClick={openPack}>
              {isPackDisabled ? 'Cooldown' : 'Abrir Sobre'}
            </button>
          </div>
        ))}
        {packOpened && (
          <div>
            <h3>Láminas del Sobre Actual:</h3>
            {newLaminas.map((lamina, index) => (
              <div key={`lamina-${index}`}>
                <p>{`Lámina ${index + 1}: ${lamina.nombre}`}</p>
                <p>{`Sección: ${lamina.seccion}`}</p>
                <p>{`Categoría: ${lamina.categoria}`}</p>
                {lamina.agregada ? (
                  <button disabled>Agregada al Álbum</button>
                ) : (
                  <button onClick={() => handleAddToAlbum(lamina)}>Agregar al Álbum</button>
                )}
              </div>
            ))}
            {cooldown && <p>Cooldown activo, espera 1 minuto antes de abrir otro sobre.</p>}
          </div>
        )}
      </div>

      <div>
        <h2>Mi Álbum</h2>
        {album.map((lamina, index) => (
          <div key={`album-lamina-${index}`}>
            <p>{`Lámina ${index + 1}: ${lamina.nombre}`}</p>
            <p>{`Sección: ${lamina.seccion}`}</p>
            <p>{`Categoría: ${lamina.categoria}`}</p>
          </div>
        ))}
      </div>

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
