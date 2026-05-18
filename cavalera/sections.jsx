// ── Scroll sections + detail overlay ────────────────────────────────────────

// ── useReveal — IntersectionObserver scroll reveal ───────────────────────────
function useReveal(threshold = 0.1) {
  const ref = React.useRef();
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.querySelectorAll('.rv').forEach(n => n.classList.add('rv-in'));
        obs.disconnect();
      }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── NavSidebar — scroll-aware fixed nav ──────────────────────────────────────
function NavSidebar({ activeSection, isMobile, menuOpen, setMenuOpen }) {
  const [scrolled, setScrolled] = React.useState(false);
  const [tick, setTick]         = React.useState(0);
  const [time, setTime]         = React.useState('');

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Relógio + tick piscante
  React.useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      const hh = String(n.getHours()).padStart(2,'0');
      const mm = String(n.getMinutes()).padStart(2,'0');
      const ss = String(n.getSeconds()).padStart(2,'0');
      setTime(`${hh}:${mm}:${ss}`);
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  const sep = <span style={{ color:'#2a2e22', margin:'0 6px' }}>|</span>;

  const HudItem = ({ label, value, accent }) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1px' }}>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:'7px', color:'#434933', letterSpacing:'0.12em' }}>{label}</span>
      <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color: accent ? 'var(--accent)' : '#8d9479', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{value}</span>
    </div>
  );

  return (
    <header style={{
      position:'fixed', top:0, left:0, right:0, zIndex:300,
      height:'52px',
      background: scrolled ? 'rgba(6,6,6,0.97)' : 'rgba(6,6,6,0.45)',
      borderBottom:`1px solid ${scrolled ? '#434933' : 'rgba(67,73,51,0.25)'}`,
      backdropFilter:'blur(14px)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding: isMobile ? '0 14px' : '0 28px',
      transition:'background 0.4s, border-color 0.4s',
    }}>

      {/* Esquerda: logo */}
      <div onClick={() => scrollTo('hero')} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize: isMobile ? '18px' : '22px', color:'#fff', lineHeight:1 }}>CAVALERA</span>
        {sep}
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'#5a6050', letterSpacing:'0.14em' }}>SP // BR</span>
      </div>

      {/* Centro: HUD data */}
      <div style={{ display:'flex', alignItems:'center', gap: isMobile ? '14px' : '20px', overflow:'hidden' }}>
        {!isMobile && <HudItem label="LAT"  value="-23.548°" />}
        {!isMobile && <HudItem label="LON"  value="-46.637°" />}
        {!isMobile && <HudItem label="ALT"  value="760m" />}
        <HudItem label="UTC-3" value={time || '--:--:--'} accent />
        {!isMobile && <HudItem label="FREQ" value="24.8 GHz" />}
        {!isMobile && <HudItem label="SIGNAL" value="▮▮▮▮▯" />}
        {!isMobile && <HudItem label="PROTO" value="REBEL-X" />}
      </div>

      {/* Direita: status + CTA */}
      <div style={{ display:'flex', alignItems:'center', gap: isMobile ? '8px' : '12px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
          <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'var(--accent)', boxShadow:'0 0 6px rgba(163,216,0,0.8)', animation:'alertBlink 2.2s steps(1) infinite' }} />
          {!isMobile && <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--accent)', letterSpacing:'0.16em' }}>SYS_ONLINE</span>}
        </div>
        <button onClick={() => scrollTo('contato')}
          style={{ background:'var(--accent)', border:'none', padding: isMobile ? '5px 10px' : '6px 16px', cursor:'pointer', fontFamily:'var(--font-label)', fontSize: isMobile ? '8px' : '9px', fontWeight:700, letterSpacing:'0.12em', color:'#131313', transition:'all 0.15s', whiteSpace:'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.opacity='0.82'; e.currentTarget.style.boxShadow='0 0 14px rgba(163,216,0,0.35)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.boxShadow='none'; }}
        >JOIN THE RESISTANCE</button>
      </div>
    </header>
  );
}

