// ── Cavalera shared components ──────────────────────────────────────────────

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < breakpoint);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

function ProductBlueprint({ productId }) {
  const size = { width: '100%', height: '100%' };
  const blueprints = {
    'BR-2995': (
      <svg viewBox="0 0 200 130" fill="none" style={size}>
        {/* Platform sole */}
        <rect x="8" y="92" width="184" height="22" stroke="currentColor" strokeWidth="1.5"/>
        {[24,44,64,84,104,124,144,164,184].map(x => (
          <line key={x} x1={x} y1="92" x2={x} y2="114" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.5"/>
        ))}
        {/* Main body */}
        <rect x="8" y="56" width="120" height="38" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="126" y="44" width="66" height="50" stroke="currentColor" strokeWidth="1.5"/>
        {/* Toe strap */}
        <rect x="40" y="28" width="88" height="30" stroke="currentColor" strokeWidth="1.5"/>
        {/* Heavy buckle */}
        <rect x="80" y="20" width="48" height="36" stroke="currentColor" strokeWidth="2"/>
        <line x1="80" y1="38" x2="128" y2="38" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="96" y="26" width="16" height="16" stroke="currentColor" strokeWidth="1"/>
        {/* Stitching */}
        <line x1="14" y1="63" x2="126" y2="63" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.4"/>
        <line x1="14" y1="79" x2="126" y2="79" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" strokeOpacity="0.4"/>
      </svg>
    ),
    'BR-1201': (
      <svg viewBox="0 0 200 130" fill="none" style={size}>
        {/* Sole */}
        <path d="M10,100 Q100,113 190,100 L190,118 Q100,128 10,118 Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M18,100 Q100,111 182,100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2"/>
        {/* Upper */}
        <path d="M24,100 L34,62 L166,62 L176,100" stroke="currentColor" strokeWidth="1.5"/>
        {/* Strap 2 */}
        <line x1="34" y1="80" x2="166" y2="80" stroke="currentColor" strokeWidth="1.5"/>
        {/* Velcro panels */}
        <rect x="116" y="63" width="46" height="16" stroke="currentColor" strokeWidth="1" strokeDasharray="3 1.5"/>
        <rect x="116" y="81" width="46" height="16" stroke="currentColor" strokeWidth="1" strokeDasharray="3 1.5"/>
        {/* Buckle left */}
        <rect x="28" y="63" width="20" height="16" stroke="currentColor" strokeWidth="1"/>
        <rect x="28" y="81" width="20" height="16" stroke="currentColor" strokeWidth="1"/>
        <line x1="38" y1="63" x2="38" y2="79" stroke="currentColor" strokeWidth="1"/>
        <line x1="38" y1="81" x2="38" y2="97" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    'BR-0744': (
      <svg viewBox="0 0 200 130" fill="none" style={size}>
        {/* Curved sole */}
        <path d="M14,106 C55,122 145,122 186,106 L186,119 C145,132 55,132 14,119 Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M20,106 C58,120 142,120 180,106" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 2"/>
        {/* Toe post */}
        <line x1="100" y1="106" x2="100" y2="40" stroke="currentColor" strokeWidth="2"/>
        {/* Cross strap */}
        <path d="M22,76 C55,58 145,58 178,76" stroke="currentColor" strokeWidth="1.5"/>
        {/* Ankle strap */}
        <path d="M24,90 C58,78 142,78 176,90" stroke="currentColor" strokeWidth="1.5"/>
        {/* Brass buckle */}
        <rect x="146" y="68" width="28" height="22" stroke="currentColor" strokeWidth="2"/>
        <line x1="146" y1="79" x2="174" y2="79" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="154" y="72" width="12" height="14" stroke="currentColor" strokeWidth="1"/>
        {/* Leather grain */}
        <path d="M22,88 C58,77 142,77 178,88" stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.3" strokeDasharray="1 4"/>
      </svg>
    ),
    'BR-3300': (
      <svg viewBox="0 0 200 130" fill="none" style={size}>
        {/* Platform */}
        <rect x="8" y="96" width="184" height="24" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="8" y1="108" x2="192" y2="108" stroke="currentColor" strokeWidth="0.75" strokeDasharray="6 2"/>
        {/* Diagonal tread */}
        {[0,1,2,3,4,5,6,7,8,9].map(i => (
          <line key={i} x1={16+i*18} y1="96" x2={28+i*18} y2="120" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.6"/>
        ))}
        {/* 3 technical straps */}
        <rect x="8" y="72" width="184" height="26" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="8" y="48" width="184" height="26" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="8" y="24" width="184" height="26" stroke="currentColor" strokeWidth="1.5"/>
        {/* Ratchet hardware */}
        {[24,48,72].map((y,i) => (
          <g key={i}>
            <rect x="150" y={y+2} width="36" height="18" stroke="currentColor" strokeWidth="1.5"/>
            {[0,5,10,15,20,25,30].map(dx => (
              <line key={dx} x1={152+dx} y1={y+2} x2={152+dx} y2={y+20} stroke="currentColor" strokeWidth="0.5"/>
            ))}
          </g>
        ))}
      </svg>
    ),
    'BR-0522': (
      <svg viewBox="0 0 200 130" fill="none" style={size}>
        {/* Flat sole */}
        <path d="M10,104 L190,104 L186,118 L14,118 Z" stroke="currentColor" strokeWidth="1.5"/>
        {/* Canvas upper */}
        <path d="M28,104 L38,44 L162,44 L172,104 Z" stroke="currentColor" strokeWidth="1.5"/>
        {/* T-strap */}
        <line x1="100" y1="44" x2="100" y2="104" stroke="currentColor" strokeWidth="2"/>
        {/* Cross strap */}
        <line x1="55" y1="76" x2="145" y2="76" stroke="currentColor" strokeWidth="1.5"/>
        {/* Canvas texture */}
        {[50,66,82,118,134,150].map(x => (
          <line key={x} x1={x} y1="50" x2={x} y2="102" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.25"/>
        ))}
        {[55,68,80,92,104].map(y => (
          <line key={y} x1="32" y1={y} x2="168" y2={y} stroke="currentColor" strokeWidth="0.4" strokeOpacity="0.2"/>
        ))}
        {/* Quick-release clip */}
        <rect x="82" y="69" width="36" height="14" stroke="currentColor" strokeWidth="1.5"/>
        <line x1="100" y1="69" x2="100" y2="83" stroke="currentColor" strokeWidth="1"/>
      </svg>
    ),
    'BR-1888': (
      <svg viewBox="0 0 200 130" fill="none" style={size}>
        {/* Thin sleek sole */}
        <path d="M14,108 Q100,118 186,108 L186,120 Q100,128 14,120 Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M22,108 Q100,116 178,108" stroke="currentColor" strokeWidth="0.4"/>
        {/* Single arch strap – outer */}
        <path d="M28,108 C38,74 62,40 100,33 C138,40 162,74 172,108" stroke="currentColor" strokeWidth="2"/>
        {/* Inner edge */}
        <path d="M42,108 C50,78 70,50 100,44 C130,50 150,78 158,108" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35"/>
        {/* Magnetic closure */}
        <rect x="82" y="27" width="36" height="16" stroke="currentColor" strokeWidth="2"/>
        <line x1="82" y1="35" x2="118" y2="35" stroke="currentColor" strokeWidth="1"/>
        <circle cx="92" cy="35" r="4" stroke="currentColor" strokeWidth="1"/>
        <circle cx="108" cy="35" r="4" stroke="currentColor" strokeWidth="1"/>
      </svg>
    )
  };
  return blueprints[productId] || blueprints['BR-2995'];
}

// ── Tag ──────────────────────────────────────────────────────────────────────
function Tag({ children, accent }) {
  return (
    <span style={{
      fontFamily: 'var(--font-label)',
      fontSize: '9px',
      fontWeight: 700,
      letterSpacing: '0.12em',
      padding: '3px 7px',
      border: `1px solid ${accent ? 'var(--accent)' : 'rgba(141,148,121,0.5)'}`,
      color: accent ? 'var(--accent)' : '#8d9479',
      whiteSpace: 'nowrap',
      lineHeight: 1
    }}>
      {children}
    </span>
  );
}

// ── SpecTable ────────────────────────────────────────────────────────────────
function SpecTable({ specs }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
      <tbody>
        {Object.entries(specs).map(([k, v]) => (
          <tr key={k} style={{ borderBottom: '1px solid rgba(67,73,51,0.5)' }}>
            <td style={{ padding: '10px 0', color: '#8d9479', letterSpacing: '0.06em', width: '38%' }}>{k}</td>
            <td style={{ padding: '10px 0', color: '#e5e2e1', letterSpacing: '0.04em', fontWeight: 700 }}>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


// ── ProductCard ──────────────────────────────────────────────────────────────
function ProductCard({ product, onSelect }) {
  const [hovered, setHovered] = React.useState(false);
  const isMobile = useIsMobile();
  const cardRef = React.useRef();

  // Valores separados por viewport
  const imgAspect      = isMobile ? '3/4'      : '4/5';
  const imgPosition    = isMobile ? 'center 55%' : 'center 48%';
  const topGradH       = isMobile ? '38%'      : '30%';
  const topGradOpacity = isMobile ? '0.97'     : '0.82';
  const reticleSize    = isMobile ? '14px'     : '18px';

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`;
    cardRef.current.style.transition = 'transform 0.08s ease';
  };
  const handleMouseLeave = () => {
    setHovered(false);
    cardRef.current.style.transform = 'perspective(700px) rotateY(0) rotateX(0) translateY(0)';
    cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.15s';
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'var(--surface-low)', border: `1px solid ${hovered ? 'var(--accent)' : '#434933'}`,
        cursor: 'pointer', transition: 'border-color 0.15s, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex', flexDirection: 'column',
        willChange: 'transform'
      }}
    >
      {/* Blueprint image area */}
      {/* Product visual */}
      <div onClick={() => onSelect(product)} style={{ position:'relative', background:'#0a0a0a', aspectRatio: imgAspect, overflow:'hidden', cursor:'pointer' }}>

        {product.image ? (
          <>
            {/* Imagem com máscara cinematic — vignette radial nas bordas */}
            <img src={product.image} alt={product.name} style={{
              position:'absolute', inset:0, width:'100%', height:'100%',
              objectFit:'cover', objectPosition: imgPosition,
              filter: product.id === 'BR-1888'
                ? `grayscale(1) contrast(${hovered ? 1.25 : 1.35}) brightness(${hovered ? 1.0 : 0.88})`
                : `contrast(1.02) brightness(${hovered ? 1.05 : 0.95}) saturate(${hovered ? 1.0 : 0.92})`,
              transform: hovered ? 'scale(1.04)' : 'scale(1)',
              transition:'filter 0.4s ease, transform 0.6s cubic-bezier(0.16,1,0.3,1)',
              maskImage:'radial-gradient(ellipse 92% 88% at 50% 46%, black 38%, rgba(0,0,0,0.88) 58%, rgba(0,0,0,0.45) 78%, transparent 100%)',
              WebkitMaskImage:'radial-gradient(ellipse 92% 88% at 50% 46%, black 38%, rgba(0,0,0,0.88) 58%, rgba(0,0,0,0.45) 78%, transparent 100%)',
            }} />

            {/* Scanlines CRT — textura rebel */}
            <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)', pointerEvents:'none', zIndex:1 }} />

            {/* Gradiente topo — cobre etiquetas/texto da parte superior da foto */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height: topGradH, background:`linear-gradient(to bottom, rgba(10,10,10,${topGradOpacity}) 0%, rgba(10,10,10,0.6) 45%, transparent 100%)`, pointerEvents:'none', zIndex:2 }} />

            {/* Gradiente base — cobre texto da palmilha + legibilidade */}
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.5) 16%, rgba(10,10,10,0.08) 32%, transparent 48%)', pointerEvents:'none', zIndex:2 }} />

            {/* Corner reticles — targeting futurist */}
            {[
              { top:'8px',    left:'8px',   borderTop:'1px solid var(--accent)', borderLeft:'1px solid var(--accent)'  },
              { top:'8px',    right:'8px',  borderTop:'1px solid var(--accent)', borderRight:'1px solid var(--accent)' },
              { bottom:'8px', left:'8px',   borderBottom:'1px solid var(--accent)', borderLeft:'1px solid var(--accent)'  },
              { bottom:'8px', right:'8px',  borderBottom:'1px solid var(--accent)', borderRight:'1px solid var(--accent)' },
            ].map((s, i) => (
              <div key={i} style={{ position:'absolute', width: reticleSize, height: reticleSize, opacity: hovered ? 0.9 : 0.35, transition:'opacity 0.3s ease', pointerEvents:'none', zIndex:5, ...s }} />
            ))}

            {/* Scan sweep on hover */}
            {hovered && <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,var(--accent),transparent)', animation:'heroScan 1.2s linear infinite', opacity:0.55, pointerEvents:'none', zIndex:6 }} />}
          </>
        ) : (
          <>
            <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(163,216,0,0.03) 8px,rgba(163,216,0,0.03) 9px)' }} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', color:'var(--accent)' }}>
              <ProductBlueprint productId={product.id} />
            </div>
          </>
        )}

        {/* Unit ID — always visible */}
        <div style={{ position:'absolute', top:'10px', left:'10px', zIndex:4, fontFamily:'var(--font-mono)', fontSize:'9px', color:'var(--accent)', border:'1px solid var(--accent)', padding:'3px 7px', background:'rgba(0,0,0,0.75)', letterSpacing:'0.06em' }}>
          HD_UNIT // {product.id}
        </div>
        <div style={{ position:'absolute', bottom:'10px', right:'10px', zIndex:4, fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--accent)', opacity:0.55, letterSpacing:'0.04em' }}>
          REF: {product.ref}
        </div>
      </div>

      {/* Info area */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <Tag accent>{product.category.toUpperCase()}</Tag>
          {product.tags.map(t => <Tag key={t}>{t}</Tag>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }} onClick={() => onSelect(product)}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#ffffff', lineHeight: 1 }}>{product.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8d9479', marginTop: '3px', letterSpacing: '0.04em' }}>{product.series}</div>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(product); }}
          style={{
            background: 'transparent',
            border: '2px solid #8d9479',
            color: '#c3caac',
            padding: '10px 16px', cursor: 'pointer',
            fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.1em', width: '100%', transition: 'all 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#8d9479'; e.currentTarget.style.color = '#c3caac'; }}
        >
          VER DETALHES →
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { useIsMobile, ProductBlueprint, Tag, SpecTable, ProductCard });
