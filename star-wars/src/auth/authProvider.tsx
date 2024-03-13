import React, { createContext, useContext, useState, useEffect } from 'react';
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

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already logged in (persist state)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password: string) => {
    const foundUser = usersData.users.find(
      (user) => user.username === username && user.password === password
    );

    if (foundUser) {
      const userWithoutPassword: Partial<User> = { ...foundUser };
      delete userWithoutPassword.password; // Remove the 'password' field
      setUser(userWithoutPassword as User); // Cast to User
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
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
    localStorage.removeItem('user');
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