// ── ColecaoSection ────────────────────────────────────────────────────────────
function ColecaoSection({ products, categories, onSelectProduct, activeCategory, setActiveCategory, isMobile }) {
  const sectionRef = useReveal(0.05);
  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  return (
    <section id="colecoes" ref={sectionRef} style={{ background:'var(--bg)' }}>
      <div className="rv" style={{ borderBottom:'2px solid #434933', padding: isMobile ? '20px 16px 14px' : '28px 36px 24px', display:'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent:'space-between', gap: isMobile ? '12px' : 0, background:'var(--surface-low)' }}>
        <div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--accent)', letterSpacing:'0.12em', marginBottom:'6px' }}>// COLEÇÕES · {filtered.length} MODELOS</div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize: isMobile ? '36px' : '48px', color:'#ffffff', lineHeight:1, margin:0 }}>COLEÇÃO 2027</h2>
        </div>
        <div style={{ display:'flex', gap:'4px', overflowX: isMobile ? 'auto' : 'visible', flexWrap: isMobile ? 'nowrap' : 'wrap', paddingBottom: isMobile ? '4px' : 0, maxWidth:'100%', WebkitOverflowScrolling:'touch' }}>
          {categories.map(cat => {
            const isA = activeCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ background: isA ? 'var(--accent)' : 'transparent', border:`1px solid ${isA ? 'var(--accent)' : '#434933'}`, color: isA ? '#131313' : '#8d9479', padding:'8px 16px', cursor:'pointer', fontFamily:'var(--font-label)', fontSize:'10px', fontWeight:700, letterSpacing:'0.1em', transition:'all 0.12s', flexShrink:0 }}
                onMouseEnter={e => { if (!isA) e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { if (!isA) e.currentTarget.style.borderColor = '#434933'; }}
              >{cat.label}</button>
            );
          })}
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap:'1px', background:'#434933' }}>
        {filtered.map((p) => (
          <div key={p.id} style={{ background:'var(--bg)' }}>
            <ProductCard product={p} onSelect={onSelectProduct} />
          </div>
        ))}
        {/* Logo filler — apenas no desktop */}
        {!isMobile && Array.from({ length: (3 - filtered.length % 3) % 3 }).map((_, i) => (
          <div key={`filler-${i}`} style={{ background:'#0a0a0a', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', minHeight:'320px' }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(163,216,0,0.025) 8px,rgba(163,216,0,0.025) 9px)' }} />
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, #0a0a0a 85%)' }} />
            <img src="uploads/cavalera logo final.png" alt="Cavalera"
              style={{ width:'58%', maxWidth:'220px', opacity:0.10, filter:'invert(1)', position:'relative', zIndex:1 }}
            />
            <div style={{ fontFamily:'var(--font-label)', fontSize:'9px', fontWeight:700, color:'var(--accent)', letterSpacing:'0.18em', marginTop:'16px', opacity:0.45, position:'relative', zIndex:1 }}>EST. 1995</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── ProductDetailOverlay — cinematic slide-up ────────────────────────────────
function ProductDetailOverlay({ product, onClose, onSolicitar, isMobile }) {
  const [vis, setVis] = React.useState(false);
  const imgRef        = React.useRef();
  const scrollRef     = React.useRef();

  React.useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => setVis(true)));
    } else {
      setVis(false);
      setTimeout(() => { document.body.style.overflow = ''; }, 500);
    }
  }, [product]);

  // Parallax inside overlay: hero image moves slower than scroll
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${el.scrollTop * 0.18}px)`;
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [product]);

  if (!product) return null;

  const sidebarOffset = 0;

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:300, opacity: vis ? 1 : 0, transition:'opacity 0.35s' }} />
      <div ref={scrollRef} style={{ position:'fixed', left:sidebarOffset, top:0, right:0, bottom:0, zIndex:301, background:'var(--bg)', overflowY:'auto', transform: vis ? 'translateY(0)' : 'translateY(100%)', transition:'transform 0.58s cubic-bezier(0.16,1,0.3,1)' }}>
        {/* Cinema letterbox — top bar */}
        <div style={{ position:'fixed', top:0, left:sidebarOffset, right:0, height:'3px', background:'var(--accent)', zIndex:20, transform: vis ? 'scaleX(1)' : 'scaleX(0)', transformOrigin:'left', transition:'transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s', boxShadow:'0 0 16px rgba(163,216,0,0.5)' }} />

        {/* Sticky close bar */}
        <div style={{ padding: isMobile ? '10px 16px' : '13px 36px', borderBottom:'1px solid #434933', display:'flex', alignItems:'center', gap:'14px', background:'rgba(20,20,20,0.95)', position:'sticky', top:0, zIndex:10, backdropFilter:'blur(8px)' }}>
          <button onClick={onClose} style={{ background:'none', border:'1px solid #434933', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px', padding:'7px 14px', fontFamily:'var(--font-label)', fontSize:'10px', fontWeight:700, letterSpacing:'0.08em', color:'#8d9479', transition:'border-color 0.12s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#434933'}
          ><span className="material-symbols-outlined" style={{ fontSize:'14px' }}>close</span>FECHAR</button>
          <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--accent)', border:'1px solid var(--accent)', padding:'4px 10px', letterSpacing:'0.1em' }}>UNIT ID: {product.id}-URBAN</span>
        </div>

        {/* Blueprint hero */}
        <header style={{ position:'relative', height: isMobile ? '320px' : '600px', background:'#0a0a0a', overflow:'hidden' }}>
          {product.image ? (
            <>
              <img ref={imgRef} src={product.image} alt={product.name} style={{ position:'absolute', inset:0, width:'100%', height:'120%', objectFit:'cover', objectPosition:'center 40%', filter:'brightness(0.95) saturate(0.95) contrast(1.02)', transform:'translateY(0)', willChange:'transform', transition:'transform 0.05s linear', imageRendering:'high-quality' }} />
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.18) 35%, transparent 65%)' }} />
            </>
          ) : (
            <>
              <div style={{ position:'absolute', inset:0, color:'var(--accent)', opacity:0.1 }}><ProductBlueprint productId={product.id} /></div>
              <div style={{ position:'absolute', top:'8%', left:'14%', right:'14%', bottom:'22%', color:'var(--accent)', opacity:0.78 }}><ProductBlueprint productId={product.id} /></div>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, #0a0a0a 16%, transparent 58%)' }} />
            </>
          )}
          {!isMobile && <div style={{ position:'absolute', top:'18px', left:'36px', fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--accent)', opacity:0.4, letterSpacing:'0.06em' }}>X-AXIS_LOCK [49.201]</div>}
          {!isMobile && <div style={{ position:'absolute', top:'18px', right:'36px', fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--accent)', opacity:0.4, letterSpacing:'0.06em' }}>Y-AXIS_LOCK [12.883]</div>}
          <div style={{ position:'absolute', bottom: isMobile ? '16px' : '36px', left: isMobile ? '16px' : '40px', maxWidth:'620px', zIndex:2, paddingRight: isMobile ? '16px' : 0 }}>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--accent)', border:'1px solid var(--accent)', padding:'3px 9px', letterSpacing:'0.1em', display:'inline-block', marginBottom:'10px', background:'rgba(0,0,0,0.6)' }}>UNIT ID: {product.id}-URBAN</span>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize: isMobile ? 'clamp(22px,6vw,34px)' : 'clamp(30px,4.5vw,56px)', color:'#ffffff', lineHeight:0.94, margin:'0 0 10px', textTransform:'uppercase' }}>{product.series}: {product.name}</h2>
            {!isMobile && <p style={{ fontFamily:'var(--font-mono)', fontSize:'13px', color:'#c3caac', lineHeight:1.7, maxWidth:'480px' }}>{product.description}</p>}
          </div>
        </header>

        {/* Description on mobile */}
        {isMobile && (
          <div style={{ padding:'16px', borderBottom:'1px solid #434933', background:'var(--surface-low)' }}>
            <p style={{ fontFamily:'var(--font-mono)', fontSize:'13px', color:'#c3caac', lineHeight:1.7, margin:0 }}>{product.description}</p>
          </div>
        )}

        {/* Narrative + schematics */}
        <section style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '5fr 7fr', borderBottom:'2px solid #434933' }}>
          <div style={{ borderRight: isMobile ? 'none' : '1px solid #434933', borderBottom: isMobile ? '1px solid #434933' : 'none' }}>
            <div style={{ padding: isMobile ? '20px 16px' : '32px', borderBottom:'1px solid #434933', background:'var(--surface-low)' }}>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--accent)', letterSpacing:'0.14em', marginBottom:'14px' }}>// THE NARRATIVE</div>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'14px', color:'#c3caac', lineHeight:1.85, margin:'0 0 20px' }}>{product.longDescription}</p>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'#434933', letterSpacing:'0.06em' }}>ORIGIN: {product.origin} · LAT: {product.lat}</div>
            </div>
            <div style={{ padding: isMobile ? '16px' : '28px 32px' }}>
              <div style={{ border:'2px solid var(--accent)', padding:'22px', marginBottom:'20px' }}>
                <div style={{ fontFamily:'var(--font-label)', fontSize:'10px', fontWeight:700, letterSpacing:'0.12em', color:'#ffffff', marginBottom:'18px' }}>PROTOCOL: MATERIAL SPECS</div>
                <SpecTable specs={product.specs} />
              </div>
              <button onClick={onSolicitar} style={{ width:'100%', background:'transparent', border:'2px solid #ffffff', color:'#ffffff', padding:'15px 20px', cursor:'pointer', fontFamily:'var(--font-label)', fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', transition:'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#131313'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
              >SOLICITAR INFORMAÇÕES →</button>
            </div>
          </div>

          {!isMobile && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }}>
              {[0,1].map(i => (
                <div key={i} style={{ aspectRatio:'1', background:'#0e0e0e', borderBottom:'1px solid #434933', borderRight: i===0 ? '1px solid #434933' : 'none', position:'relative', overflow:'hidden', backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(163,216,0,0.025) 8px,rgba(163,216,0,0.025) 9px)' }}>
                  <div style={{ position:'absolute', top:'10px', left:'10px', fontFamily:'var(--font-mono)', fontSize:'9px', color: i===0 ? 'var(--accent)' : '#8d9479', border:`1px solid ${i===0 ? 'var(--accent)' : '#434933'}`, padding:'3px 7px', background:'rgba(0,0,0,0.7)', letterSpacing:'0.06em' }}>
                    HD_MACRO_0{i+1} // {i===0 ? 'HARDWARE_STRESS' : 'GRIP_COEFF'}
                  </div>
                  <div style={{ position:'absolute', inset:'22px', color:'var(--accent)', opacity: i===0 ? 0.88 : 0.45, transform: i===1 ? 'scaleX(-1)' : 'none' }}><ProductBlueprint productId={product.id} /></div>
                  <div style={{ position:'absolute', bottom:'12px', left:'12px' }}>
                    <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--accent)', opacity:0.7, letterSpacing:'0.05em' }}>{product.callouts[i]}</span>
                  </div>
                </div>
              ))}
              <div style={{ gridColumn:'span 2', height:'260px', background:'#0a0a0a', position:'relative', overflow:'hidden', backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(163,216,0,0.018) 10px,rgba(163,216,0,0.018) 11px)' }}>
                <div style={{ position:'absolute', inset:'26px 130px', color:'var(--accent)', opacity:0.6 }}><ProductBlueprint productId={product.id} /></div>
                <div style={{ position:'absolute', bottom:'14px', left:'20px', display:'flex', justifyContent:'space-between', right:'20px', alignItems:'flex-end' }}>
                  <div>
                    <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--accent)', opacity:0.5, marginBottom:'4px', letterSpacing:'0.06em' }}>SCANNING... 100%</div>
                    <div style={{ width:'120px', height:'2px', background:'rgba(163,216,0,0.15)' }}><div style={{ width:'100%', height:'100%', background:'var(--accent)' }} /></div>
                  </div>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--accent)', opacity:0.4, letterSpacing:'0.06em' }}>REF: {product.ref}</span>
                </div>
                <div style={{ position:'absolute', right:'16px', top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:'10px' }}>
                  {product.callouts.map((c, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                      <div style={{ width:'16px', height:'1px', background:'var(--accent)', opacity:0.5 }} />
                      <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--accent)', opacity:0.7, letterSpacing:'0.05em', whiteSpace:'nowrap' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Callouts */}
        <section style={{ background:'var(--surface-low)', borderBottom:'2px solid #434933' }}>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)' }}>
            {product.callouts.map((c, i) => (
              <div key={i} style={{ padding: isMobile ? '20px 16px' : '28px', borderRight: (!isMobile && i < 2) ? '1px solid #434933' : 'none', borderBottom: (isMobile && i < 2) ? '1px solid #434933' : 'none' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'22px', color:'var(--accent)', display:'block', marginBottom:'12px' }}>{['engineering','recycling','verified_user'][i]}</span>
                <h4 style={{ fontFamily:'var(--font-label)', fontSize:'10px', fontWeight:700, letterSpacing:'0.12em', color:'#ffffff', marginBottom:'8px' }}>{c}</h4>
                <p style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'#8d9479', lineHeight:1.7, margin:0 }}>
                  {['Solado e estrutura projetados para o ciclo diário urbano — calor, chuva, concreto, asfalto quente.', 'Borracha reciclada, EVA de alta densidade e materiais de baixo impacto. Feito para durar, não para descarte.', 'Cada modelo passa por testes de flexão, aderência úmida e resistência estrutural antes de ser aprovado.'][i]}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

// ── StorySection ──────────────────────────────────────────────────────────────
function StorySection({ isMobile }) {
  const sectionRef = useReveal(0.08);
  const logoRef = React.useRef();
  React.useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || !logoRef.current) return;
      const rect = el.getBoundingClientRect();
      const progress = -rect.top / rect.height;
      logoRef.current.style.transform = `translate(-50%, calc(-50% + ${progress * 80}px))`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const texts = [
    'São Paulo, 1995. Igor Cavalera — baterista do Sepultura, a banda brasileira de metal mais ouvida no planeta — e Alberto Hiar fundaram a Cavalera. Enquanto o mundo ouvia Roots no volume máximo, eles construíam uma marca que falava a mesma língua: peso, atitude, sem pedir licença.',
    'O nome não é coincidência. A família Cavalera colocou o Brasil no mapa do metal pesado. A marca nasceu pra traduzir essa identidade em produto — da camiseta ao calçado, do estúdio de ensaio pra calçada de SP.',
    'A águia bicéfala não foi escolhida por acidente. Inspirada na bandeira da Albânia, o símbolo carrega séculos de poder e rebeldia. Uma cabeça não basta quando você domina dois mundos: música e moda.',
    'Hoje a Cavalera desfila na São Paulo Fashion Week, veste artistas, lança coleções com bandas e atira sandália em quem acha que metal e estilo não combinam. Combinam. Sempre combinaram.'
  ];

  return (
    <section id="story" ref={sectionRef} style={{ background:'var(--bg)', borderTop:'2px solid #434933', position:'relative', overflow:'hidden', isolation:'isolate' }}>
      <div ref={logoRef} style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', willChange:'transform', pointerEvents:'none', zIndex:0 }}>
        <img src="uploads/cavalera logo final.png"
          style={{ width:'680px', maxWidth:'72vw', opacity:0.05, filter:'invert(1)', display:'block' }}
          alt=""
        />
      </div>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 65% 60% at 50% 50%, transparent 20%, var(--bg) 78%)', pointerEvents:'none', zIndex:1 }} />
      <div style={{ maxWidth:'700px', margin:'0 auto', padding: isMobile ? '56px 24px' : '80px 48px', position:'relative', zIndex:2 }}>
        <div className="rv" style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--accent)', letterSpacing:'0.14em', marginBottom:'14px' }}>// THE STORY · EST. 1995 · SÃO PAULO</div>
        <h1 className="rv delay-1" style={{ fontFamily:'var(--font-display)', fontSize: isMobile ? 'clamp(40px,12vw,72px)' : 'clamp(48px,7vw,92px)', color:'#ffffff', lineHeight:0.9, margin:'0 0 40px' }}>
          REBELIÃO<br />URBANA.
        </h1>
        {texts.map((txt, i) => (
          <p key={i} className={`rv delay-${i + 1}`} style={{ fontFamily:'var(--font-mono)', fontSize: isMobile ? '14px' : '15px', color:'#c3caac', lineHeight:'1.85', margin:'0 0 24px' }}>{txt}</p>
        ))}
        <div className="rv delay-4" style={{ marginTop:'44px', borderTop:'1px solid #434933', paddingTop:'28px', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap: isMobile ? '16px' : '24px' }}>
          {[['1995','FUNDAÇÃO SP'],['30+','ANOS DE REBELDIA'],['SPFW','PRESENÇA CONSTANTE']].map(([n, l]) => (
            <div key={l}>
              <div style={{ fontFamily:'var(--font-display)', fontSize: isMobile ? '32px' : '40px', color:'var(--accent)', lineHeight:1 }}>{n}</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'#8d9479', marginTop:'4px', letterSpacing:'0.1em' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── ManifestoSection ──────────────────────────────────────────────────────────
function ManifestoSection({ isMobile }) {
  const sectionRef = useReveal(0.04);
  const bpRef = React.useRef();
  React.useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el || !bpRef.current) return;
      const rect = el.getBoundingClientRect();
      bpRef.current.style.transform = `translateY(${(-rect.top / rect.height) * 90}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const lines = [
    'RECUSAMOS A OBSOLESCÊNCIA PROGRAMADA.',
    'CADA COSTURA É UMA LINHA DE CÓDIGO.',
    'O ASFALTO DE SP É NOSSO ÚNICO LABORATÓRIO.',
    'O SISTEMA CRIA TENDÊNCIA. NÓS CRIAMOS EXCEÇÕES.',
    'SE VOCÊ PRECISA DE APROVAÇÃO, COMPRE OUTRA MARCA.',
    'CONSTRUÍDO PARA DURAR. NÃO PARA SER DESCARTADO.'
  ];

  return (
    <section id="manifesto" ref={sectionRef} style={{ background:'#0a0a0a', position:'relative', overflow:'hidden', padding: isMobile ? '56px 24px' : '80px 48px', borderTop:'2px solid #434933' }}>
      <div ref={bpRef} style={{ position:'absolute', right:'-6%', top:'4%', willChange:'transform', pointerEvents:'none' }}>
        <img src="uploads/cavalera logo final.png" alt=""
          style={{ width: isMobile ? '70vw' : '44vw', maxWidth:'620px', opacity:0.06, filter:'invert(1) sepia(1) saturate(5) hue-rotate(76deg) brightness(0.85)', display:'block' }}
        />
      </div>
      <div className="rv" style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--accent)', letterSpacing:'0.14em', marginBottom:'52px' }}>
        // MANIFESTO · CAVALERA · 2026
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap: isMobile ? '22px' : '30px', position:'relative', zIndex:1, maxWidth:'860px' }}>
        {lines.map((line, i) => (
          <div key={i} className={`rv delay-${i}`} style={{ display:'flex', gap:'16px', alignItems:'flex-start' }}>
            <span style={{ fontFamily:'var(--font-label)', fontSize:'10px', fontWeight:700, color:'var(--accent)', opacity:0.45, marginTop:'6px', minWidth:'24px', flexShrink:0 }}>0{i+1}</span>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize: isMobile ? 'clamp(18px,5.5vw,32px)' : 'clamp(22px,3.2vw,42px)', color:'#ffffff', margin:0, lineHeight:1.04, letterSpacing:'0.01em' }}>{line}</h2>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── ContactModal ──────────────────────────────────────────────────────────────
function ContactModal({ isOpen, onClose, product, isMobile }) {
  const [form, setForm] = React.useState({ nome:'', email:'', mensagem:'' });
  const [sent, setSent] = React.useState(false);
  const inputStyle = { width:'100%', background:'transparent', border:'none', borderBottom:'2px solid #434933', color:'#e5e2e1', fontFamily:'var(--font-mono)', fontSize:'13px', padding:'10px 0', outline:'none', letterSpacing:'0.04em', transition:'border-color 0.15s' };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ nome:'', email:'', mensagem:'' }); onClose(); }, 2200);
  };

  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:400, opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none', transition:'opacity 0.25s' }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', zIndex:401, width: isMobile ? 'calc(100vw - 32px)' : '480px', maxHeight: isMobile ? '90vh' : 'none', overflowY: isMobile ? 'auto' : 'visible', background:'var(--surface-low)', border:'2px solid #434933', transform: isOpen ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(0.95)', opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none', transition:'transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s' }}>
        <div style={{ padding:'22px 26px 18px', borderBottom:'1px solid #434933', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--accent)', letterSpacing:'0.14em', marginBottom:'6px' }}>// SOLICITAÇÃO</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:'26px', color:'#ffffff', lineHeight:1 }}>{product ? product.name : 'CONTATO'}</div>
            {product && <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'#8d9479', marginTop:'3px' }}>{product.series}</div>}
          </div>
          <button onClick={onClose} style={{ background:'none', border:'1px solid #434933', cursor:'pointer', padding:'6px', color:'#8d9479' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#434933'}
          ><span className="material-symbols-outlined" style={{ fontSize:'16px', display:'block' }}>close</span></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding:'26px' }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'28px 0' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'32px', color:'var(--accent)', marginBottom:'8px' }}>ENVIADO.</div>
              <div style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'#8d9479' }}>Retornaremos em breve.</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'22px' }}>
              {[['NOME','nome','text','Seu nome'],['E-MAIL','email','email','seu@email.com']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label style={{ fontFamily:'var(--font-label)', fontSize:'9px', fontWeight:700, letterSpacing:'0.12em', color:'#8d9479', display:'block', marginBottom:'6px' }}>{label}</label>
                  <input required type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} style={inputStyle}
                    onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderBottomColor = '#434933'} />
                </div>
              ))}
              <div>
                <label style={{ fontFamily:'var(--font-label)', fontSize:'9px', fontWeight:700, letterSpacing:'0.12em', color:'#8d9479', display:'block', marginBottom:'6px' }}>MENSAGEM</label>
                <textarea rows={3} value={form.mensagem} onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))} placeholder="Descreva seu interesse..."
                  style={{ ...inputStyle, resize:'none', borderBottom:'none', border:'1px solid #434933', padding:'10px 12px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = '#434933'} />
              </div>
              <button type="submit" style={{ background:'var(--accent)', border:'none', color:'#131313', padding:'15px', cursor:'pointer', fontFamily:'var(--font-label)', fontSize:'11px', fontWeight:700, letterSpacing:'0.12em', transition:'opacity 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >ENVIAR SOLICITAÇÃO →</button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

// ── ContatoSection ────────────────────────────────────────────────────────────
function ContatoSection({ isMobile }) {
  const sectionRef = useReveal(0.08);
  const [form, setForm] = React.useState({ nome:'', email:'', interesse:'', mensagem:'' });
  const [sent, setSent] = React.useState(false);
  const [resistanceTxt, setResistance] = React.useState('');
  const RESISTANCE = 'JOIN THE RESISTANCE';
  const resistanceRef = React.useRef();

  React.useEffect(() => {
    const el = resistanceRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        obs.disconnect();
        let i = 0;
        const id = setInterval(() => {
          setResistance(RESISTANCE.slice(0, i++));
          if (i > RESISTANCE.length) clearInterval(id);
        }, 52);
      }
    }, { threshold: 0.8 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const products = window.CAVALERA.products;
  const inputStyle = { width:'100%', background:'transparent', border:'none', borderBottom:'2px solid #434933', color:'#e5e2e1', fontFamily:'var(--font-mono)', fontSize:'14px', padding:'10px 0', outline:'none', letterSpacing:'0.04em', transition:'border-color 0.15s' };

  return (
    <section id="contato" ref={sectionRef} style={{ background:'var(--bg)', borderTop:'2px solid #434933' }}>
      <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', minHeight: isMobile ? 'auto' : '80vh' }}>
        <div style={{ padding: isMobile ? '40px 24px 32px' : '64px 48px', borderRight: isMobile ? 'none' : '1px solid #434933', borderBottom: isMobile ? '1px solid #434933' : 'none', display:'flex', flexDirection:'column', justifyContent:'space-between', gap: isMobile ? '32px' : 0 }}>
          <div>
            <div className="rv" style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--accent)', letterSpacing:'0.14em', marginBottom:'14px' }}>// CONTATO</div>
            <h1 className="rv delay-1" style={{ fontFamily:'var(--font-display)', fontSize: isMobile ? 'clamp(36px,10vw,64px)' : 'clamp(44px,6vw,80px)', color:'#ffffff', lineHeight:0.9, margin:'0 0 28px' }}>FALE COM<br />A GENTE.</h1>
            <p className="rv delay-2" style={{ fontFamily:'var(--font-mono)', fontSize:'14px', color:'#c3caac', lineHeight:1.8, maxWidth:'360px' }}>
              Lojista? Receba o catálogo 2027 completo com modelos, cores e condições comerciais.
            </p>
            <div ref={resistanceRef} className="rv delay-3" style={{ marginTop:'22px', fontFamily:'var(--font-display)', fontSize: isMobile ? '22px' : '26px', color:'var(--accent)', letterSpacing:'0.04em', lineHeight:1, minHeight: isMobile ? '28px' : '34px' }}>
              {resistanceTxt}<span style={{ animation:'cursorBlink 0.75s steps(1) infinite' }}>_</span>
            </div>
          </div>
          <div className="rv delay-3" style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
            {[
              ['alternate_email','romaniolo.rep@gmail.com','mailto:romaniolo.rep@gmail.com'],
              ['location_on','Londrina, PR','https://maps.google.com/?q=Londrina,PR,Brasil'],
              ['phone_iphone','(43) 9.9823-2565 — WhatsApp','https://wa.me/5543998232565'],
            ].map(([icon, txt, href]) => (
              <a key={txt} href={href} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:'12px', textDecoration:'none', cursor:'pointer' }}
                onMouseEnter={e => { e.currentTarget.querySelector('span.material-symbols-outlined').style.opacity='0.7'; }}
                onMouseLeave={e => { e.currentTarget.querySelector('span.material-symbols-outlined').style.opacity='1'; }}
              >
                <span className="material-symbols-outlined" style={{ fontSize:'18px', color:'var(--accent)', transition:'opacity 0.15s' }}>{icon}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'13px', color:'#c3caac', transition:'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color='var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color='#c3caac'}
                >{txt}</span>
              </a>
            ))}
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'11px', color:'#8d9479', letterSpacing:'0.04em', paddingLeft:'2px' }}>
              *Representamos somente o Norte e Noroeste do Paraná.
            </div>
          </div>
        </div>
        <div style={{ padding: isMobile ? '32px 24px 40px' : '64px 48px' }}>
          {sent ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', textAlign:'center', minHeight:'300px' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'52px', color:'var(--accent)', marginBottom:'10px' }}>RECEBIDO.</div>
              <p style={{ fontFamily:'var(--font-mono)', fontSize:'13px', color:'#8d9479' }}>Retornaremos em até 48 horas.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display:'flex', flexDirection:'column', gap:'28px' }} className="rv">
              {[['NOME','nome','text','Seu nome completo'],['E-MAIL','email','email','seu@email.com']].map(([label, key, type, ph]) => (
                <div key={key}>
                  <label style={{ fontFamily:'var(--font-label)', fontSize:'9px', fontWeight:700, letterSpacing:'0.14em', color:'#8d9479', display:'block', marginBottom:'8px' }}>{label}</label>
                  <input required type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} style={inputStyle}
                    onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderBottomColor = '#434933'} />
                </div>
              ))}
              <div>
                <label style={{ fontFamily:'var(--font-label)', fontSize:'9px', fontWeight:700, letterSpacing:'0.14em', color:'#8d9479', display:'block', marginBottom:'8px' }}>MODELO DE INTERESSE</label>
                <select value={form.interesse} onChange={e => setForm(f => ({ ...f, interesse: e.target.value }))} style={{ ...inputStyle, appearance:'none', cursor:'pointer' }}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderBottomColor = '#434933'}>
                  <option value="" style={{ background:'#1c1b1b' }}>Selecionar…</option>
                  {products.map(p => <option key={p.id} value={p.id} style={{ background:'#1c1b1b' }}>{p.name} — {p.series}</option>)}
                  <option value="geral" style={{ background:'#1c1b1b' }}>Consulta geral</option>
                </select>
              </div>
              <div>
                <label style={{ fontFamily:'var(--font-label)', fontSize:'9px', fontWeight:700, letterSpacing:'0.14em', color:'#8d9479', display:'block', marginBottom:'8px' }}>MENSAGEM</label>
                <textarea rows={4} value={form.mensagem} onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))} placeholder="Descreva seu interesse ou dúvida…"
                  style={{ ...inputStyle, resize:'none', borderBottom:'none', border:'1px solid #434933', padding:'12px', lineHeight:1.7 }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = '#434933'} />
              </div>
              <button type="submit" style={{ background:'var(--accent)', border:'none', color:'#131313', padding:'17px', cursor:'pointer', fontFamily:'var(--font-label)', fontSize:'12px', fontWeight:700, letterSpacing:'0.12em', transition:'opacity 0.12s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >ENVIAR SOLICITAÇÃO →</button>
            </form>
          )}
        </div>
      </div>
      {/* Footer */}
      <div style={{ padding: isMobile ? '20px 16px' : '22px 36px', borderTop:'1px solid #434933', display:'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent:'space-between', alignItems:'center', gap: isMobile ? '12px' : 0, background:'var(--surface-low)' }}>
        <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
          <div style={{ fontFamily:'var(--font-label)', fontSize:'10px', fontWeight:700, color:'#8d9479', letterSpacing:'0.1em' }}>CAVALERA INDUSTRIAL SECTOR</div>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'#434933', marginTop:'2px' }}>© 1995–2027 ALL RIGHTS RESERVED</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'var(--font-label)', fontSize:'10px', fontWeight:700, color:'#8d9479', letterSpacing:'0.1em' }}>iBRAND GESTÃO DE MARCAS LTDA</div>
        </div>
        <div style={{ display:'flex', gap:'24px', justifyContent: isMobile ? 'center' : 'flex-end' }}>
          {['Hardware Specs','Source Code','Protocol'].map(l => (
            <a key={l} href="#" style={{ fontFamily:'var(--font-mono)', fontSize:'12px', color:'#8d9479', textDecoration:'none', transition:'color 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = '#8d9479'}
            >{l}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { NavSidebar, ColecaoSection, ProductDetailOverlay, StorySection, ManifestoSection, ContactModal, ContatoSection });
