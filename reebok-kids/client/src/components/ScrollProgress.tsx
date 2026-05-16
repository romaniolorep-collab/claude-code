import { motion } from 'framer-motion';
import { useScrollProgress } from '@/hooks/useScrollAnimation';

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 z-50 origin-left"
      style={{
        scaleX: progress / 100,
      }}
      initial={{ scaleX: 0 }}
      transition={{ duration: 0 }}
    />
  );
}
