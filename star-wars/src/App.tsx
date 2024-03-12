import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginComponent from './components/Login/Login';
import HomeComponent from './components/Home/Home';
import { useAuth } from './auth/authProvider';

const App: React.FC = () => {
  const { isLoggedIn, login, logout } = useAuth();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginComponent onLogin={login} />} />
          <Route path="/home" element={<HomeComponent />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
