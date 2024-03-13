import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeComponent from './components/Home/Home';
import AlbumSection from './components/Album/MyAlbum';
import ObtainPacks from './components/ObtainPacks/ObtainPacks';

import './App.css';

const App: React.FC = () => {

  return (
    <Router>
        <div className="App">
          <Routes>
            <Route path="*" element={<HomeComponent />} />
            <Route path="/obtain-packs" element={<ObtainPacks />} />
            <Route path="/my-album" element={<AlbumSection />} />
          </Routes>
        </div>
    </Router>
  );
};

export default App;
