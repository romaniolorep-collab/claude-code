import { motion } from 'framer-motion';

interface CaseStudyProps {
  title: string;
  description: string;
  image: string;
  category: string;
  results: string[];
  index?: number;
}

export default function CaseStudy({
  title,
  description,
  image,
  category,
  results,
  index = 0,
}: CaseStudyProps) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16 group"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, margin: '-100px' }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Image */}
      <motion.div
        className={`relative h-96 overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl group-hover:shadow-red-600/30 transition-all duration-300 ${isEven ? '' : 'order-2'}`}
        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05, rotateZ: 1 }}
      >
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
        />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-red-600/20 group-hover:to-transparent transition-all duration-300" 
          whileHover={{ opacity: 0.8 }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className={isEven ? '' : 'order-1'}
        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <motion.span
          className="badge-primary inline-block mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.1 }}
        >
          {category}
        </motion.span>

        <h3 className="headline-semibold text-white mb-4 group-hover:text-red-600 transition-colors duration-300">{title}</h3>

        <p className="text-gray-300 text-lg mb-6 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </p>

        <motion.div
          className="space-y-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h4 className="text-white font-bold uppercase tracking-wider text-sm">
            Resultados
          </h4>
          {results.map((result, i) => (
            <motion.div
              key={i}
              className="flex items-start gap-3 group-hover:translate-x-1 transition-transform duration-300"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0 group-hover:bg-red-500 transition-colors" 
                whileHover={{ scale: 1.5 }}
              />
              <span className="text-gray-300 group-hover:text-gray-100 transition-colors duration-300">{result}</span>
            </motion.div>
          ))}
        </motion.div>


      </motion.div>
    </motion.div>
  );
}
