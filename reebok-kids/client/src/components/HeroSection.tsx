import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useParallax } from '@/hooks/useParallax';
import { ChevronDown } from 'lucide-react';
import { useEffect } from 'react';

interface HeroSectionProps {
  backgroundImage: string;
  title: string;
}

// Diagonal speed lines — loop continuously
const lines = [
  { x1: 0,   y1: 30,  x2: 100, y2: 10,  dur: 3.2, delay: 0    },
  { x1: 0,   y1: 55,  x2: 100, y2: 35,  dur: 4.0, delay: 0.6  },
  { x1: 0,   y1: 80,  x2: 100, y2: 60,  dur: 3.6, delay: 1.2  },
  { x1: 0,   y1: 15,  x2: 100, y2: 70,  dur: 5.0, delay: 0.3  },
  { x1: 20,  y1: 0,   x2: 80,  y2: 100, dur: 4.4, delay: 0.9  },
  { x1: 60,  y1: 0,   x2: 20,  y2: 100, dur: 3.8, delay: 1.5  },
];

export default function HeroSection({ backgroundImage, title }: HeroSectionProps) {
  const parallaxRef = useParallax(0.5);
  const titleWords = title.split(' ');

  // Ken Burns — slow zoom on background
  const scale = useMotionValue(1.08);
  useEffect(() => {
    const ctrl = animate(scale, 1, {
      duration: 8,
      ease: 'easeOut',
      repeat: Infinity,
      repeatType: 'reverse',
      repeatDelay: 0,
    });
    return ctrl.stop;
  }, [scale]);

  return (
    <section
      id="home"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Ken Burns + Parallax Background */}
      <motion.div
        ref={parallaxRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          willChange: 'transform',
          scale,
        }}
      />

      {/* Dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/80" />

      {/* Red vignette bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-red-950/50 via-transparent to-transparent" />

      {/* Looping diagonal speed lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {lines.map((l, i) => (
          <motion.line
            key={i}
            x1={`${l.x1}%`} y1={`${l.y1}%`}
            x2={`${l.x2}%`} y2={`${l.y2}%`}
            stroke="rgba(227,27,55,0.18)"
            strokeWidth="0.12"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity:    [0, 0.7, 0.3, 0],
            }}
            transition={{
              duration: l.dur,
              delay: l.delay,
              repeat: Infinity,
              repeatDelay: l.dur * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}
      </svg>

      {/* Pulsing red glow — bottom center */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(227,27,55,0.35) 0%, transparent 70%)',
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Scanning light sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['-100% 0%', '200% 0%'] }}
        transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
      />

      {/* Left accent bar */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-red-600 to-transparent"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      />

      {/* Title */}
      <div className="relative z-10 container text-center text-white px-6 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="headline-bold text-white leading-none break-words">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-2 md:mr-4"
                initial={{ opacity: 0, y: 40, skewX: -3 }}
                animate={{ opacity: 1, y: 0, skewX: 0 }}
                transition={{ duration: 0.7, delay: 0.9 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {i === 1 ? <span className="text-red-600">{word}</span> : word}
              </motion.span>
            ))}
          </h1>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-white/40 text-xs uppercase tracking-[0.25em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="text-red-600" size={18} />
        </motion.div>
      </motion.div>

      {/* Bottom diagonal cut */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom right, transparent 49.9%, #000 50%)' }}
      />

      {/* ── Cinematic letterbox bars ─────────────────────────
          Animate in like a cinema screen opening, then hold.
          Positioned inside hero only — never block page content. */}
      <motion.div
        className="absolute top-0 left-0 right-0 bg-black z-30 pointer-events-none origin-top"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 1 }}
        style={{ height: '7vh' }}
      >
        {/* Subtle film strip perforations */}
        <div className="absolute inset-y-0 right-4 flex flex-col justify-evenly gap-1 opacity-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-2 h-3 rounded-sm bg-white/30" />
          ))}
        </div>
        <div className="absolute inset-y-0 left-4 flex flex-col justify-evenly gap-1 opacity-20">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-2 h-3 rounded-sm bg-white/30" />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-black z-30 pointer-events-none"
        style={{ height: '7vh' }}
      />
    </section>
  );
}
