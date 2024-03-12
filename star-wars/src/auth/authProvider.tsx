// AuthProvider.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import usersData from '../data/users.json';
import Swal from 'sweetalert2';

type User = {
  username: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string) => {
    const foundUser = usersData.users.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      setUser(foundUser);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Usuario o contraseña incorrectos',
        text: 'Revisa tus credenciales',
        confirmButtonText: 'Ok',
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isLoggedIn = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
