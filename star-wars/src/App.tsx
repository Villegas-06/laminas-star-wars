import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeComponent from './components/Home/Home';
import Album from './components/Album/Album';
import ObtainPacks from './components/ObtainPacks/ObtainPacks';

import './App.css';

const App: React.FC = () => {
  // Mock data for album laminas (you should fetch this from API)
  const [albumLaminas, setAlbumLaminas] = useState<any[]>([]);
  
  // Mock functions for handling adding to album and discarding
  const handleAddToAlbum = (lamina: any) => {
    setAlbumLaminas([...albumLaminas, lamina]);
  };

  const handleDiscard = (laminaId: number) => {
    const updatedLaminas = albumLaminas.filter((lamina) => lamina.id !== laminaId);
    setAlbumLaminas(updatedLaminas);
  };

  return (
    <Router>
        <div className="App">
          <Routes>
            <Route path="*" element={<HomeComponent />} />
            <Route
              path="/album"
              element={
                <Album
                  laminas={albumLaminas}
                  handleAddToAlbum={handleAddToAlbum}
                  handleDiscard={handleDiscard}
                />
              }
            />
            <Route path="/obtain-packs" element={<ObtainPacks />} />
          </Routes>
        </div>
    </Router>
  );
};

export default App;
