// ── Single-page scroll App ────────────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#a3d800",
  "showTechOverlay": true,
  "backgroundTexture": false
}/*EDITMODE-END*/;

function App() {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen]             = React.useState(false);
  const [t, setTweak]           = useTweaks(TWEAK_DEFAULTS);
  const [activeSection, setActiveSection] = React.useState('hero');
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [activeCategory, setActiveCategory]   = React.useState('all');
  const [contactOpen, setContactOpen]         = React.useState(false);
  const [contactProduct, setContactProduct]   = React.useState(null);

  const products   = window.CAVALERA.products;
  const categories = window.CAVALERA.categories;

  // Sync accent color CSS var
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accentColor);
  }, [t.accentColor]);

  // Close menu on section change (mobile)
  React.useEffect(() => { setMenuOpen(false); }, [activeSection]);

  // Active section tracker via IntersectionObserver
  React.useEffect(() => {
    const ids = ['hero', 'colecoes', 'story', 'manifesto', 'contato'];
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0, rootMargin: '-38% 0px -38% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o && o.disconnect());
  }, []);

  const handleSolicitar = () => {
    setContactProduct(selectedProduct);
    setContactOpen(true);
  };

  return (
    <div style={{ display:'flex', background:'var(--bg)' }}>
      <NavSidebar
        activeSection={activeSection}
        isMobile={isMobile}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main style={{ marginLeft: 0, flex:1, minHeight:'100vh' }}>
        <HeroSection isMobile={isMobile} />
        <ColecaoSection
          products={products}
          categories={categories}
          onSelectProduct={setSelectedProduct}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          isMobile={isMobile}
        />
        <StorySection isMobile={isMobile} />
        <ManifestoSection isMobile={isMobile} />
        <ContatoSection isMobile={isMobile} />
      </main>

      {/* Cinematic product detail overlay */}
      <ProductDetailOverlay
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSolicitar={handleSolicitar}
        isMobile={isMobile}
      />

      {/* Contact modal */}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        product={contactProduct}
        isMobile={isMobile}
      />

      <TweaksPanel>
        <TweakSection label="Marca" />
        <TweakColor
          label="Accent"
          value={t.accentColor}
          options={['#a3d800','#00d4ff','#ff5a3c','#ffe600']}
          onChange={v => setTweak('accentColor', v)}
        />
        <TweakSection label="Visual" />
        <TweakToggle
          label="Tech overlay"
          value={t.showTechOverlay}
          onChange={v => setTweak('showTechOverlay', v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
