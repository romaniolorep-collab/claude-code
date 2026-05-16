import { motion } from 'framer-motion';

interface SectionDividerProps {
  variant?: 'line' | 'wave' | 'dots';
  className?: string;
}

export default function SectionDivider({
  variant = 'line',
  className = '',
}: SectionDividerProps) {
  if (variant === 'line') {
    return (
      <motion.div
        className={`h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent ${className}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: '-100px' }}
      />
    );
  }

  if (variant === 'wave') {
    return (
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className={`w-full h-24 fill-red-600/10 ${className}`}
      >
        <motion.path
          d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        />
      </svg>
    );
  }

  return (
    <motion.div
      className={`flex justify-center gap-2 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-red-600 rounded-full"
          animate={{ scale: [1, 1.5, 1] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
}
