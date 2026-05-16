import { useEffect, useRef } from 'react';

/**
 * Parallax effect relative to the element's position in viewport.
 * speed: 0 = no movement, 0.5 = moves at half scroll speed (subtle),
 *        negative values create reverse parallax.
 */
export const useParallax = (speed: number = 0.3) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      // How far the section center is from viewport center
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const offset = (viewportCenter - elementCenter) * speed;
      el.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update(); // run on mount

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [speed]);

  return ref;
};

export const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in-up');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return ref;
};
