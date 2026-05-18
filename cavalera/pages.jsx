// ── Cavalera portfolio page components ──────────────────────────────────────

// ── ContactModal ─────────────────────────────────────────────────────────────
function ContactModal({ isOpen, onClose, product }) {
  const [form, setForm] = React.useState({ nome: '', email: '', mensagem: '' });
  const [sent, setSent] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setForm({ nome: '', email: '', mensagem: '' }); onClose(); }, 2200);
  };

  const inputStyle = {
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: '2px solid #434933',
    color: '#e5e2e1', fontFamily: 'var(--font-mono)', fontSize: '13px',
    padding: '10px 0', outline: 'none', letterSpacing: '0.04em',
    transition: 'border-color 0.15s'
  };

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 300,
        opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none',
        transition: 'opacity 0.25s'
      }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', zIndex: 301,
        width: '480px', background: 'var(--surface-low)',
        border: '2px solid #434933',
        transform: isOpen ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(0.96)',
        opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none',
        transition: 'transform 0.25s cubic-bezier(0.16,1,0.3,1), opacity 0.2s'
      }}>
        {/* Header */}
        <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #434933', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: '6px' }}>
              // SOLICITAÇÃO DE INFORMAÇÕES
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#ffffff', lineHeight: 1 }}>
              {product ? product.name : 'CONTATO'}
            </div>
            {product && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8d9479', marginTop: '4px' }}>{product.series}</div>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid #434933', cursor: 'pointer', padding: '6px', color: '#8d9479' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#434933'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', display: 'block' }}>close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--accent)', marginBottom: '8px' }}>ENVIADO.</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#8d9479' }}>Entraremos em contato em breve.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: '#8d9479', display: 'block', marginBottom: '6px' }}>NOME</label>
                <input required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                  placeholder="Seu nome" style={inputStyle}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderBottomColor = '#434933'}
                />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: '#8d9479', display: 'block', marginBottom: '6px' }}>E-MAIL</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="seu@email.com" style={inputStyle}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderBottomColor = '#434933'}
                />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: '#8d9479', display: 'block', marginBottom: '6px' }}>MENSAGEM</label>
                <textarea rows={3} value={form.mensagem} onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
                  placeholder="Descreva seu interesse..."
                  style={{ ...inputStyle, resize: 'none', borderBottom: 'none', border: '1px solid #434933', padding: '10px 12px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = '#434933'}
                />
              </div>
              <button type="submit" style={{
                background: 'var(--accent)', border: 'none', color: '#131313',
                padding: '15px 24px', cursor: 'pointer',
                fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.12em', width: '100%', transition: 'opacity 0.12s'
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >ENVIAR SOLICITAÇÃO →</button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

// ── ColecaoPage ───────────────────────────────────────────────────────────────
function ColecaoPage({ products, categories, onSelectProduct, activeCategory, setActiveCategory }) {
  const filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  return (
    <div>
      {/* Header */}
      <div style={{
        borderBottom: '2px solid #434933', padding: '28px 36px 24px',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        background: 'var(--surface-low)'
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: '6px' }}>
            // COLEÇÕES · {filtered.length} MODELOS
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: '#ffffff', lineHeight: 1, margin: 0 }}>
            CATÁLOGO 2026
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                background: isActive ? 'var(--accent)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--accent)' : '#434933'}`,
                color: isActive ? '#131313' : '#8d9479',
                padding: '8px 16px', cursor: 'pointer',
                fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', transition: 'all 0.12s'
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = '#434933'; }}
              >{cat.label}</button>
            );
          })}
        </div>
      </div>

      {/* Product grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: '#434933' }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: 'var(--bg)' }}>
            <ProductCard product={p} onSelect={onSelectProduct} />
          </div>
        ))}
      </div>

      <div style={{ padding: '20px 36px', borderTop: '1px solid #434933', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#434933', letterSpacing: '0.06em' }}>
          {filtered.length}/{products.length} REGISTROS · CAVALERA PORTFOLIO
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#434933', letterSpacing: '0.06em' }}>1995–2026</span>
      </div>
    </div>
  );
}

// ── ProductDetailPage — editorial layout (matches original upload) ─────────────
function ProductDetailPage({ product, onBack, onSolicitar, showTechOverlay }) {
  const calloutIcons = ['engineering', 'recycling', 'verified_user'];
  const calloutTexts = [
    'Cada componente é projetado para resistir ao ambiente de alta fricção da selva de concreto.',
    'Materiais selecionados do excedente da cidade. Borracha reciclada, polímeros de base vegetal.',
    'Testado contra o asfalto da megalópole. Componentes sobre-engenheirados para durar décadas.'
  ];

  return (
    <div>
      {/* Back bar */}
      <div style={{
        padding: '14px 36px', borderBottom: '1px solid #434933',
        display: 'flex', alignItems: 'center', gap: '16px',
        background: 'var(--surface-low)'
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: '1px solid #434933', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px',
          fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.08em', color: '#8d9479', transition: 'border-color 0.12s'
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#434933'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
          COLEÇÕES
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '4px 10px', letterSpacing: '0.1em' }}>
          UNIT ID: {product.id}-URBAN
        </span>
      </div>

      {/* ── HERO (full-bleed blueprint) ── */}
      <header style={{
        position: 'relative', width: '100%', height: '600px',
        background: '#0a0a0a', overflow: 'hidden',
        backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(163,216,0,0.025) 10px,rgba(163,216,0,0.025) 11px)'
      }}>
        {/* Large blueprint centred, low opacity */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', opacity: 0.18, padding: '60px' }}>
          <ProductBlueprint productId={product.id} />
        </div>
        {/* Sharper blueprint on top */}
        <div style={{ position: 'absolute', top: '10%', left: '20%', right: '20%', bottom: '24%', color: 'var(--accent)', opacity: 0.75 }}>
          <ProductBlueprint productId={product.id} />
        </div>
        {/* Gradient vignette bottom */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0a0a0a 22%, transparent 65%)' }} />
        {/* Text overlay — bottom left */}
        <div style={{ position: 'absolute', bottom: '40px', left: '40px', maxWidth: '640px', zIndex: 2 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '4px 10px', letterSpacing: '0.1em', display: 'inline-block', marginBottom: '16px', background: 'rgba(0,0,0,0.6)' }}>
            UNIT ID: {product.id}-URBAN
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px,5vw,62px)', color: '#ffffff', lineHeight: 0.95, margin: '0 0 16px', textTransform: 'uppercase' }}>
            {product.series}: {product.name}
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#c3caac', lineHeight: 1.7, maxWidth: '520px' }}>
            {product.description}
          </p>
        </div>
        {/* Tech overlay coords */}
        {showTechOverlay !== false && (
          <>
            <div style={{ position: 'absolute', top: '20px', left: '40px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', opacity: 0.4, letterSpacing: '0.06em' }}>X-AXIS_LOCK [49.201]</div>
            <div style={{ position: 'absolute', top: '20px', right: '40px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', opacity: 0.4, letterSpacing: '0.06em' }}>Y-AXIS_LOCK [12.883]</div>
          </>
        )}
      </header>

      {/* ── MAIN GRID: narrative + schematic ── */}
      <section style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', borderBottom: '2px solid #434933' }}>
        {/* Left column: narrative + specs */}
        <div style={{ borderRight: '1px solid #434933', display: 'flex', flexDirection: 'column' }}>
          {/* Narrative card */}
          <div style={{ padding: '36px 36px 28px', borderBottom: '1px solid #434933', background: 'var(--surface-low)' }}>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: '16px' }}>// THE NARRATIVE</h3>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#c3caac', lineHeight: '1.85', margin: 0 }}>{product.longDescription}</p>
            <div style={{ marginTop: '24px', height: '1px', background: '#434933' }} />
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#434933', letterSpacing: '0.06em' }}>
              <span>ORIGIN: {product.origin}</span>
              <span>LAT: {product.lat}</span>
            </div>
          </div>

          {/* Specs card */}
          <div style={{ padding: '32px 36px 36px', flex: 1, background: 'var(--surface-high)', border: '0' }}>
            <div style={{ border: '2px solid var(--accent)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#ffffff', marginBottom: '20px' }}>PROTOCOL: MATERIAL SPECS</h3>
              <SpecTable specs={product.specs} />
            </div>
            <button onClick={onSolicitar} style={{
              width: '100%', background: 'transparent',
              border: '2px solid #ffffff', color: '#ffffff',
              padding: '16px 20px', cursor: 'pointer',
              fontFamily: 'var(--font-label)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '0.12em', transition: 'all 0.15s'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.color = '#131313'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
            >SOLICITAR INFORMAÇÕES →</button>
          </div>
        </div>

        {/* Right column: schematic views */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto' }}>
          {/* Macro detail 1 */}
          <div style={{ aspectRatio: '1', background: '#0e0e0e', borderBottom: '1px solid #434933', borderRight: '1px solid #434933', position: 'relative', overflow: 'hidden',
            backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(163,216,0,0.03) 8px,rgba(163,216,0,0.03) 9px)'
          }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '3px 7px', background: 'rgba(0,0,0,0.7)', letterSpacing: '0.06em' }}>
              HD_MACRO_01 // HARDWARE_STRESS_TEST
            </div>
            <div style={{ position: 'absolute', inset: '24px', color: 'var(--accent)', opacity: 0.9 }}>
              <ProductBlueprint productId={product.id} />
            </div>
            <div style={{ position: 'absolute', bottom: '14px', right: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '24px', height: '1px', background: 'var(--accent)', opacity: 0.6 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--accent)', letterSpacing: '0.06em', opacity: 0.8 }}>{product.callouts[0]}</span>
            </div>
          </div>

          {/* Macro detail 2 */}
          <div style={{ aspectRatio: '1', background: '#0e0e0e', borderBottom: '1px solid #434933', position: 'relative', overflow: 'hidden',
            backgroundImage: 'repeating-linear-gradient(135deg,transparent,transparent 8px,rgba(163,216,0,0.03) 8px,rgba(163,216,0,0.03) 9px)'
          }}>
            <div style={{ position: 'absolute', top: '10px', left: '10px', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)', border: '1px solid #434933', padding: '3px 7px', background: 'rgba(0,0,0,0.7)', letterSpacing: '0.06em', color: '#8d9479' }}>
              HD_MACRO_02 // GRIP_COEFFICIENT
            </div>
            <div style={{ position: 'absolute', inset: '24px', color: 'var(--accent)', opacity: 0.5, transform: 'scaleX(-1)' }}>
              <ProductBlueprint productId={product.id} />
            </div>
            <div style={{ position: 'absolute', bottom: '14px', left: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--accent)', letterSpacing: '0.06em', opacity: 0.7 }}>{product.callouts[1]}</span>
            </div>
          </div>

          {/* Large schematic */}
          <div style={{ gridColumn: 'span 2', height: '280px', background: '#0a0a0a', position: 'relative', overflow: 'hidden',
            backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(163,216,0,0.02) 10px,rgba(163,216,0,0.02) 11px)'
          }}>
            <div style={{ position: 'absolute', inset: '32px 140px', color: 'var(--accent)', opacity: 0.65 }}>
              <ProductBlueprint productId={product.id} />
            </div>
            {showTechOverlay !== false && (
              <div style={{ position: 'absolute', inset: 0, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)', opacity: 0.4, letterSpacing: '0.06em' }}>
                  <span>X-AXIS_LOCK [49.201]</span>
                  <span>Y-AXIS_LOCK [12.883]</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)', opacity: 0.5, marginBottom: '4px', letterSpacing: '0.06em' }}>SCANNING... 100%</div>
                    <div style={{ width: '120px', height: '2px', background: 'rgba(163,216,0,0.15)' }}>
                      <div style={{ width: '100%', height: '100%', background: 'var(--accent)' }} />
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)', opacity: 0.4, letterSpacing: '0.06em' }}>REF: {product.ref}</span>
                </div>
              </div>
            )}
            {/* Callout right side */}
            <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {product.callouts.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '1px', background: 'var(--accent)', opacity: 0.5 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--accent)', opacity: 0.7, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TECHNICAL CALLOUTS (3-col) ── */}
      <section style={{ padding: '0', borderBottom: '2px solid #434933', background: 'var(--surface-low)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
          {product.callouts.map((c, i) => (
            <div key={i} style={{
              padding: '32px 28px', borderRight: i < 2 ? '1px solid #434933' : 'none',
              transition: 'border-color 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.borderTopColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderTopColor = '#434933'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--accent)', display: 'block', marginBottom: '14px' }}>{calloutIcons[i]}</span>
              <h4 style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: '#ffffff', marginBottom: '10px', textTransform: 'uppercase' }}>{c}</h4>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8d9479', lineHeight: '1.7', margin: 0 }}>{calloutTexts[i]}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 36px', borderTop: '1px solid #434933', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-low)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, color: '#8d9479', letterSpacing: '0.1em', textTransform: 'uppercase' }}>CAVALERA INDUSTRIAL SECTOR</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#434933', marginTop: '2px' }}>© 1995–2026 ALL RIGHTS RESERVED</div>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Hardware Specs', 'Source Code', 'Protocol'].map(l => (
            <a key={l} href="#" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#8d9479', textDecoration: 'none', transition: 'color 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={e => e.currentTarget.style.color = '#8d9479'}
            >{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ── StoryPage ─────────────────────────────────────────────────────────────────
function StoryPage() {
  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '64px 48px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: '12px' }}>
        // THE STORY · EST. 1995 · SÃO PAULO
      </div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '72px', color: '#ffffff', lineHeight: 0.92, margin: '0 0 40px' }}>
        REBELIÃO<br />URBANA.
      </h1>
      {[
        'Cavalera nasceu no asfalto. Não no estúdio — na rua. Em 1995, quando o concreto de São Paulo ainda não tinha nome para o que estava acontecendo.',
        'Nossa filosofia é simples: cada peça tem que sobreviver à cidade. Ao calor do asfalto no verão, à chuva de março, ao chão da noite.',
        'O artesão do sertão e o engenheiro da metrópole compartilham o mesmo objetivo: fazer algo que dure. Essa é a convergência que define a Cavalera.',
        'Não fabricamos moda. Fabricamos equipamento para quem usa a cidade como território.'
      ].map((p, i) => (
        <p key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '15px', color: '#c3caac', lineHeight: '1.85', margin: '0 0 28px' }}>{p}</p>
      ))}
      <div style={{ marginTop: '48px', borderTop: '1px solid #434933', paddingTop: '28px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
        {[['1995', 'FUNDAÇÃO'], ['30+', 'ANOS ATIVOS'], ['6', 'MODELOS 2026']].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '40px', color: 'var(--accent)', lineHeight: 1 }}>{n}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#8d9479', marginTop: '4px', letterSpacing: '0.1em' }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ManifestoPage ─────────────────────────────────────────────────────────────
function ManifestoPage() {
  const lines = [
    'RECUSAMOS A OBSOLESCÊNCIA PROGRAMADA.',
    'CADA COSTURA É UMA LINHA DE CÓDIGO.',
    'O ASFALTO É NOSSO LABORATÓRIO.',
    'O SERTÃO NOS DEU AS MÃOS. A CIDADE NOS DEU O PROPÓSITO.',
    'CONSTRUÍDO PARA DURAR. NÃO PARA VENDER.'
  ];
  return (
    <div style={{ padding: '64px 48px', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: '48px' }}>
        // MANIFESTO · CAVALERA · 2026
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, color: 'var(--accent)', opacity: 0.5, marginTop: '8px', minWidth: '32px' }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,42px)', color: '#ffffff', margin: 0, lineHeight: 1.05, letterSpacing: '0.01em' }}>
              {line}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CollabPage ────────────────────────────────────────────────────────────────
function CollabPage() {
  return (
    <div style={{ padding: '64px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: '16px' }}>// COLLABORATIONS · CLASSIFIED</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: '#ffffff', lineHeight: 0.95, margin: '0 0 24px' }}>EM<br />BREVE.</h1>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#8d9479', maxWidth: '360px', lineHeight: 1.7 }}>
        Novas colaborações em desenvolvimento. Acesso restrito à resistência cadastrada.
      </p>
      <div style={{ marginTop: '40px', border: '1px solid var(--accent)', padding: '12px 32px', fontFamily: 'var(--font-label)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--accent)' }}>
        ACESSO LIBERADO EM BREVE
      </div>
    </div>
  );
}

// ── ContactPage ───────────────────────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = React.useState({ nome: '', email: '', interesse: '', mensagem: '' });
  const [sent, setSent] = React.useState(false);
  const products = window.CAVALERA.products;

  const inputStyle = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: '2px solid #434933', color: '#e5e2e1',
    fontFamily: 'var(--font-mono)', fontSize: '14px',
    padding: '10px 0', outline: 'none', letterSpacing: '0.04em',
    transition: 'border-color 0.15s'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '90vh' }}>
      {/* Left: info */}
      <div style={{ padding: '64px 48px', borderRight: '1px solid #434933', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.14em', marginBottom: '12px' }}>// CONTATO</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '64px', color: '#ffffff', lineHeight: 0.92, margin: '0 0 40px' }}>
            FALE COM<br />A GENTE.
          </h1>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#c3caac', lineHeight: 1.8, maxWidth: '380px' }}>
            Para informações sobre nossos modelos, colaborações, imprensa ou representações comerciais.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[['alternate_email', 'contato@cavalera.com.br'], ['location_on', 'São Paulo, SP — Brasil'], ['schedule', 'Seg–Sex, 09h–18h']].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--accent)' }}>{icon}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#c3caac' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div style={{ padding: '64px 48px' }}>
        {sent ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '56px', color: 'var(--accent)', marginBottom: '12px' }}>RECEBIDO.</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: '#8d9479' }}>Retornaremos em até 48 horas.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
              <label style={{ fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#8d9479', display: 'block', marginBottom: '8px' }}>NOME</label>
              <input required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Seu nome completo" style={inputStyle}
                onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderBottomColor = '#434933'} />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#8d9479', display: 'block', marginBottom: '8px' }}>E-MAIL</label>
              <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="seu@email.com" style={inputStyle}
                onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderBottomColor = '#434933'} />
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#8d9479', display: 'block', marginBottom: '8px' }}>MODELO DE INTERESSE</label>
              <select value={form.interesse} onChange={e => setForm(f => ({ ...f, interesse: e.target.value }))}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                onFocus={e => e.target.style.borderBottomColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderBottomColor = '#434933'}>
                <option value="" style={{ background: '#1c1b1b' }}>Selecionar modelo…</option>
                {products.map(p => <option key={p.id} value={p.id} style={{ background: '#1c1b1b' }}>{p.name} — {p.series}</option>)}
                <option value="geral" style={{ background: '#1c1b1b' }}>Consulta geral</option>
              </select>
            </div>
            <div>
              <label style={{ fontFamily: 'var(--font-label)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: '#8d9479', display: 'block', marginBottom: '8px' }}>MENSAGEM</label>
              <textarea rows={4} value={form.mensagem} onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))} placeholder="Descreva seu interesse ou dúvida…"
                style={{ ...inputStyle, resize: 'none', borderBottom: 'none', border: '1px solid #434933', padding: '12px', lineHeight: 1.7 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = '#434933'} />
            </div>
            <button type="submit" style={{
              background: 'var(--accent)', border: 'none', color: '#131313',
              padding: '18px 24px', cursor: 'pointer',
              fontFamily: 'var(--font-label)', fontSize: '12px', fontWeight: 700,
              letterSpacing: '0.12em', transition: 'opacity 0.12s'
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >ENVIAR SOLICITAÇÃO →</button>
          </form>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ColecaoPage, ProductDetailPage, StoryPage, ManifestoPage, CollabPage, ContactPage, ContactModal });
