import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export default function SplashScreen({ onComplete, duration = 3000 }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 600);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden ${isExiting ? 'pointer-events-none' : 'pointer-events-auto'}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top-left diagonal line */}
        <motion.div
          className="absolute w-96 h-1 bg-gradient-to-r from-red-600 to-transparent"
          initial={{ x: -500, y: -100, rotate: 45 }}
          animate={{ x: 200, y: 100, rotate: 45 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        {/* Bottom-right diagonal line */}
        <motion.div
          className="absolute w-96 h-1 bg-gradient-to-l from-blue-600 to-transparent"
          initial={{ x: 500, y: 500, rotate: -45 }}
          animate={{ x: -200, y: 300, rotate: -45 }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />

        {/* Floating circles */}
        <motion.div
          className="absolute w-40 h-40 rounded-full border-2 border-red-600/20"
          initial={{ x: -200, y: -200, scale: 0 }}
          animate={{ x: 100, y: 50, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />

        <motion.div
          className="absolute w-32 h-32 rounded-full border-2 border-blue-600/20"
          initial={{ x: 400, y: 400, scale: 0 }}
          animate={{ x: -100, y: 200, scale: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut', delay: 0.2 }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo container */}
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Glow effect behind logo */}
          <motion.div
            className="absolute inset-0 blur-2xl bg-red-600/30 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Logo image */}
          <motion.img
            src="/reebok-logo.png"
            alt="Reebok"
            className="h-32 w-auto relative z-10"
            style={{ filter: 'brightness(0) invert(1)' }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <h1 className="text-4xl font-black text-white mb-2">REEBOK KIDS</h1>
          <p className="text-red-600 font-bold tracking-widest uppercase text-sm">
            Performance Meets Play
          </p>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-600"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{
              duration: duration / 1000 - 0.5,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
    </motion.div>
  );
}
