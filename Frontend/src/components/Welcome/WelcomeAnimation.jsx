import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function WelcomeAnimation({ userName, onComplete, duration = 3000 }) { // Aumenta el tiempo de duración
  const [showUserName, setShowUserName] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUserName(true);
    }, 1000); // Muestra el nombre después de 3 segundos
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, duration]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }} // Transición más suave
    >
      <motion.div
        className="text-white text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.7 }} // Transición más larga al desmontar
      >
        <motion.h1
          className="text-4xl font-bold mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          exit={{ y: 20 }}
          transition={{ delay: 0.2 }}
        >
          Bienvenido a tu portal académico
        </motion.h1>
        {showUserName && (
          <motion.p
            className="text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {userName}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
