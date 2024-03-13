import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/Login/Login';
import RegisterComponent from './components/Register/Register';
import HomeComponent from './components/Home/Home';
import AuthProvider, { useAuth } from './auth/authProvider';
import NotFound from './components/NotFound/NotFound';

import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginComponent />} />
            <Route path="/register" element={<RegisterComponent />} />
            <Route path="/home" element={<ProtectedRoute />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

const ProtectedRoute: React.FC = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return <HomeComponent />;
};

export default App;
