import { Home } from 'lucide-react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-red-600 font-black text-8xl md:text-9xl mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            404
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-12 h-0.5 bg-red-600 mx-auto mb-6" />
          <h2 className="text-white text-2xl font-bold mb-3">Página não encontrada</h2>
          <p className="text-gray-400 mb-10 max-w-sm mx-auto">
            A página que você procura não existe ou foi removida.
          </p>

          <button
            onClick={() => setLocation('/')}
            className="button-primary inline-flex items-center gap-2"
          >
            <Home size={18} />
            Voltar ao início
          </button>
        </motion.div>
      </div>
    </div>
  );
}
