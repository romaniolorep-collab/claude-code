// ── Hero section — 5-layer parallax cinematic ───────────────────────────────

// ── RetinaScanner ─────────────────────────────────────────────────────────
function RetinaScanner({ visible, isMobile }) {
  const rings = [
    { r: 260, dur: '10s', dash: '10 7',  op: 0.22, rev: false },
    { r: 218, dur: '7s',  dash: '4 14',  op: 0.28, rev: true  },
    { r: 174, dur: '4.5s',dash: '2 9',   op: 0.32, rev: false },
    { r: 130, dur: '3s',  dash: '6 5',   op: 0.30, rev: true  },
    { r: 86,  dur: '2.2s',dash: '3 7',   op: 0.26, rev: false },
    { r: 44,  dur: '1.6s',dash: '2 5',   op: 0.22, rev: true  },
  ];
  const ticks = Array.from({length:24}, (_, i) => {
    const a = (i * 15 - 90) * Math.PI / 180;
    const outer = i % 2 === 0 ? 272 : 268;
    const inner = i % 2 === 0 ? 256 : 262;
    return {
      x1: 280 + inner * Math.cos(a), y1: 280 + inner * Math.sin(a),
      x2: 280 + outer * Math.cos(a), y2: 280 + outer * Math.sin(a),
      w: i % 4 === 0 ? 2.5 : 1, op: i % 4 === 0 ? 0.55 : 0.28
    };
  });

  const sz = isMobile ? '450px' : '560px';

  return (
    <div style={{
      position:'absolute', left:'50%', top: isMobile ? '62%' : '82%',
      transform:'translate(-50%,-50%)',
      width: sz, height: sz,
      opacity: visible ? 1 : 0,
      transition:'opacity 1.4s ease 1.2s',
      pointerEvents:'none', zIndex:2
    }}>
      <div style={{
        position:'absolute', inset:0, borderRadius:'50%',
        background:'conic-gradient(from 0deg, transparent 78%, rgba(163,216,0,0.38) 92%, transparent 100%)',
        animation:'ringRotate 4.5s linear infinite'
      }} />
      <svg viewBox="0 0 560 560" style={{ position:'absolute', inset:0, width:'100%', height:'100%', overflow:'visible' }}>
        {rings.map((ring, i) => (
          <g key={i} style={{ transformOrigin:'280px 280px', animation:`${ring.rev ? 'ringRotateRev' : 'ringRotate'} ${ring.dur} linear infinite` }}>
            <circle cx="280" cy="280" r={ring.r} fill="none" stroke="var(--accent)" strokeWidth="0.75" strokeOpacity={ring.op} strokeDasharray={ring.dash} />
          </g>
        ))}
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="var(--accent)" strokeWidth={t.w} strokeOpacity={t.op} />
        ))}
        <line x1="0" y1="280" x2="560" y2="280" stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.05" />
        <line x1="280" y1="0"  x2="280" y2="560" stroke="var(--accent)" strokeWidth="0.4" strokeOpacity="0.05" />
        <g style={{ transformOrigin:'280px 280px', animation:'ringRotate 4.5s linear infinite' }}>
          <line x1="280" y1="280" x2="280" y2="20" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.7" />
          <circle cx="280" cy="20" r="4" fill="var(--accent)" opacity="0.65" />
        </g>
        <circle cx="280" cy="280" r="6" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.55"
          style={{ animation:'scanPulse 1.8s ease-in-out infinite' }} />
        <circle cx="280" cy="280" r="2" fill="var(--accent)" opacity="0.7" />
        {[[280,8,'N'],[280,558,'S'],[8,285,'W'],[548,285,'E']].map(([x,y,l]) => (
          <text key={l} x={x} y={y} fill="var(--accent)" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.15" letterSpacing="2">{l}</text>
        ))}
      </svg>
      <div style={{ position:'absolute', bottom:'18px', right:'4px', fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--accent)', opacity:0.2, textAlign:'right', lineHeight:2, letterSpacing:'0.08em' }}>
        RETINAL SCAN ✓<br />ID: CAV_7749_URBAN<br />STATUS: VERIFIED
      </div>
      <div style={{ position:'absolute', top:'18px', left:'4px', fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--accent)', opacity:0.16, lineHeight:2, letterSpacing:'0.08em' }}>
        IRIS_SCAN v4.2<br />FREQ: 24.8 GHz
      </div>
    </div>
  );
}

