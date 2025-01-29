import { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto
export const WelcomeContext = createContext();

// Proveedor del contexto
export const WelcomeProvider = ({ children }) => {
  const [showWelcome, setShowWelcome] = useState(true);

  // Log para verificar inicialización
  useEffect(() => {
    console.log("WelcomeProvider initialized: showWelcome =", showWelcome);
  }, [showWelcome]);

  return (
    <WelcomeContext.Provider value={{ showWelcome, setShowWelcome }}>
      {children}
    </WelcomeContext.Provider>
  );
};

// Hook para usar el contexto
export const useWelcome = () => {
  const context = useContext(WelcomeContext);
  if (!context) {
    throw new Error("useWelcome debe ser usado dentro de un WelcomeProvider");
  }
  return context;
};
