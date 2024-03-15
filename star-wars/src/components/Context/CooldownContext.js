import React, { createContext, useContext, useState, useEffect } from 'react';

const CooldownContext = createContext();

export const CooldownProvider = ({ children }) => {
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(60);
  const [packs, setPacks] = useState(4);
  const [isObtainPacksMounted, setIsObtainPacksMounted] = useState(false);

  // Almacenar en localStorage cuando el cooldown o los packs cambien
  useEffect(() => {
    localStorage.setItem('cooldown', JSON.stringify(cooldown));
    localStorage.setItem('cooldownTime', JSON.stringify(cooldownTime));
    localStorage.setItem('packs', JSON.stringify(packs));
  }, [cooldown, cooldownTime, packs]);

  return (
    <CooldownContext.Provider
      value={{
        cooldown,
        setCooldown,
        cooldownTime,
        setCooldownTime,
        packs,
        setPacks,
        isObtainPacksMounted,
        setIsObtainPacksMounted,
      }}
    >
      {children}
    </CooldownContext.Provider>
  );
};

export const useCooldown = () => {
  const context = useContext(CooldownContext);
  if (!context) {
    throw new Error('useCooldown must be used within a CooldownProvider');
  }
  return context;
};
