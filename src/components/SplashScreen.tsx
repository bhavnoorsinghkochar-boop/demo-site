import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const { restaurantSettings } = useApp();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400); // give time for fade-out
    }, 1900);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => {
            setVisible(false);
            setTimeout(onComplete, 300);
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#143627] text-[#FAF7F2] cursor-pointer"
        >
          {/* Subtle Leaf Decorative Pattern in Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#FAF7F2_1px,transparent_1px)] [background-size:16px_16px]" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center text-center px-6 relative z-10"
          >
            {/* Logo Icon Motif */}
            <div className="w-20 h-20 mb-5 rounded-3xl bg-gradient-to-br from-[#1B4D36] to-[#2E7D58] p-1 shadow-2xl flex items-center justify-center border border-[#74C69D]/30">
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 text-[#FAF7F2] animate-pulse"
              >
                <path
                  d="M18 4C9.5 4 4 11 4 19.5C4 28 11.5 32 18 32C24.5 32 32 28 32 19.5C32 11 26.5 4 18 4Z"
                  fill="#1B4D36"
                />
                <path
                  d="M18 6C25 12 28 18 28 22C28 26 23.5 29 18 29C12.5 29 8 26 8 22C8 18 11 12 18 6Z"
                  fill="#74C69D"
                />
                <path
                  d="M18 7V28M18 13C21 15 24 16 26 16M18 17C14 19 11 19 9 20M18 21C22 22 25 22 26 23"
                  stroke="#FAF7F2"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-widest text-[#FAF7F2] drop-shadow-md uppercase">
              {restaurantSettings.name}
            </h1>

            <p className="mt-2 text-sm sm:text-base font-semibold tracking-widest uppercase text-[#C69234]">
              {restaurantSettings.subtitle}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs text-red-200/90 font-medium">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
              <span>Taste Of Singapore · {restaurantSettings.location}</span>
            </div>

            {/* Small animated loading bar */}
            <div className="mt-8 w-32 h-1 bg-[#1B4D36] rounded-full overflow-hidden">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-full h-full bg-[#C69234]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
