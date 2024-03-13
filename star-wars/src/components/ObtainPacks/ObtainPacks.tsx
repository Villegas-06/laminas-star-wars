import React, { useState, useEffect } from 'react';
import Album from '../Album/Album';
import { getFilms, getPeople, getStarships } from '../../services/swapiService';

const ObtainPacks: React.FC = () => {
  const [packs, setPacks] = useState<number>(4);
  const [packOpened, setPackOpened] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<boolean>(false);
  const [album, setAlbum] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCooldown(false);
    }, 60000);

    return () => clearTimeout(timer);
  }, [packOpened]);

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

        setAlbum(laminas);
      } catch (error) {
        console.error('Error al obtener las láminas:', error);
      }
    }
  };

  const generateLaminas = (films: any[], people: any[], starships: any[]) => {
    const laminas: any[] = [];

    for (let i = 0; i < 5; i++) {
      let randomItem;
      let category;

      // Determinar aleatoriamente si será película, personaje o nave
      const randomType = Math.random();
      if (randomType < 0.2) {
        randomItem = getRandomItem(films);
        category = "Especial";
      } else if (randomType < 0.5) {
        randomItem = getRandomItem(people);
        category = "Regular";
      } else {
        randomItem = getRandomItem(starships);
        category = "Regular";
      }

      const lamina = {
        id: Math.random(),
        nombre: randomItem?.title || randomItem?.name,
        seccion: getCategorySection(category),
        categoria: category,
        agregada: false,
      };

      laminas.push(lamina);
    }

    return laminas;
  };

  const getRandomItem = (items: any[]) => {
    return items[Math.floor(Math.random() * items.length)];
  };

  const getCategorySection = (category: string) => {
    switch (category) {
      case "Especial":
        return "Películas";
      case "Regular":
        return Math.random() < 0.5 ? "Personajes" : "Naves";
      default:
        return "Desconocida";
    }
  };

  const handleAddToAlbum = (lamina: any) => {
    const isDuplicate = album.some(item => item.id === lamina.id);

    if (!isDuplicate) {
      setAlbum(prevAlbum => [...prevAlbum, lamina]);
    }
  };

  const handleDiscard = (lamina: any) => {
    const updatedAlbum = album.filter(item => item.id !== lamina.id);
    setAlbum(updatedAlbum);
  };

  const isPackDisabled = packs <= 0 || cooldown;

  return (
    <div>
      <h2>Obtain Packs</h2>
      <div>
        {Array.from({ length: packs }).map((_, index) => (
          <div key={index}>
            <h3>Packet of Cards</h3>
            <button disabled={isPackDisabled} onClick={openPack}>
              {isPackDisabled ? 'Cooldown' : 'Open Pack'}
            </button>
          </div>
        ))}
        {packOpened && <p>Opened a pack! Cooldown for 1 minute...</p>}
        {cooldown && <p>Cooldown active, please wait 1 minute before opening another pack.</p>}
      </div>

      {/* Renderizar Album */}
      {album.length > 0 && (
        <Album laminas={album} handleAddToAlbum={handleAddToAlbum} handleDiscard={handleDiscard} />
      )}
    </div>
  );
};

export default ObtainPacks;
