import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PageReveal() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Bottom panel — exits first (slides down) */}
          <motion.div
            className="fixed inset-0 z-[9999] bg-black origin-bottom"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{}}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />

          {/* Red accent panel — exits slightly after */}
          <motion.div
            className="fixed inset-0 z-[9998] bg-red-600 origin-bottom"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{}}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0 }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
