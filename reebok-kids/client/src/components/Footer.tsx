import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

export default function Footer() {
  const navLinks = [
    { label: 'Início', href: '#home' },
    { label: 'Sobre', href: '#about' },
    { label: 'Parceria', href: '#partnership' },
    { label: 'Contato', href: '#contact' },
  ];

  return (
    <footer className="bg-black border-t border-red-600/30">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand — Reebok Kids */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <img
                src="/reebok-logo.png"
                alt="Reebok"
                className="h-8 w-auto"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
              <span
                className="text-red-600 font-black text-sm tracking-[0.2em] uppercase"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Kids
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Calçados e Athleisure de alta performance para crianças ativas.
              Operação sob licença da{' '}
              <span className="text-white font-semibold">Dilly Sports</span>.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs">
              Navegação
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-red-600 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato — dados reais */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-xs">
              iBrand Gestão de Marcas Ltda
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <a
                    href="https://wa.me/5543998232565"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-red-600 transition-colors text-sm block"
                  >
                    (43) 9.9823-2565
                  </a>
                  <span className="text-gray-600 text-xs">WhatsApp</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-red-600 shrink-0 mt-0.5" />
                <a
                  href="mailto:romaniolo.rep@gmail.com"
                  className="text-gray-300 hover:text-red-600 transition-colors text-sm break-all"
                >
                  romaniolo.rep@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Instagram size={15} className="text-red-600 shrink-0 mt-0.5" />
                <a
                  href="https://instagram.com/rubinho_Ibrand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-red-600 transition-colors text-sm"
                >
                  @rubinho_Ibrand
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-red-600 shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Norte e Noroeste do Paraná</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">
              &copy; 2026 Reebok Kids Brasil. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