// ── HeroSection ───────────────────────────────────────────────────────────────
function HeroSection({ isMobile }) {
  // 5 parallax layers — back (slow) → front (fast)
  const deepRef   = React.useRef(); // L0 eagle + grid    0.06× (horizon)
  const scanRef   = React.useRef(); // L1 retina scanner  0.20×
  const bpRef     = React.useRef(); // L2 blueprints      0.36×
  const fgRef     = React.useRef(); // L3 foreground geo  0.58×
  const txtRef    = React.useRef(); // text               0.14× + fade

  const eagleImgRef = React.useRef();
  const [loaded, setLoaded]      = React.useState(false);
  const [locked, setLocked]      = React.useState(false);
  // Eye socket position in natural image (measured by BFS alpha scan)
  const EYE_NAT_LX = 0.337, EYE_NAT_RX = 0.661, EYE_NAT_Y = 0.044;
  const EAGLE_NAT_W = 1425, EAGLE_NAT_H = 1489;
  const [eyePos, setEyePos] = React.useState({ top:'4%', leftPx: null, rightPx: null });
  const [eyebrowTxt, setEyebrow] = React.useState('');
  const [revoltTxt,  setRevolt]  = React.useState('');

  const EYEBROW = 'BORN SP · BUILT DIFFERENT · EST. 1995';
  const REVOLT  = 'NUNCA VÃO NOS DOMAR';
  const products = window.CAVALERA.products;

  React.useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    const onScroll = () => {
      const sy = window.scrollY;
      if (deepRef.current)  deepRef.current.style.transform  = `translateY(${sy * 0.06}px)`;
      if (scanRef.current)  scanRef.current.style.transform  = `translateY(${sy * 0.20}px)`;
      if (bpRef.current)    bpRef.current.style.transform    = `translateY(${sy * 0.36}px)`;
      if (fgRef.current)    fgRef.current.style.transform    = `translateY(${sy * 0.58}px)`;
      if (txtRef.current) {
        txtRef.current.style.transform = `translateY(${sy * 0.14}px)`;
        txtRef.current.style.opacity   = String(Math.max(0, 1 - sy / 480));
      }
    };
    const lockT = setTimeout(() => setLocked(true), 2800);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); clearTimeout(lockT); window.removeEventListener('scroll', onScroll); };
  }, []);


  // Eagle reveal — wedge cresce em 4.5s junto com o braço do scanner
  React.useEffect(() => {
    if (!loaded) return;
    const DURATION = 1800;
    const raf = { id: null };
    const wedge = (deg) => {
      if (deg <= 0) return 'circle(0% at 50% 50%)';
      if (deg >= 360) return 'none';
      const pts = ['50% 50%'];
      const n = Math.max(2, Math.ceil(deg / 3));
      for (let i = 0; i <= n; i++) {
        const a = (-90 + deg * i / n) * Math.PI / 180;
        pts.push(`${(50 + 200 * Math.cos(a)).toFixed(1)}% ${(50 + 200 * Math.sin(a)).toFixed(1)}%`);
      }
      return `polygon(${pts.join(',')})`;
    };
    // Inicia após o scanner aparecer (delay = 1.2s)
    const delay = setTimeout(() => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / DURATION, 1);
        const el = eagleImgRef.current;
        if (el) {
          el.style.clipPath = wedge(t * 360);
          el.style.webkitClipPath = wedge(t * 360);
          el.style.opacity = t >= 1 ? '0.45' : '0.75';
        }
        if (t < 1) raf.id = requestAnimationFrame(tick);
      };
      raf.id = requestAnimationFrame(tick);
    }, 1200);
    return () => { clearTimeout(delay); cancelAnimationFrame(raf.id); };
  }, [loaded]);

  React.useEffect(() => {
    if (!loaded) return;
    // Eyebrow typing
    let i = 0;
    const eyeId = setInterval(() => {
      setEyebrow(EYEBROW.slice(0, i++));
      if (i > EYEBROW.length) clearInterval(eyeId);
    }, 26);
    // REVOLT typing — starts after eyebrow + 500ms pause
    let revId;
    const revDelayId = setTimeout(() => {
      let j = 0;
      revId = setInterval(() => {
        setRevolt(REVOLT.slice(0, j++));
        if (j > REVOLT.length) clearInterval(revId);
      }, 48);
    }, EYEBROW.length * 26 + 500);
    return () => { clearInterval(eyeId); clearTimeout(revDelayId); clearInterval(revId); };
  }, [loaded]);

  // Dynamic eye positioning — recalc on load + resize
  React.useEffect(() => {
    const recalc = () => {
      const img = eagleImgRef.current;
      if (!img || !img.offsetWidth || !img.offsetHeight) return;
      const cW = img.offsetWidth, cH = img.offsetHeight;
      const natAspect = EAGLE_NAT_W / EAGLE_NAT_H;
      const conAspect = cW / cH;
      let rendW, rendH, padX, padY;
      if (natAspect <= conAspect) {
        rendH = cH; rendW = cH * natAspect;
        padX = (cW - rendW) / 2; padY = 0;
      } else {
        rendW = cW; rendH = cW / natAspect;
        padX = 0; padY = (cH - rendH) / 2;
      }
      const eyeW = isMobile ? 7 : 10;
      const topPx  = padY + EYE_NAT_Y  * rendH - eyeW / 2;
      const leftPx = padX + EYE_NAT_LX * rendW - eyeW / 2;
      const rightLx = padX + EYE_NAT_RX * rendW - eyeW / 2;
      setEyePos({ topPx, leftPx, rightLx, eyeW });
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [loaded, isMobile]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
  };

  const bpConfigs = [
    { id: 'BR-2995', top: '6%',   left: '1%',   width: '300px', opacity: 0.07, transform: 'rotate(-13deg)' },
    { id: 'BR-1888', top: '9%',   right: '2%',  width: '260px', opacity: 0.05, transform: 'rotate(9deg)'   },
    { id: 'BR-3300', top: '40%',  left: '3%',   width: '240px', opacity: 0.04, transform: 'rotate(5deg)'   },
    { id: 'BR-0744', bottom:'12%',right: '5%',  width: '280px', opacity: 0.05, transform: 'rotate(-8deg)'  },
    { id: 'BR-0522', bottom:'8%', left: '32%',  width: '220px', opacity: 0.04, transform: 'rotate(11deg)'  },
    { id: 'BR-1201', top: '32%',  right: '28%', width: '210px', opacity: 0.035,transform: 'rotate(-10deg)' },
  ];

  // Foreground floating markers (L3 — move fastest, feel closest)
  const fgMarkers = isMobile ? [
    { top:'30%', left:'4%',   label:'LAT -23.548°', opacity:0.22 },
    { top:'38%', right:'4%',  label:'LON -46.637°', opacity:0.18 },
    { bottom:'14%', left:'5%', label:'ALT 760m',    opacity:0.16 },
    { bottom:'9%',  right:'5%',label:'VEL 0.0',     opacity:0.18 },
  ] : [
    { top:'14%', left:'8%',  label:'LAT -23.548°', opacity:0.18 },
    { top:'22%', right:'9%', label:'LON -46.637°', opacity:0.14 },
    { bottom:'22%', left:'6%',  label:'ALT 760m',  opacity:0.12 },
    { bottom:'18%', right:'7%', label:'VEL 0.0',   opacity:0.16 },
  ];

  const hexLines = Array.from({length:50}, (_,i) => ((i*37+123) % 256).toString(16).padStart(2,'0').toUpperCase());

  const ani = (delay, extra) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
    ...extra
  });

  return (
    <section id="hero" style={{ height:'100vh', position:'relative', overflow:'hidden', background:'#040404' }}>

      {/* ── L0 deep: eagle + depth grid ── */}
      <div ref={deepRef} style={{ position:'absolute', inset:0, willChange:'transform' }}>
        {/* Perspective depth grid — subtlest layer */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(163,216,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(163,216,0,0.03) 1px, transparent 1px)', backgroundSize:'60px 60px', perspectiveOrigin:'50% 100%', transform:'perspective(800px) rotateX(22deg) translateY(-10%)', pointerEvents:'none' }} />

        {/* Hatch overlay */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(163,216,0,0.016) 12px,rgba(163,216,0,0.016) 13px)', pointerEvents:'none' }} />

        {/* Eagle + olhos vermelhos */}
        <div style={{ position:'absolute', left:'50%', top: isMobile ? '62%' : '82%', transform:'translate(-50%,-50%)', pointerEvents:'none', zIndex:1 }}>
          <div style={{ position:'relative', display:'inline-block' }}>
            <img ref={eagleImgRef} src="uploads/cavalera logo final.png" alt=""
              style={{
                width: isMobile ? '92vw' : '54vw',
                maxWidth:'720px', maxHeight: isMobile ? '58vh' : '60vh',
                objectFit:'contain',
                filter:'invert(1)',
                display:'block',
                opacity: 0,
                clipPath:'circle(0% at 50% 50%)',
              }}
            />
            {/* Olho esquerdo — posição calculada dinamicamente */}
            <div style={{
              position:'absolute',
              top:  eyePos.topPx  != null ? `${eyePos.topPx}px`  : '4%',
              left: eyePos.leftPx != null ? `${eyePos.leftPx}px` : '36%',
              width: `${eyePos.eyeW || (isMobile ? 7 : 10)}px`,
              height:`${eyePos.eyeW || (isMobile ? 7 : 10)}px`,
              borderRadius:'50%',
              background:'#cc0000',
              boxShadow:'0 0 6px 3px rgba(220,0,0,0.85), 0 0 18px 8px rgba(180,0,0,0.4)',
              animation:'redEyeBlink 5.2s ease-in-out infinite, redEyePulse 2.8s ease-in-out infinite',
              animationDelay:'3.2s, 3.2s',
              opacity:0,
            }} />
            {/* Olho direito — posição calculada dinamicamente */}
            <div style={{
              position:'absolute',
              top:  eyePos.topPx   != null ? `${eyePos.topPx}px`   : '4%',
              left: eyePos.rightLx != null ? `${eyePos.rightLx}px` : 'auto',
              right: eyePos.rightLx != null ? 'auto' : '36%',
              width: `${eyePos.eyeW || (isMobile ? 7 : 10)}px`,
              height:`${eyePos.eyeW || (isMobile ? 7 : 10)}px`,
              borderRadius:'50%',
              background:'#cc0000',
              boxShadow:'0 0 6px 3px rgba(220,0,0,0.85), 0 0 18px 8px rgba(180,0,0,0.4)',
              animation:'redEyeBlink 5.2s ease-in-out infinite, redEyePulse 2.8s ease-in-out infinite',
              animationDelay:'3.5s, 3.5s',
              opacity:0,
            }} />
          </div>
        </div>

        {/* Radial depth vignette */}
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse 80% 75% at 50% ${isMobile ? '62%' : '82%'}, transparent 25%, rgba(4,4,4,0.78) 88%)`, pointerEvents:'none' }} />

        {/* Target acquisition frame — aparece ao lock */}
        <div style={{ position:'absolute', left:'50%', top: isMobile ? '62%' : '82%', transform:'translate(-50%,-50%)', width: isMobile ? '88vw' : '54vw', maxWidth:'700px', height: isMobile ? '88vw' : '56vw', maxHeight:'730px', pointerEvents:'none', opacity: locked ? 0.32 : 0, transition:'opacity 1.2s ease' }}>
          {[
            { top:0,    left:0,  borderTop:'1px solid var(--accent)', borderLeft:'1px solid var(--accent)'  },
            { top:0,    right:0, borderTop:'1px solid var(--accent)', borderRight:'1px solid var(--accent)' },
            { bottom:0, left:0,  borderBottom:'1px solid var(--accent)', borderLeft:'1px solid var(--accent)'  },
            { bottom:0, right:0, borderBottom:'1px solid var(--accent)', borderRight:'1px solid var(--accent)' },
          ].map((s, i) => <div key={i} style={{ position:'absolute', width:'48px', height:'48px', ...s }} />)}
          <div style={{ position:'absolute', top:'-16px', left:'50%', transform:'translateX(-50%)', fontFamily:'var(--font-mono)', fontSize:'7px', color:'var(--accent)', opacity:0.5, letterSpacing:'0.18em', whiteSpace:'nowrap' }}>ID: CAV_7749_URBAN</div>
          <div style={{ position:'absolute', bottom:'-16px', right:'4px', fontFamily:'var(--font-mono)', fontSize:'7px', color:'var(--accent)', opacity:0.38, letterSpacing:'0.1em' }}>LOCK ✓</div>
          {/* Center dot */}
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'8px', height:'8px', border:'1px solid var(--accent)', borderRadius:'50%', opacity:0.4 }} />
        </div>
      </div>

      {/* ── L1 mid: retina scanner ── */}
      <div ref={scanRef} style={{ position:'absolute', inset:0, willChange:'transform' }}>
        <RetinaScanner visible={loaded} isMobile={isMobile} />
      </div>

      {/* ── L2: blueprints ── */}
      <div ref={bpRef} style={{ position:'absolute', inset:0, willChange:'transform' }}>
        {bpConfigs.map((cfg, i) => {
          const { id, ...pos } = cfg;
          return <div key={i} style={{ position:'absolute', color:'var(--accent)', ...pos }}><ProductBlueprint productId={id} /></div>;
        })}
      </div>

      {/* ── Scan lines ── */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent 0%,var(--accent) 38%,var(--accent) 62%,transparent 100%)', animation:'heroScan 7s linear infinite', opacity:0.16, pointerEvents:'none', zIndex:3 }} />
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent 0%,rgba(163,216,0,0.5) 50%,transparent 100%)', animation:'heroScan 11s linear infinite 3.5s', opacity:0.08, pointerEvents:'none', zIndex:3 }} />
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent 15%,rgba(163,216,0,0.22) 50%,transparent 85%)', animation:'heroScan 18s linear infinite 8s', opacity:0.1, pointerEvents:'none', zIndex:3 }} />
      {/* Danger scan — vermelho */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'1px', background:'linear-gradient(90deg,transparent 5%,rgba(255,50,50,0.55) 42%,rgba(255,50,50,0.55) 58%,transparent 95%)', animation:'heroScan 5s linear infinite 1.8s', opacity:0.18, pointerEvents:'none', zIndex:3 }} />

      {/* Circuit trace lines — desktop 4 linhas, mobile 2 na zona livre */}
      {(isMobile ? [30, 54] : [14, 38, 64, 82]).map((pct, i) => (
        <div key={i} style={{ position:'absolute', top:`${pct}%`, left:0, right:0, height:'1px', background:'linear-gradient(90deg, transparent 0%, rgba(163,216,0,0.07) 15%, rgba(163,216,0,0.07) 85%, transparent 100%)', pointerEvents:'none', zIndex:1, transformOrigin:'left center', opacity: loaded ? 1 : 0, animation: loaded ? `traceH 0.9s ease ${2.0+i*0.18}s both` : 'none' }} />
      ))}

      {/* Hazard corner strips — todos os viewports */}
      {[
        { top:0, left:0 }, { top:0, right:0 },
        { bottom:'34px', left:0 }, { bottom:'34px', right:0 }
      ].map((pos, i) => (
        <div key={i} style={{ position:'absolute', width: isMobile ? '52px' : '72px', height: isMobile ? '52px' : '72px', ...pos, backgroundImage:'repeating-linear-gradient(45deg,rgba(163,216,0,0.038) 0,rgba(163,216,0,0.038) 2px,transparent 2px,transparent 10px)', pointerEvents:'none', zIndex:1, opacity: loaded ? 1 : 0, transition:`opacity 0.5s ease ${1.6+i*0.1}s` }} />
      ))}


      {/* ── HUD PANELS — desktop only ── */}
      {!isMobile && <>

        {/* LEFT HUD */}
        <div style={{ position:'absolute', left:0, top:0, bottom:'34px', width:'116px', pointerEvents:'none', zIndex:3, opacity: loaded ? 1 : 0, transition:'opacity 0.4s ease 1.8s' }}>
          <div style={{ position:'absolute', top:'8%', bottom:'8%', right:0, width:'1px', background:'linear-gradient(to bottom, transparent, rgba(163,216,0,0.14) 30%, rgba(163,216,0,0.14) 70%, transparent)' }} />
          <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', padding:'0 14px 0 10px', fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--accent)', lineHeight:'17px', letterSpacing:'0.04em', animation: loaded ? 'hudIn 0.5s ease 1.8s both' : 'none' }}>
            <div style={{ opacity:0.4, marginBottom:'7px', fontSize:'7px', letterSpacing:'0.1em' }}>// CAVALERA.SYS</div>
            <div style={{ height:'1px', background:'rgba(163,216,0,0.18)', marginBottom:'7px' }} />
            {[['KERNEL','v4.2.1'],['NEURAL','ACTIVE'],['UPLINK','LOCKED'],['FREQ','24.8GHz']].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', gap:'4px', opacity:0.2 }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ height:'1px', background:'rgba(163,216,0,0.18)', margin:'7px 0' }} />
            <div style={{ opacity:0.45, marginBottom:'3px', fontSize:'7px' }}>
              THREAT <span style={{ color:'#ff4040', animation:'alertBlink 1.1s steps(1) infinite' }}>████</span> MAX
            </div>
            <div style={{ opacity:0.28, fontSize:'7px' }}>STATUS: REBEL</div>
            <div style={{ height:'1px', background:'rgba(163,216,0,0.18)', margin:'7px 0' }} />
            <div style={{ opacity:0.14, fontSize:'7px' }}>EST.SP.1995</div>
            <div style={{ opacity:0.14, fontSize:'7px' }}>AUTH:GRANTED</div>
          </div>
        </div>

        {/* RIGHT HUD */}
        <div style={{ position:'absolute', right:0, top:0, bottom:'34px', width:'116px', pointerEvents:'none', zIndex:3, opacity: loaded ? 1 : 0, transition:'opacity 0.4s ease 2.0s' }}>
          <div style={{ position:'absolute', top:'8%', bottom:'8%', left:0, width:'1px', background:'linear-gradient(to bottom, transparent, rgba(163,216,0,0.14) 30%, rgba(163,216,0,0.14) 70%, transparent)' }} />
          <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', padding:'0 10px 0 14px', width:'100%', fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--accent)', lineHeight:'17px', letterSpacing:'0.04em', textAlign:'right', animation: loaded ? 'hudInR 0.5s ease 2.0s both' : 'none' }}>
            <div style={{ opacity:0.4, marginBottom:'7px', fontSize:'7px', letterSpacing:'0.1em' }}>SYS.URBAN //</div>
            <div style={{ height:'1px', background:'rgba(163,216,0,0.18)', marginBottom:'7px' }} />
            {[['TARGET','LOCK_ON'],['DIST','000.0m'],['SCAN','██████'],['ID','CAV_7749']].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', gap:'4px', opacity:0.2 }}>
                <span>{k}</span><span>{v}</span>
              </div>
            ))}
            <div style={{ height:'1px', background:'rgba(163,216,0,0.18)', margin:'7px 0' }} />
            <div style={{ opacity:0.45, marginBottom:'3px', fontSize:'7px' }}>
              <span style={{ color:'#ff4040', animation:'alertBlink 1.3s steps(1) infinite 0.4s' }}>████</span> DANGER
            </div>
            <div style={{ opacity:0.28, fontSize:'7px' }}>ENGAGE:ACTIVE</div>
            <div style={{ height:'1px', background:'rgba(163,216,0,0.18)', margin:'7px 0' }} />
            <div style={{ opacity:0.14, fontSize:'7px' }}>CAV.SP.1995</div>
            <div style={{ opacity:0.14, fontSize:'7px' }}>PROTOCOL:ON</div>
          </div>
        </div>


      </>}

      {/* ── L3: foreground geo markers — desktop e mobile (mobile c/ posições ajustadas) ── */}
      <div ref={fgRef} style={{ position:'absolute', inset:0, willChange:'transform', pointerEvents:'none', zIndex:4 }}>
        {fgMarkers.map((m, i) => (
          <div key={i} style={{ position:'absolute', ...m, opacity: loaded ? m.opacity : 0, transition:`opacity 0.8s ease ${1.6 + i * 0.15}s`, animation:`depthFloat ${14 + i * 3}s ease-in-out infinite ${i * 2}s` }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
              <div style={{ width:'18px', height:'1px', background:'var(--accent)' }} />
              <span style={{ fontFamily:'var(--font-mono)', fontSize:'8px', color:'var(--accent)', letterSpacing:'0.1em' }}>{m.label}</span>
            </div>
          </div>
        ))}

        {/* Corner targeting reticles — foreground layer */}
        {loaded && [
          { top:'20px',   left:'20px',  borderTop:'1.5px solid var(--accent)', borderLeft:'1.5px solid var(--accent)',   animationDelay:'1.8s' },
          { top:'20px',   right:'20px', borderTop:'1.5px solid var(--accent)', borderRight:'1.5px solid var(--accent)',  animationDelay:'1.9s' },
          { bottom:'48px',left:'20px',  borderBottom:'1.5px solid var(--accent)', borderLeft:'1.5px solid var(--accent)',  animationDelay:'2.0s' },
          { bottom:'48px',right:'20px', borderBottom:'1.5px solid var(--accent)', borderRight:'1.5px solid var(--accent)', animationDelay:'2.1s' },
        ].map((s, i) => (
          <div key={i} style={{ position:'absolute', width:'38px', height:'38px', pointerEvents:'none', animation:`bracketIn 0.5s cubic-bezier(0.16,1,0.3,1) ${s.animationDelay} both`, ...s, animationDelay:undefined }} />
        ))}
      </div>

      {/* ── Cinema letterbox bars (top + bottom, fade in) ── */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'48px', background:'linear-gradient(to bottom, rgba(4,4,4,0.92), transparent)', pointerEvents:'none', zIndex:5 }} />
      <div style={{ position:'absolute', bottom:'34px', left:0, right:0, height:'48px', background:'linear-gradient(to top, rgba(4,4,4,0.92), transparent)', pointerEvents:'none', zIndex:5 }} />


      {/* ── Text layer (L4: 0.14×, slowest visible) ── */}
      <div ref={txtRef} style={{ position:'absolute', top:0, left:0, right:0, bottom:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', willChange:'transform,opacity', paddingTop: isMobile ? '58px' : '88px', paddingLeft: isMobile ? '20px' : '116px', paddingRight: isMobile ? '20px' : '116px', zIndex:6 }}>

        {/* Typing eyebrow */}
        <div style={{ fontFamily:'var(--font-mono)', fontSize: isMobile ? '9px' : '11px', color:'var(--accent)', letterSpacing: isMobile ? '0.06em' : '0.22em', marginBottom: isMobile ? '28px' : '36px', minHeight:'16px', opacity: loaded ? 1 : 0, transition:'opacity 0.3s ease 0.1s', maxWidth:'100%', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {eyebrowTxt}
          <span style={{ opacity: eyebrowTxt.length < EYEBROW.length ? 1 : 0, animation:'cursorBlink 0.5s steps(1) infinite' }}>_</span>
        </div>

        <div style={{ fontFamily:'var(--font-display)', fontSize: isMobile ? 'clamp(22px,6vw,32px)' : 'clamp(32px,3.8vw,58px)', color:'var(--accent)', letterSpacing: isMobile ? '0.10em' : '0.08em', marginTop:'0px', minHeight: isMobile ? '32px' : 'auto', opacity: loaded ? 1 : 0, transition:'opacity 0.3s ease 0.1s', textAlign:'center', lineHeight: isMobile ? 'normal' : '1' }}>
          {revoltTxt}<span style={{ animation:'cursorBlink 0.75s steps(1) infinite' }}>_</span>
        </div>


      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:'52px', left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', opacity: loaded ? 0.38 : 0, transition:'opacity 1s ease 2.2s', pointerEvents:'none', zIndex:7 }}>
        <div style={{ fontFamily:'var(--font-label)', fontSize:'9px', fontWeight:700, letterSpacing:'0.18em', color:'#8d9479' }}>SCROLL</div>
        <div style={{ width:'1px', height:'44px', background:'linear-gradient(to bottom, var(--accent), transparent)', animation:'pulseLen 2s ease-in-out infinite' }} />
      </div>

      {/* Ticker belt */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'rgba(4,4,4,0.97)', borderTop:'1px solid #434933', height:'34px', overflow:'hidden', display:'flex', alignItems:'center', zIndex:8 }}>
        <div style={{ display:'flex', animation:'tickerMove 28s linear infinite', whiteSpace:'nowrap', willChange:'transform' }}>
          {[0,1,2,3].map(i => (
            <span key={i} style={{ fontFamily:'var(--font-mono)', fontSize:'10px', color:'var(--accent)', letterSpacing:'0.12em', paddingRight:'64px', opacity:0.75 }}>
              {products.map(p => `${p.name} · ${p.id}`).join(' ↳ ')}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { HeroSection });
