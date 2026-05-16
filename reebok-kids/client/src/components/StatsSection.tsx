import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Stat {
  number: string;
  label: string;
  description?: string;
}

interface StatsSectionProps {
  stats: Stat[];
  title?: string;
  subtitle?: string;
}

function parseStatNumber(raw: string): { value: number; suffix: string; prefix: string } {
  const prefix = raw.match(/^[^0-9]*/)?.[0] ?? '';
  const suffix = raw.match(/[^0-9]+$/)?.[0] ?? '';
  const value = parseInt(raw.replace(/\D/g, ''), 10) || 0;
  return { value, suffix, prefix };
}

function AnimatedCounter({ raw, isVisible }: { raw: string; isVisible: boolean }) {
  const { value, suffix, prefix } = parseStatNumber(raw);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [display, setDisplay] = useState(prefix + '0' + suffix);
  const hasRun = useRef(false);

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplay(prefix + v + suffix));
    return unsub;
  }, [rounded, prefix, suffix]);

  useEffect(() => {
    if (isVisible && !hasRun.current) {
      hasRun.current = true;
      animate(count, value, { duration: 2, ease: [0.16, 1, 0.3, 1] });
    }
  }, [isVisible, count, value]);

  return <span>{display}</span>;
}

export default function StatsSection({ stats, title, subtitle }: StatsSectionProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="py-20 bg-gradient-to-r from-red-700 via-red-600 to-red-700 relative overflow-hidden">
      {/* Animated background shimmer */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.6) 50%, transparent 60%)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
      />

      <div className="container relative z-10">
        {(title || subtitle) && (
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {title && <h2 className="headline-semibold text-white mb-3">{title}</h2>}
            {subtitle && <p className="text-white/80 text-lg">{subtitle}</p>}
          </motion.div>
        )}

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Number */}
              <div className="text-5xl md:text-6xl font-black text-white mb-3 tabular-nums leading-none"
                style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.04em', fontSize: 'clamp(3rem,6vw,4rem)' }}
              >
                <AnimatedCounter raw={stat.number} isVisible={isVisible} />
              </div>

              {/* Accent line */}
              <motion.div
                className="h-0.5 bg-white/30 mx-auto mb-3 rounded-full"
                initial={{ width: 0 }}
                animate={isVisible ? { width: '40px' } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 + 0.4 }}
              />

              <p className="text-white/90 font-bold uppercase tracking-wider text-xs mb-1">
                {stat.label}
              </p>
              {stat.description && (
                <p className="text-white/60 text-xs leading-relaxed">{stat.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
