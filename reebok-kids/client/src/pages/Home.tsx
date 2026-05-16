import { motion } from 'framer-motion';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AnimatedSection from '@/components/AnimatedSection';
import ScrollProgress from '@/components/ScrollProgress';
import SectionDivider from '@/components/SectionDivider';
import ParallaxImage from '@/components/ParallaxImage';
import ContactCTA from '@/components/ContactCTA';
import StatsSection from '@/components/StatsSection';
import Footer from '@/components/Footer';
import { useParallax } from '@/hooks/useParallax';
import { Award, Leaf, Users, Zap } from 'lucide-react';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663467827027/cuhcSEvPaPtt8P6YosLgWU/reebok-hero-kids-updated-Hsuyc6pyxcMveyZB9B48JL.webp';
const LIFESTYLE_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663467827027/cuhcSEvPaPtt8P6YosLgWU/reebok-lifestyle-kids-DqRmUPvJhsHQmHyHBEZbRB.webp';
const PARTNERSHIP_IMAGE = HERO_IMAGE;

const stats = [
  { number: '50+', label: 'Anos de História', description: 'Tradição em calçados e vestuário esportivo' },
  { number: '5K+', label: 'Colaboradores', description: 'Equipe dedicada à excelência' },
  { number: '6+', label: 'Marcas Premium', description: 'Puma, Reebok, Lacoste e mais' },
  { number: '2026', label: 'Lançamento Brasil', description: 'Calçados e Athleisure Reebok Kids' },
];

const highlights = [
  { icon: Zap, title: 'Calçados de Alta Performance', desc: 'Tênis e sneakers desenvolvidos para suportar cada movimento, do playground à quadra.' },
  { icon: Award, title: 'Coleção Athleisure', desc: 'Peças que transitam com estilo entre o esporte e o dia a dia — conforto sem abrir mão do look.' },
  { icon: Leaf, title: 'Materiais Sustentáveis', desc: 'Calçados e roupas produzidos com responsabilidade ambiental e social.' },
  { icon: Users, title: 'Para Todas as Crianças', desc: 'Tamanhos, cores e modelos pensados para cada estilo e cada aventura.' },
];

export default function Home() {
  const separatorParallax = useParallax(0.25);

  return (
    <div className="min-h-screen bg-black">
      <ScrollProgress />
      <Header />

      {/* Hero Section */}
      <HeroSection
        backgroundImage={HERO_IMAGE}
        title="Performance Meets Play"
      />

      {/* Stats Section */}
      <StatsSection
        stats={stats}
        title="Números que Inspiram"
        subtitle="A força da Dilly Sports por trás da Reebok Kids no Brasil"
      />

      {/* About Section */}
      <section id="about" className="py-24 bg-black relative overflow-hidden">
        {/* Background diagonal decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection variant="slideInLeft">
              <div className="accent-line" />
              <h2 className="headline-semibold text-white mb-6">
                Sobre a <span className="text-red-600">Reebok Kids</span>
              </h2>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                A <span className="text-white font-semibold">Reebok Kids</span> une o melhor dos dois mundos: a performance dos{' '}
                <span className="text-red-600 font-semibold">calçados esportivos</span> de alta tecnologia com o conforto e o estilo do{' '}
                <span className="text-red-600 font-semibold">Athleisure</span> — coleções que vão do treino ao passeio sem perder identidade.
              </p>
              <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                Tênis, sneakers e peças Athleisure desenvolvidos para crianças ativas, com amortecimento, respirabilidade e designs que elas amam usar — dentro e fora da quadra. A partir de 2026, toda essa linha chega ao Brasil pela{' '}
                <span className="text-red-600 font-bold">Dilly Sports</span>.
              </p>

              {/* Highlights grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlights.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      className="flex gap-3 p-4 rounded-lg border border-gray-800 hover:border-red-600/50 transition-all duration-300 hover:bg-red-600/5"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
                        <Icon className="text-red-600" size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                        <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatedSection>

            <AnimatedSection variant="slideInRight">
              {/* Aspect-ratio landscape para não cortar a colagem */}
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '4/3' }}>
                {/* Red accent border */}
                <div className="absolute inset-0 rounded-2xl border border-red-600/30 z-10 pointer-events-none" />
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-red-600/20 to-blue-600/10 blur-xl -z-10" />
                <ParallaxImage
                  src={LIFESTYLE_IMAGE}
                  alt="Sobre Reebok Kids"
                  speed={0.2}
                  objectPosition="center 20%"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Diagonal separator with JS parallax (iOS-safe) */}
      <section className="relative h-64 md:h-72 overflow-hidden">
        <div
          ref={separatorParallax}
          className="absolute inset-0 w-full h-[140%] -top-[20%]"
          style={{
            backgroundImage: `url(${HERO_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            willChange: 'transform',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div
          className="absolute top-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to bottom left, #000 50%, transparent 50%)' }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{ background: 'linear-gradient(to top right, #000 50%, transparent 50%)' }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-red-600 font-bold text-sm uppercase tracking-[0.3em] mb-3">
              Calçados · Athleisure · Brasil 2026
            </p>
            <h3 className="headline-semibold text-white">
              Reebok Kids × <span className="text-red-600">Dilly Sports</span>
            </h3>
          </motion.div>
        </div>
      </section>

      {/* Partnership Section */}
      <section id="partnership" className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative z-10">
          <AnimatedSection variant="fadeInUp" className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="accent-line" />
            </div>
            <h2 className="headline-semibold text-white mb-4">
              Parceria <span className="text-red-600">Dilly Sports</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Distribuição de calçados e Athleisure Reebok Kids em todo o Brasil, a partir de 2026, com o respaldo de um dos maiores grupos esportivos do país
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <AnimatedSection variant="slideInLeft">
              <div className="space-y-6">
                {[
                  {
                    title: 'Líder em Calçados Esportivos',
                    body: 'Mais de 50 anos produzindo tênis e calçados de alta performance para as principais marcas do mundo, com P&D em Novo Hamburgo.',
                  },
                  {
                    title: 'Portfólio Athleisure & Sport',
                    body: 'Distribui coleções completas de Athleisure e calçados Reebok, Puma, Lacoste, Mormaii e Öus no varejo brasileiro.',
                  },
                  {
                    title: 'Logística Nacional',
                    body: 'Estrutura com mais de 5.000 colaboradores e cobertura para distribuição de calçados e moda esportiva em todo o Brasil.',
                  },
                  {
                    title: 'Inovação & Sustentabilidade',
                    body: 'Referência em desenvolvimento de calçados com materiais eco-responsáveis e processos produtivos de baixo impacto ambiental.',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    className="flex gap-4 group"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="shrink-0 w-1 bg-gradient-to-b from-red-600 to-blue-600 rounded-full group-hover:w-1.5 transition-all duration-300" />
                    <div className="pl-4">
                      <h3 className="text-white font-bold text-base mb-1 group-hover:text-red-600 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection variant="slideInRight">
              <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '4/3' }}>
                <div className="absolute inset-0 rounded-2xl border border-blue-600/20 z-10 pointer-events-none" />
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-600/10 to-red-600/10 blur-xl -z-10" />
                <ParallaxImage
                  src={PARTNERSHIP_IMAGE}
                  alt="Reebok Classic Leather — Parceria Dilly Sports"
                  speed={0.2}
                  objectPosition="center 35%"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <SectionDivider variant="wave" className="my-0" />

      {/* Contact Section */}
      <ContactCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
