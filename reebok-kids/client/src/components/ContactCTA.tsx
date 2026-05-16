import { motion } from 'framer-motion';
import { Mail, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Official WhatsApp logo SVG
function WhatsAppIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="24" cy="24" r="24" fill="#25D366" />
      <path
        d="M34.5 13.4A14.7 14.7 0 0 0 24 9C16.3 9 10 15.3 10 23c0 2.5.7 4.9 1.9 7L10 39l9.3-1.9A14.9 14.9 0 0 0 24 38.1c7.7 0 14-6.3 14-14 0-3.7-1.5-7.2-3.5-10.7zM24 35.7c-2.2 0-4.3-.6-6.1-1.6l-.4-.3-4.4.9.9-4.3-.3-.5A12.3 12.3 0 0 1 11.7 23c0-6.8 5.5-12.3 12.3-12.3 3.3 0 6.4 1.3 8.7 3.6A12.2 12.2 0 0 1 36.3 23c0 6.8-5.5 12.3-12.3 12.3zm6.7-9.2c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.2-.8 0-.4-.2-1.6-.6-3-1.9-1.1-1-1.8-2.2-2-2.6-.2-.4 0-.6.2-.7l.7-.8c.1-.2.2-.4.3-.6.1-.2 0-.4 0-.6-.1-.2-.8-1.9-1.1-2.6-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.3 3.4 1.4 3.6.2.2 2.6 4 6.3 5.6.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.8.3-1.6.2-1.7-.1-.1-.3-.2-.7-.4z"
        fill="white"
      />
    </svg>
  );
}

export default function ContactCTA() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Grava no Notion via Netlify Function
    try {
      await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch {
      // silencioso — não bloqueia o fluxo principal
    }

    // 2. Abre WhatsApp com a mensagem pré-preenchida
    const phoneNumber = '5543998232565';
    const message = `*Novo Contato - Reebok Kids*\n\n*Nome:* ${formData.name}\n*Email:* ${formData.email}\n*Empresa:* ${formData.company}\n*Mensagem:* ${formData.message}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');

    toast.success('Mensagem enviada com sucesso!', {
      description: 'Registrado no Notion e WhatsApp aberto.',
      duration: 4000,
    });
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const contacts = [
    {
      custom: true,
      title: 'WhatsApp',
      value: '(43) 9.9823-2565',
      href: 'https://wa.me/5543998232565',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'romaniolo.rep@gmail.com',
      href: 'mailto:romaniolo.rep@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Área de Atuação',
      value: 'Norte e Noroeste do Paraná',
      href: 'https://maps.google.com/?q=Norte+Noroeste+Parana+Brasil',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="container">
        <motion.div
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Header */}
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <div className="flex justify-center mb-4">
              <div className="accent-line" />
            </div>
            <h2 className="headline-semibold text-white mb-4">Vamos Conversar</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Interessado em calçados e Athleisure Reebok Kids no seu ponto de venda? Fale com a gente!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
            {contacts.map((contact, index) => {
              const Icon = !contact.custom ? (contact as any).icon : null;
              const isWa = contact.custom;
              return (
                <motion.a
                  key={index}
                  href={contact.href}
                  target={isWa ? '_blank' : undefined}
                  rel={isWa ? 'noopener noreferrer' : undefined}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative group flex flex-col items-center gap-4 px-6 py-8 rounded-2xl overflow-hidden border border-white/5 bg-white/[0.03] hover:border-white/15 transition-colors duration-300"
                >
                  {/* subtle glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                    style={{
                      background: isWa
                        ? 'radial-gradient(ellipse at 50% 0%, rgba(37,211,102,0.12) 0%, transparent 70%)'
                        : 'radial-gradient(ellipse at 50% 0%, rgba(227,27,55,0.1) 0%, transparent 70%)',
                    }}
                  />

                  {/* icon */}
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    className="relative z-10 flex items-center justify-center w-14 h-14 rounded-xl"
                    style={{
                      background: isWa
                        ? 'rgba(37,211,102,0.12)'
                        : 'rgba(227,27,55,0.1)',
                    }}
                  >
                    {isWa
                      ? <WhatsAppIcon size={26} />
                      : <Icon size={22} className="text-red-500" />
                    }
                  </motion.div>

                  {/* text */}
                  <div className="relative z-10 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1 font-semibold">
                      {contact.title}
                    </p>
                    <p className="text-white text-sm font-medium group-hover:text-white/90 transition-colors leading-snug">
                      {contact.value}
                    </p>
                  </div>

                  {/* bottom accent line */}
                  <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full"
                    style={{
                      background: isWa ? '#25D366' : '#e31b37',
                      width: 0,
                    }}
                    whileHover={{ width: '60%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              );
            })}
          </div>

          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="card-elevated p-8"
            variants={itemVariants}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <motion.div variants={itemVariants}>
                <label className="block text-white font-semibold mb-2 uppercase tracking-wider text-sm">
                  Nome
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="Seu nome"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-white font-semibold mb-2 uppercase tracking-wider text-sm">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                  placeholder="seu@email.com"
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-white font-semibold mb-2 uppercase tracking-wider text-sm">
                Empresa
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors"
                placeholder="Sua empresa"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label className="block text-white font-semibold mb-2 uppercase tracking-wider text-sm">
                Mensagem
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition-colors resize-none"
                placeholder="Conte-nos mais sobre seu interesse..."
              />
            </motion.div>

            <motion.button
              type="submit"
              className="button-primary flex items-center gap-2 w-full justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              <Send size={20} />
              Enviar Mensagem
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
