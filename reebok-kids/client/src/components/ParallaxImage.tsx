import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  objectPosition?: string;
}

export default function ParallaxImage({
  src,
  alt,
  speed = 0.3,
  className = '',
  objectPosition = 'center center',
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-10% 0px' });

  /* ── Parallax ─────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const yRange = 120 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-yRange, yRange]);

  /* ── 3-D tilt on mouse move ───────────────────────────── */
  const rotateX = useSpring(useMotionValue(0), { stiffness: 120, damping: 22 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 120, damping: 22 });
  const hoverScale = useSpring(useMotionValue(1), { stiffness: 200, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    rotateY.set(dx * 6);
    rotateX.set(-dy * 6);
    hoverScale.set(1.03);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    hoverScale.set(1);
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ rotateX, rotateY, scale: hoverScale, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Curtain reveal ─────────────────────────────── */}
      <motion.div
        className="absolute inset-0 z-20 bg-black origin-bottom pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={isInView ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        style={{ transformOrigin: 'bottom' }}
      />

      {/* ── Red accent curtain (reveals slightly before) ── */}
      <motion.div
        className="absolute inset-0 z-10 bg-red-600 origin-bottom pointer-events-none"
        initial={{ scaleY: 1 }}
        animate={isInView ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0 }}
        style={{ transformOrigin: 'bottom' }}
      />

      {/* ── Parallax image ─────────────────────────────── */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.12 }}
        animate={isInView ? { scale: 1 + speed * 0.4 } : { scale: 1.12 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ y, objectPosition }}
        className="w-full h-full object-cover origin-center"
      />

      {/* ── Hover shimmer sweep ─────────────────────────── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        initial={{ opacity: 0, backgroundPosition: '-200% 0%' }}
        whileHover={{ opacity: 1, backgroundPosition: '200% 0%' }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        style={{
          background:
            'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.09) 50%, transparent 65%)',
          backgroundSize: '200% 100%',
        }}
      />

      {/* ── Vignette / depth overlay ────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-[5] rounded-2xl"
        style={{ boxShadow: 'inset 0 0 60px rgba(0,0,0,0.4)' }}
      />
    </motion.div>
  );
}
