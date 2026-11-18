import { useEffect, useMemo, useRef, useState } from 'react'
import './styles.css'
import { jsPDF } from 'jspdf'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'

const CONTACT = 'mailto:roxify.site@roxify.site'
const subtexts = [
  'South African wealth is trapped in a high-tax, depreciating currency.',
  'Roxify provides the legal infrastructure to hold USD offshore.',
  'Legally defer 5+ taxes. Protect your wealth. Keep the client relationship.',
]

function BackgroundCard() {
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      document.documentElement.style.setProperty('--card-scroll-y', `${Math.max(-150, window.scrollY * -0.045)}px`)
      document.documentElement.style.setProperty('--card-scroll-scale', `${1.03 + Math.min(window.scrollY / 22000, 0.05)}`)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return <div className="background-card-layer" aria-hidden="true">
    <div className="background-card-orbit">
      <div className="background-card">
        <div className="background-card-face background-card-front">
          <div className="background-card-brand"><span className="roxify-mark">R</span><strong>ROXIFY</strong><span className="roxify-dot">.</span></div>
          <div className="roxify-card-label">PRIVATE WEALTH ENGINE</div>
          <div className="roxify-card-balance">$ 247,890<span>.00</span></div>
          <div className="roxify-card-chart"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <div className="roxify-card-footer"><span>USD TREASURY</span><span>04 / 28</span></div>
        </div>
        <div className="background-card-face background-card-back">
          <div className="background-card-brand"><span className="roxify-mark">R</span><strong>ROXIFY</strong><span className="roxify-dot">.</span></div>
          <div className="roxify-back-line"></div>
          <div className="roxify-back-copy">USD infrastructure<br />for compounding.</div>
        </div>
      </div>
    </div>
    <div className="background-card-shade"></div>
  </div>
}

function Logo() {
  return <a className="logo" href="/" aria-label="Roxify home"><span className="logo-mark">R</span><span>ROXIFY</span><i>.</i></a>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <><BackgroundCard /><header className="site-header">
    <Logo />
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation"><span></span><span></span></button>
    <nav className={open ? 'nav open' : 'nav'}>
      <a href="/#platform" onClick={() => setOpen(false)}>The Platform</a>
      <a href="/partners">For Partners</a>
      <a href="/pricing">Pricing</a>
      <a href={CONTACT}>Contact</a>
      <a className="login-link" href="/dashboard">Client Login <span>↗</span></a>
    </nav>
  </header></>
}

function Footer() {
  return <footer className="footer">
    <div className="footer-top"><Logo /><div className="footer-links"><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href={CONTACT}>Contact Partnerships Team</a></div></div>
    <p className="fineprint">Roxify is a financial technology company, not a bank. Banking services are provided by <a href="https://mercury.com" target="_blank" rel="noreferrer">Mercury Technologies, Inc.</a> and its partner banks, Members FDIC. Deposit insurance covers the failure of an insured bank.</p>
    <p className="copyright">© 2026 Roxify · Mercury Technologies, Inc.</p>
  </footer>
}

const HOME_VOICE_SCRIPT = 'Welcome to Roxify. South African wealth is trapped in a high-tax, depreciating currency. We built Roxify to change that. We are a B2B technology platform providing the infrastructure for wealth managers to hold assets in USD offshore. Through our US banking rails with Mercury, we help you legally defer over five local taxes. Whether you are an individual hedging the Rand, or a corporation rolling up profits, we provide the vault to protect your wealth, while you keep the client relationship. Welcome to financial freedom. Welcome to Roxify.'
const PERSONAL_VOICE_SCRIPT = 'This is the Roxify Personal Engine. Hold your wealth in USD, protect it from ZAR devaluation, and use a Just-In-Time Mastercard to trigger a taxable event only on what you spend. The rest compounds tax-deferred offshore through your US LLC and Mercury banking rails.'
const CORPORATE_VOICE_SCRIPT = 'This is the Roxify Corporate Engine. Structure your US LLC as a C-Corporation, pass the high-tax exemption test, and let business profits compound in USD offshore while you defer Corporate Income Tax and Dividends Tax. Explore The Vault to see the secure Mercury infrastructure behind the platform.'
const PPN_VOICE_SCRIPT = 'This is the Roxify PPN model. Accountants and wealth managers can offer tier-one US banking infrastructure to their clients without losing the advisory relationship. Roxify provides the invisible technology and administration layer, while the licensed PPN accounting firm advises and the wealth manager keeps the client relationship.'
function VoiceAgent({script, buttonLabel, linkHref, linkLabel, autoPlay = false}) {
  const [playing, setPlaying] = useState(false)
  const [unavailable, setUnavailable] = useState(false)
  const speak = () => {
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) { setUnavailable(true); return }
    window.speechSynthesis.cancel()
    const utterance = new window.SpeechSynthesisUtterance(script)
    utterance.rate = 1.15
    utterance.pitch = 1
    utterance.onend = () => setPlaying(false)
    utterance.onerror = () => setPlaying(false)
    window.speechSynthesis.speak(utterance)
    setPlaying(true)
  }
  useEffect(() => {
    if (!autoPlay) return undefined
    const timer = window.setTimeout(speak, 450)
    return () => { window.clearTimeout(timer); if ('speechSynthesis' in window) window.speechSynthesis.cancel() }
  }, [autoPlay, script])
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel() }, [])
  const toggleSpeech = () => {
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return }
    speak()
  }
  return <div className="voice-agent"><button className="voice-agent-button" type="button" onClick={toggleSpeech} aria-pressed={playing}><span>{playing ? '⏸' : '▶'}</span>{playing ? 'Pause' : buttonLabel}</button><div className={playing ? 'voice-wave is-playing' : 'voice-wave'} aria-hidden="true">{[1, 2, 3, 4, 5, 6, 7].map(bar => <i key={bar}></i>)}</div>{linkHref && <a className="voice-agent-link" href={linkHref}>{linkLabel} <span>↗</span></a>}{unavailable && <small className="voice-agent-note">Voice playback is not supported in this browser.</small>}</div>
}

function Concierge() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [engine, setEngine] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const chooseEngine = (value) => { setEngine(value); setStep(1) }
  const reset = () => { setStep(0); setEngine(''); setName(''); setAge('') }
  const mailto = useMemo(() => {
    const kind = engine === 'personal' ? 'Personal' : 'Corporate'
    const subject = encodeURIComponent(`New Lead: ${kind} - ${name}`)
    const body = encodeURIComponent(`Hi Roxify Team,\n\nMy name is ${name} and I am ${age} years old. I am interested in the ${kind} Engine. Please contact me to finalize my onboarding.`)
    return `${CONTACT}?subject=${subject}&body=${body}`
  }, [engine, name, age])
  const summary = engine === 'personal' ? {
    title: 'Personal Engine',
    problems: 'ZAR depreciation eating your purchasing power; paying 45% Income Tax on money you have not spent; the nightmare of repatriating lump sums.',
    solutions: 'A US LLC Vault (FDIC insured), our 1.5% Cashback Mastercard (spend locally, defer tax), and 4.21% yield on idle USD.',
    pricing: '$1,000 Setup | $5,000 /month | 2.5% PAYS (Pay-As-You-Save).',
  } : {
    title: 'Corporate Engine',
    problems: 'Losing 27% to CIT, 20% to Dividends Tax, and the risk of Section 9D CFC audits.',
    solutions: 'A US C-Corp structure that legally passes the 67.5% high-tax exemption, 100% USD roll-up, and global treasury rails.',
    pricing: '$2,500 Setup | $12,500 /month | 5% PAYS (Pay-As-You-Save).',
  }
  return <>
    <button className="concierge-button" onClick={() => setOpen(!open)} aria-expanded={open}><span className="concierge-pulse"></span><span>AI Concierge</span><b>✦</b></button>
    {open && <aside className="concierge-panel" aria-label="Roxify AI Concierge">
      <div className="chat-head"><div><small>ROXIFY / CONCIERGE</small><strong>Let's make wealth work harder.</strong></div><button onClick={() => setOpen(false)} aria-label="Close concierge">×</button></div>
      <div className="chat-body">
        <div className="bot-msg">Welcome to Roxify. Are you looking to optimize Personal Wealth or a Corporate Structure?</div>
        {step === 0 && <div className="chat-options"><button onClick={() => chooseEngine('personal')}>Personal Wealth</button><button onClick={() => chooseEngine('corporate')}>Corporate Structure</button></div>}
        {step >= 1 && <><div className="user-chip">{engine === 'personal' ? 'Personal Wealth' : 'Corporate Structure'}</div><div className="bot-msg">What is your name?</div><div className="chat-form"><input autoFocus value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /><button disabled={!name.trim()} onClick={() => setStep(2)}>Continue</button></div></>}
        {step >= 2 && <><div className="bot-msg">And your age?</div><div className="chat-form"><input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Age" /><button disabled={!age} onClick={() => setStep(3)}>Show my package</button></div></>}
        {step === 3 && <><div className="package-msg"><strong>Thank you, {name}.</strong><p>Here is what we deliver for the {summary.title}:</p><p><b>The Problems We Solve:</b> {summary.problems}</p><p><b>The Solutions:</b> {summary.solutions}</p><p><b>The Pricing:</b> {summary.pricing}</p></div><a className="chat-cta" href={mailto}>{engine === 'personal' ? 'Secure My Personal Tax Deferral' : 'Secure My Corporate Tax Exemption'} ↗</a><button className="start-over" onClick={reset}>Start over</button></>}
      </div>
    </aside>}
  </>
}

function Hero() {
  const [index, setIndex] = useState(0)
  const heroRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 130, damping: 18 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 130, damping: 18 })
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55, 0.95], [1, 0.9, 0])
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -95])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -130])
  const cardScale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const goldOrbX = useTransform(scrollYProgress, [0, 1], [0, -125])
  const magentaOrbX = useTransform(scrollYProgress, [0, 1], [0, 160])

  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % subtexts.length), 4000)
    return () => clearInterval(timer)
  }, [])

  const trackMouse = event => {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5)
  }
  const resetMouse = () => { mouseX.set(0); mouseY.set(0) }

  return <motion.section ref={heroRef} className="hero hero-upgraded" onMouseMove={trackMouse} onMouseLeave={resetMouse}>
    <div className="hero-overlay"></div><div className="hero-noise"></div>
    <motion.div className="hero-watermark" style={{ y: watermarkY }}>R</motion.div>
    <motion.div className="hero-orb hero-orb-gold" style={{ x: goldOrbX }}></motion.div>
    <motion.div className="hero-orb hero-orb-magenta" style={{ x: magentaOrbX }}></motion.div>
    <div className="hero-layout">
      <motion.div className="hero-card hero-copy" style={{ opacity: copyOpacity, y: copyY }}>
        <div className="eyebrow"><span></span>WHITE-LABEL OFFSHORE WEALTH INFRASTRUCTURE</div>
        <h1>Stop Letting Taxes &amp; The Rand <em>Steal Your Wealth.</em></h1>
        <VoiceAgent script={HOME_VOICE_SCRIPT} buttonLabel="Play 30s Voice Intro" autoPlay />
        <p className="hero-subtext" key={index}>{subtexts[index]}</p>
        <div className="hero-scroll">Scroll to explore <span>↓</span></div>
      </motion.div>
      <motion.div className="hero-visual" style={{ y: cardY, scale: cardScale }}>
        <motion.div className="hero-card-stage" style={{ rotateX, rotateY, transformPerspective: 1100 }} whileHover={{ scale: 1.025 }}>
          <div className="mercury-card">
            <div className="mercury-card-top"><span className="mercury-wordmark">mercury</span><span className="card-micro">IO / MASTERCARD</span></div>
            <div className="mercury-chip"></div>
            <div className="mercury-card-copy"><span>ROXIFY CLIENT RAIL</span><strong>USD</strong></div>
            <div className="mercury-card-number">•••• &nbsp; •••• &nbsp; 0421</div>
            <div className="mercury-card-bottom"><span>ROXIFY / OFFSHORE WEALTH</span><strong>MC</strong></div>
            <div className="mercury-card-glare"></div>
          </div>
        </motion.div>
        <motion.div className="hero-badge hero-badge-yield" animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}><span>✦</span><b>4.21%</b><small>Treasury Yield</small></motion.div>
        <motion.div className="hero-badge hero-badge-tax" animate={{ y: [0, 9, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: .5 }}><span>✓</span><b>Tax Deferred</b><small>Until you spend</small></motion.div>
        <motion.div className="hero-badge hero-badge-fdic" animate={{ y: [0, -7, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: .9 }}><span>◈</span><b>FDIC Insured</b><small>Up to $5M</small></motion.div>
      </motion.div>
    </div>
    <div className="integration-bar"><span className="integration-label">CONNECTED INFRASTRUCTURE</span><span><b>mercury</b> banking rails</span><span><b>VISA / MASTERCARD</b> global spend</span><span><b>US TREASURY</b> yield layer</span><span><b>OAUTH2</b> secure access</span></div>
  </motion.section>
}

function PlatformSection() {
  return <section id="platform" className="section platform-section"><div className="section-kicker"><span>01</span><i></i>OUTCOME FIRST · CLIENT WEALTH · USD INFRASTRUCTURE</div><div className="split"><div><div className="eyebrow">WHO WE ARE &amp; WHY YOU NEED US</div><h2>Legacy Banks Take Your Clients. <em>SARS Takes Your Wealth.</em> We Stop Both.</h2></div><div className="copy-column"><div className="mini-label">THE PROBLEM</div><p>The moment a client moves wealth offshore, legacy banks steal the relationship, and the paperwork becomes a SARS nightmare. The ZAR depreciates, and 45% Income Tax, 27% CIT, and 20% Dividends Tax destroy your compounding.</p><div className="mini-label">THE ROXIFY SOLUTION</div><p>We are the invisible B2B tech layer. You keep the advisory relationship. We provide the US banking rails, a local-spending card, and the exact legal audit trail to defer the tax cascade.</p></div></div></section>
}

function Engines() {
  return <section className="section engines-section"><div className="section-kicker"><span>02</span><i></i>THE TWO ENGINES</div><h2>Infrastructure built for <em>compounding.</em></h2><div className="engine-grid"><article className="engine-card personal"><div className="card-top"><span>01 / 02</span><span className="card-arrow">↗</span></div><div><div className="mini-label">PERSONAL ENGINE</div><h3>Hold wealth in USD. <em>Spend locally.</em></h3><p>Stop paying tax on money you haven't spent yet. Swipe locally with the Roxify card and trigger tax only on what you spend, leaving the rest of your wealth compounding in USD at 4.21% yield.</p></div><a href="/personal" className="text-link">Explore Personal Engine <span>→</span></a></article><article className="engine-card corporate"><div className="card-top"><span>02 / 02</span><span className="card-arrow">↗</span></div><div><div className="mini-label">CORPORATE ENGINE</div><h3>Keep corporate profits <em>working globally.</em></h3><p>Legally defer 27% Corporate Income Tax and Dividends Tax. We structure your US C-Corp to pass the 67.5% high-tax exemption test, keeping 100% of your profits working globally.</p></div><a href="/corporate" className="text-link">Explore Corporate Engine <span>→</span></a></article></div></section>
}

function Benefits() {
  const items = [['01','US Checking & Savings','Up to $5M in FDIC insurance through partner banks.'],['02','IO Mastercard','1.5% cashback on all spend, scaling with your balance.'],['03','Treasury Yield','Earn up to 4.21% yield on idle USD cash.'],['04','Global Payments','Free USD wires and international payments in 40+ currencies.']]
  return <section className="section benefits-section"><div className="benefits-heading"><div className="eyebrow">US BANKING · CLIENT BENEFITS</div><h2>Institutional banking for <em>your offshore clients.</em></h2><p>We integrate directly with Mercury, the US banking platform trusted by 450,000+ startups.</p></div><div className="benefit-list">{items.map(([num,title,text]) => <div className="benefit" key={num}><span>{num}</span><div><h3>{title}</h3><p>{text}</p></div><b>↗</b></div>)}</div></section>
}

function Pricing() {
  return <section className="section pricing-section" id="pricing"><div className="section-kicker"><span>03</span><i></i>TRANSPARENT · VALUE-BASED PRICING</div><h2>Two engines. <em>One clear model.</em></h2><div className="pricing-grid"><PriceCard title="Personal Engine" setup="$1,000" monthly="$5,000 / month" pays="2.5%" href="/pricing#personal-tier" /><PriceCard title="Corporate Engine" setup="$2,500" monthly="$12,500 / month" pays="5%" href="/pricing#corporate-tier" /></div></section>
}
function PriceCard({title, setup, monthly, pays, href}) { return <article className="price-card"><div className="mini-label">{title}</div><div className="price-row"><span>Setup</span><strong>{setup}</strong></div><div className="price-row"><span>Monthly retainer</span><strong>{monthly}</strong></div><div className="price-row"><span>Pay-As-You-Save</span><strong>{pays}</strong></div><a href={href} className="outline-link">View {title} <span>↗</span></a></article> }

function PartnerSection() { return <section className="section partner-section"><div><div className="eyebrow">THE PPN MODEL · FOR PARTNERS</div><h2>Deliver these outcomes <em>without the compliance headache.</em></h2><p>Built for South African wealth managers and tax attorneys. The licensed PPN accounting firm advises; wealth managers retain the client relationship. Roxify is the invisible back-office.</p><a className="gold-link" href="/partners">Explore the PPN Model <span>↗</span></a></div><div className="partner-points"><div><span>01</span><h3>Absolute Client Retention</h3><p>Keep the client relationship with the wealth manager while the licensed partner advises.</p></div><div><span>02</span><h3>Zero FSCA Licensing</h3><p>Roxify provides the technology; the licensed PPN accounting firm advises.</p></div><div><span>03</span><h3>New Revenue</h3><p>Earn fixed technology fees for every client your firm onboards.</p></div></div></section> }

function CTA() { return <section className="cta-section"><div className="eyebrow">A BETTER REASON TO STAY</div><h2>Ready to give your clients <em>a reason to stay?</em></h2><a className="cta-button" href="/vault">Secure Your Offshore Vault <span>→</span></a></section> }
const VAULT_MAILTO = 'mailto:roxify.site@roxify.site?subject=Request My Offshore Vault&body=Hi Roxify Team,%0D%0A%0D%0AI am interested in setting up my own Roxify Vault. Please contact me to discuss the onboarding and pricing.'
function VaultMercuryVisual() {
  return <div className="vault-visual">
    <motion.div className="hero-card-stage vault-card-stage" animate={{ y: [0, -14, 0], rotateY: [-7, 7, -7], rotateX: [3, -3, 3] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}>
      <div className="mercury-card">
        <div className="mercury-card-top"><span className="mercury-wordmark">mercury</span><span className="card-micro">IO / MASTERCARD</span></div>
        <div className="mercury-chip"></div>
        <div className="mercury-card-copy"><span>ROXIFY VAULT RAIL</span><strong>USD</strong></div>
        <div className="mercury-card-number">•••• &nbsp; •••• &nbsp; 0421</div>
        <div className="mercury-card-bottom"><span>OFFSHORE COMMAND CENTER</span><strong>MC</strong></div>
        <div className="mercury-card-glare"></div>
      </div>
    </motion.div>
    <motion.div className="vault-badge vault-badge-fdic" animate={{ y: [0, -9, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}><span>◈</span><b>FDIC Insured</b><small>Up to $5M</small></motion.div>
    <motion.div className="vault-badge vault-badge-yield" animate={{ y: [0, 8, 0] }} transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: .4 }}><span>✦</span><b>4.21% APY</b><small>Institutional yield</small></motion.div>
  </div>
}
function VaultPage() {
  const audiences = [
    ['01', 'High-Net-Worth Individuals', 'For those who want to hedge against ZAR devaluation, spend globally with a 1.5% cashback Mastercard, and defer personal income tax on unspent wealth.'],
    ['02', 'SMEs & Corporate Holders', 'For businesses that want to legally roll up profits in USD, defer 27% CIT, and pay global vendors without friction.'],
    ['03', 'The PPN Network', 'For accountants and wealth managers who want to offer tier-1 US banking to their clients without losing the advisory relationship.'],
  ]
  const benefits = [
    ['01', 'FDIC Insured', 'Up to $5M in deposit insurance through our partner banks.'],
    ['02', 'Institutional Yield', 'Earn up to 4.21% APY on idle USD cash via US Treasury ladders.'],
    ['03', 'SARS Audit Trail', 'Every transaction is classified (Loan, Dividend, Expense) to build a bulletproof compliance record.'],
  ]
  return <><Header /><main className="vault-page">
    <section className="vault-hero"><div className="vault-hero-copy"><div className="eyebrow"><span></span>THE ROXIFY VAULT</div><h1>Your Offshore <em>Command Center.</em></h1><p>The Vault is the secure, FDIC-insured US banking infrastructure (via Mercury) that powers your US LLC. It is where your wealth compounds in USD, safely outside the reach of the ZAR and SARS.</p><a className="cta-button" href={VAULT_MAILTO}>Request My Offshore Vault <span>→</span></a></div><VaultMercuryVisual /></section>
    <section className="vault-section vault-audience"><div className="section-kicker"><span>01</span><i></i>WHO IT IS FOR</div><h2>Built for Those <em>Who Demand More.</em></h2><div className="vault-audience-grid">{audiences.map(([number, title, copy]) => <article className="vault-glass-card" key={number}><div className="vault-card-number">{number}</div><h3>{title}</h3><p>{copy}</p><span className="vault-card-arrow">↗</span></article>)}</div></section>
    <section className="vault-section vault-benefits"><div className="section-kicker"><span>02</span><i></i>THE VAULT ADVANTAGE</div><h2>Infrastructure that <em>compounds.</em></h2><div className="vault-benefits-grid">{benefits.map(([number, title, copy]) => <article className="vault-benefit-card" key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><b>↗</b></article>)}</div></section>
    <section className="vault-section vault-ppn"><div className="section-kicker"><span>03</span><i></i>THE PPN ADVANTAGE</div><h2>Why The Vault is a <em>Game-Changer for Your Firm.</em></h2><p className="vault-ppn-subtitle">The invisible back-office. Your client. Your relationship.</p><p className="vault-ppn-body">Legacy banks steal your clients the moment they go offshore. The Roxify Vault stops that leakage. We provide the white-label US banking infrastructure (via Mercury), the compliance rails, and the SARS audit trail. You remain the licensed advisor. You keep the AUM. You earn a new recurring revenue stream on retainers, without needing an FSCA license.</p><div className="vault-ppn-grid"><article className="vault-ppn-card"><span>01</span><h3>Absolute Client Retention</h3><p>Execute offshore strategies without losing the client to a legacy bank.</p></article><article className="vault-ppn-card"><span>02</span><h3>Zero FSCA Risk</h3><p>Roxify provides the tech; your firm provides the advice. No new financial licenses needed.</p></article><article className="vault-ppn-card"><span>03</span><h3>New Revenue</h3><p>Earn a recurring 20% revenue share on every client retainer.</p></article></div></section>
    <section className="vault-cta-section"><div className="eyebrow">THE NEXT MOVE</div><h2>Ready to secure your <em>offshore wealth?</em></h2><a className="cta-button" href={VAULT_MAILTO}>Request My Offshore Vault <span>→</span></a></section>
    <section className="vault-demo-section"><p>Want to see the tech in action?</p><a className="outline-link" href="/dashboard">Launch Interactive Demo <span>→</span></a></section>
  </main><Footer /><Concierge /></>
}
function Home() { return <><Header /><main><Hero /><PlatformSection /><Engines /><Benefits /><PartnerSection /><section className="compliance"><div className="eyebrow">TECHNOLOGY · COMPLIANCE</div><h2>US-Regulated Rails. <em>SARS-Compliant Reporting.</em></h2><p>Roxify does not hold client funds. We act strictly as a B2B technology and administration provider, integrating with US banking APIs. We do not provide financial advice. The partner advises; Roxify provides the technology.</p></section><CTA /></main><Footer /><Concierge /></> }

function SimplePage({title, kicker, children}) { return <><Header /><main className="simple-page"><div className="eyebrow">{kicker}</div><h1>{title}</h1>{children}</main><Footer /><Concierge /></> }
const engineContent = {
  personal: {
    kicker: 'PERSONAL WEALTH INFRASTRUCTURE',
    title: 'The Personal Engine: Global Wealth, Local Lifestyle.',
    subtitle: 'Hold your wealth in USD, protect it from ZAR devaluation, and legally defer SARS taxes using your Just-In-Time Mastercard.',
    how: 'We establish a US LLC for you, structured as an active treasury company. Your wealth is held in USD via Mercury (FDIC-insured up to $5M). When you swipe your Roxify Mastercard locally, the system executes a micro-distribution. You only trigger a taxable event in South Africa on the exact amount you swipe, leaving the rest of your wealth compounding tax-deferred offshore.',
    cascadeTitle: 'The 5+ Personal Tax Cascade',
    cta: 'Activate My Personal Tax Deferral',
    setup: '$1,000',
    monthly: '$5,000 / month',
    pays: '2.5%',
    cascade: [
      ['01', 'Personal Income Tax', 'Up to 45%', 'You do not repatriate a massive lump sum. You only pay tax on the micro-distributions you actually spend locally.'],
      ['02', 'Capital Gains Tax', 'Effective 18%', 'Underlying assets, including US Treasuries and global equities, remain offshore inside the US LLC. No CGT disposal event occurs in South Africa.'],
      ['03', 'Dividends Tax', '20%', 'Because the US LLC is not issuing bulk dividends back to South Africa, the 20% Dividends Tax is deferred.'],
      ['04', 'Provisional Tax', 'Deferred', 'Without large lump-sum inflows into your SA bank account, you eliminate massive provisional tax liabilities.'],
      ['05', 'Estate Duty', 'Up to 25%', 'Assets held in the US LLC fall outside your personal South African estate, mitigating the 25% estate duty burden.'],
      ['06', 'FX & Wealth Erosion', 'Bonus layer', 'Hedge against ZAR devaluation and avoid punishing offshore transfer fees by keeping wealth in USD infrastructure.'],
    ],
  },
  corporate: {
    kicker: 'GLOBAL CORPORATE INFRASTRUCTURE',
    title: 'The Corporate Engine: The Ultimate Gross Roll-Up.',
    subtitle: 'Legally defer Corporate Income Tax and Dividends Tax by structuring a US C-Corp, allowing business profits to compound in USD offshore.',
    how: 'We structure your US LLC as a C-Corporation. Because it pays a 21% US federal tax rate, it passes the 67.5% high-tax exemption test (as per the 2026 TLAA). This legally excludes your offshore profits from immediate Section 9D CFC attribution.',
    cascadeTitle: 'The 5+ Corporate Tax Cascade',
    cta: 'Secure My Corporate Tax Exemption',
    setup: '$2,500',
    monthly: '$12,500 / month',
    pays: '5%',
    cascade: [
      ['01', 'Corporate Income Tax', '27%', 'Passes the 67.5% test to legally exclude active income from immediate SARS CIT attribution.'],
      ['02', 'Dividends Tax', '20%', 'Profits remain offshore, compounding tax-free inside the US C-Corp. No SA Dividends Tax is triggered.'],
      ['03', 'Capital Gains Tax', '18%', 'Capital appreciation compounds inside the US C-Corp without triggering a CGT disposal event in South Africa.'],
      ['04', 'Provisional Tax', 'Deferred', 'Because the profits are legally rolled up offshore, the SA parent company has no provisional tax liability on those profits.'],
      ['05', 'Personal Income Tax', 'Extraction layer', 'The SA director draws a JIT micro-distribution via a card, paying personal tax only on what is spent.'],
      ['06', 'Estate Duty', 'Bonus layer', 'Growth happens outside the personal estate, mitigating the 25% SA estate duty.'],
    ],
  },
}

function CascadeCard({item}) {
  const [number, title, rate, copy] = item
  return <article className="cascade-card"><div className="cascade-card-top"><span>{number}</span><b>{rate}</b></div><div className="mini-label">TAX LAYER</div><h3>{title}</h3><p>{copy}</p></article>
}

function EnginePage({corporate = false}) {
  const data = corporate ? engineContent.corporate : engineContent.personal
  return <><Header /><main className="engine-page">
    <section className="engine-hero"><div className="engine-hero-copy"><div className="eyebrow"><span></span>{data.kicker}</div><h1>{data.title}</h1><VoiceAgent script={corporate ? CORPORATE_VOICE_SCRIPT : PERSONAL_VOICE_SCRIPT} buttonLabel={corporate ? 'Play Corporate Summary' : 'Play Personal Summary'} linkHref={corporate ? '/vault' : undefined} linkLabel="Explore The Vault" autoPlay /><p className="engine-lead">{data.subtitle}</p><a className="cta-button" href={CONTACT}>{data.cta} <span>→</span></a></div><div className="engine-hero-panel"><div className="engine-panel-mark">{corporate ? 'C' : 'P'}</div><div className="mini-label">ROXIFY / {corporate ? 'CORPORATE' : 'PERSONAL'} ENGINE</div><strong>{corporate ? '100%' : '4.21%'}</strong><span>{corporate ? 'USD profit roll-up' : 'illustrative USD yield'}</span><div className="engine-panel-line"></div></div></section>
    <section className="engine-section engine-how"><div className="section-kicker"><span>01</span><i></i>HOW IT WORKS</div><div className="engine-section-grid"><div><h2>The mechanism behind <em>{corporate ? 'the gross roll-up.' : 'local lifestyle.'}</em></h2></div><p>{data.how}</p></div></section>
    <section className="engine-section engine-cascade"><div className="section-kicker"><span>02</span><i></i>OUTCOME-FIRST TAX INFRASTRUCTURE</div><h2>{data.cascadeTitle}</h2><div className="cascade-grid">{data.cascade.map(item => <CascadeCard item={item} key={item[0]} />)}</div></section>
    <section className="engine-section engine-pricing"><div className="section-kicker"><span>03</span><i></i>TRANSPARENT · VALUE-BASED PRICING</div><div className="engine-pricing-grid"><div><h2>The PAYS <em>Model.</em></h2><p>Pay for outcomes, not promises. Roxify charges a performance fee only on the taxes we legally defer for you.</p></div><div className="engine-price-card"><div className="engine-price-row"><span>Setup Fee</span><strong>{data.setup}</strong><small>One-time LLC formation</small></div><div className="engine-price-row"><span>Monthly Retainer</span><strong>{data.monthly}</strong><small>Platform access and PPN advisory</small></div><div className="engine-price-row"><span>PAYS Fee</span><strong>{data.pays}</strong><small>Only on taxes legally deferred</small></div><a className="cta-button" href={CONTACT}>{data.cta} <span>→</span></a></div></div></section>
    <p className="engine-disclaimer">Roxify is a technology and administration provider, not a bank, tax advisor, or law firm. The examples on this page describe the intended operating model and require review with your qualified South African and US advisors.</p>
  </main><Footer /><Concierge /></>
}
function Partners() { return <SimplePage title="The PPN Model" kicker="FOR SOUTH AFRICAN WEALTH MANAGERS & TAX ATTORNEYS"><VoiceAgent script={PPN_VOICE_SCRIPT} buttonLabel="Play PPN Summary" autoPlay /><p className="lead">The invisible back-office for firms that want to retain the client relationship and add a new revenue line.</p><div className="detail-card"><div className="mini-label">BUILT FOR PARTNERS</div><h2>Your client. Your relationship. Our rails.</h2><p>Roxify provides technology and administration. The licensed PPN accounting firm advises. Everyone stays in their lane.</p><a className="cta-button" href={CONTACT}>Contact Partnerships Team <span>→</span></a></div></SimplePage> }
function Legal({terms = false}) { return <SimplePage title={terms ? 'Terms of Service' : 'Privacy Policy'} kicker="ROXIFY LEGAL"><div className="legal-copy"><p>Last updated: November 2026.</p><h2>{terms ? 'Use of this site' : 'Information we collect'}</h2><p>{terms ? 'This website provides general information about Roxify’s B2B technology and administration services. It is not financial, tax, legal, or investment advice. By using the site, you agree to use it lawfully and to contact a qualified advisor before making decisions.' : 'We collect information you choose to send us through email, contact forms, or the AI Concierge. We use it to respond to partnership and onboarding requests, improve the service, and maintain site security.'}</p><h2>{terms ? 'Service limitations' : 'How we use information'}</h2><p>{terms ? 'Roxify does not hold client funds and does not provide banking or financial advice. Banking services are supplied by Mercury Technologies, Inc. and partner banks. Service availability and provider terms may change.' : 'We do not sell personal information. We retain messages only as long as needed to respond, meet legal obligations, and keep accurate business records. Contact us at roxify.site@roxify.site with privacy questions.'}</p></div></SimplePage> }

function Dashboard() {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [kycScreen, setKycScreen] = useState('connect')
  const [kycLoading, setKycLoading] = useState(false)
  const [legalName, setLegalName] = useState('')
  const [businessId, setBusinessId] = useState('')
  const [tab, setTab] = useState('checking')
  const [currency, setCurrency] = useState('USD')
  const [modal, setModal] = useState(false)
  const [kycStatus, setKycStatus] = useState('ready')
  const [classifications, setClassifications] = useState({
    'Incoming Capital (+$250,000)': 'Unclassified',
    'AWS Subscription (-$450)': 'Unclassified',
    'Stripe Payout (+$12,500)': 'Unclassified',
  })
  const balances = { checking: 245000, savings: 50000, treasury: 100000 }
  const rates = { USD: 1, ZAR: 18.35, GBP: 0.79, EUR: 0.92 }
  const currencySymbols = { USD: '$', ZAR: 'R', GBP: '£', EUR: '€' }
  const rows = [['Incoming Capital (+$250,000)', '+$250,000'], ['AWS Subscription (-$450)', '-$450'], ['Stripe Payout (+$12,500)', '+$12,500']]
  const formatMoney = amount => `${currencySymbols[currency]}${(amount * rates[currency]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const connect = () => {
    setKycScreen('form')
  }
  const submitKyc = () => {
    if (!legalName.trim() || !businessId.trim()) return
    setKycLoading(true)
    window.setTimeout(() => {
      setKycLoading(false)
      setKycScreen('vault')
      setKycStatus('verified')
      setConnected(true)
    }, 2000)
  }
  const runKycVerification = () => {
    setKycStatus('checking')
    setTimeout(() => setKycStatus('verified'), 1600)
  }
  const exportAuditReport = () => {
    const doc = new jsPDF()
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.text('Roxify SARS Audit Trail', 20, 22)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text('Demo report · Prepared for advisor review · No live banking data', 20, 30)
    doc.text(`Display currency: ${currency} · Illustrative rate: 1 USD = ${rates[currency]} ${currency}`, 20, 38)
    let y = 54
    rows.forEach(([name, amount]) => {
      doc.setFont('helvetica', 'bold'); doc.text(name, 20, y)
      doc.setFont('helvetica', 'normal'); doc.text(`${amount} · ${classifications[name]}`, 20, y + 7)
      y += 18
    })
    doc.text('Roxify is a financial technology company, not a bank. This demo export is not a regulatory filing.', 20, 125, { maxWidth: 170 })
    doc.save('roxify-sars-audit-trail-demo.pdf')
  }
  const exportKycReport = () => {
    const doc = new jsPDF()
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.text('Roxify KYC Verification Report', 20, 22)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.text('Demo report · Integrated onboarding workflow', 20, 30)
    doc.text(`Status: ${kycStatus === 'verified' ? 'VERIFIED — ADVISOR REVIEW REQUIRED' : 'NOT VERIFIED — PENDING DEMO REVIEW'}`, 20, 44)
    ;['Identity verification — document and identity match', 'Sanctions & PEP screening — watchlist review', 'Source of funds record — evidence for advisor review'].forEach((line, index) => doc.text(`✓ ${line}`, 20, 58 + index * 10))
    doc.text('This demo models a workflow and does not make a live legal or regulatory determination.', 20, 98, { maxWidth: 170 })
    doc.save('roxify-kyc-verification-demo.pdf')
  }
  const disconnect = () => {
    setModal(false); setConnected(false); setLoading(false); setKycScreen('connect'); setKycLoading(false); setLegalName(''); setBusinessId(''); setTab('checking'); setCurrency('USD'); setKycStatus('ready')
    setClassifications({ 'Incoming Capital (+$250,000)': 'Unclassified', 'AWS Subscription (-$450)': 'Unclassified', 'Stripe Payout (+$12,500)': 'Unclassified' })
  }
  if (!connected && kycScreen === 'connect') return <><Header /><main className="dashboard connect-screen"><div className="connect-card"><span className="vault-symbol">R</span><div className="eyebrow">ROXIFY · THE VAULT</div><h1>Connect your US Banking Infrastructure.</h1><p>Securely connect your Mercury account to access balances, card controls, and the SARS audit trail.</p><button className="cta-button" onClick={connect}>Connect to Mercury <span>→</span></button><small>Demo environment · No funds are moved</small></div></main><Footer /><Concierge /></>
  if (!connected && kycScreen === 'form') return <><Header /><main className="dashboard connect-screen"><section className="connect-card kyc-entry-card"><span className="vault-symbol">✓</span><div className="eyebrow">ROXIFY · MERCURY ONBOARDING</div><h1>Identity Verification</h1><p>Enter your legal identity details to run the demo onboarding checks before accessing The Vault.</p><div className="kyc-entry-form"><label>Full Legal Name<input value={legalName} onChange={event => setLegalName(event.target.value)} placeholder="Full Legal Name" autoComplete="name" /></label><label>Mercury Business ID<input value={businessId} onChange={event => setBusinessId(event.target.value)} placeholder="e.g., MER-84920" /></label><button className="cta-button" onClick={submitKyc} disabled={kycLoading || !legalName.trim() || !businessId.trim()}>{kycLoading ? <><span className="spinner"></span>Running KYC checks &amp; sanction screening...</> : <>Verify &amp; Access Vault <span>→</span></>}</button></div><small>Demo environment · No data is submitted to Mercury</small></section></main><Footer /><Concierge /></>
  return <><Header /><main className="dashboard vault"><div className="vault-header"><div><div className="eyebrow">ROXIFY · CLIENT DASHBOARD</div><h1>The Vault <span className="mercury-badge">Powered by Mercury</span></h1></div><button className="disconnect" onClick={() => setModal(true)}>Settings <span>·</span> Disconnect</button></div><div className="vault-grid"><section className="account-tabs balance-panel"><div className="tabs">{Object.keys(balances).map(value => <button className={tab === value ? 'active' : ''} key={value} onClick={() => setTab(value)}>{value}</button>)}</div><div className="currency-control"><span>DISPLAY CURRENCY</span><div>{Object.keys(rates).map(code => <button key={code} className={currency === code ? 'selected' : ''} aria-pressed={currency === code} onClick={() => setCurrency(code)}>{code}<small>{code === 'USD' ? 'base' : `1 USD = ${rates[code]}`}</small></button>)}</div></div><div className="tab-panel"><span>{tab.toUpperCase()} BALANCE</span><strong>{formatMoney(balances[tab])}</strong><p>{tab === 'treasury' ? `Earning 4.21% APY · Illustrative ${currency} display` : `Mercury partner account · Illustrative ${currency} display`}</p><div className="sparkline"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div></section><section className="io-card"><div className="card-top"><span>MERCURY</span><span>MASTERCARD</span></div><div className="chip"></div><div><strong className="io-title">Mercury IO Card</strong><div className="card-number">•••• &nbsp; •••• &nbsp; 0421</div></div><div className="card-bottom"><span>1.5% CASHBACK</span><span>MC</span></div></section><section className="kyc-panel"><div className="section-line"><div><div className="eyebrow">COMPLIANCE CONTROL</div><h2>KYC verification</h2></div><span className={`kyc-status ${kycStatus}`}>{kycStatus === 'verified' ? 'VERIFIED' : kycStatus === 'checking' ? 'CHECKING' : 'READY'}</span></div><p className="kyc-intro">Integrated identity and risk screening for onboarding records. This demo models the workflow; it does not make a live legal or regulatory determination.</p><div className="kyc-checks"><div><span className={kycStatus === 'verified' ? 'check complete' : 'check'}>✓</span><div><strong>Identity verification</strong><small>Document and identity match</small></div></div><div><span className={kycStatus === 'verified' ? 'check complete' : 'check'}>✓</span><div><strong>Sanctions &amp; PEP screening</strong><small>Watchlist and politically exposed person review</small></div></div><div><span className={kycStatus === 'verified' ? 'check complete' : 'check'}>✓</span><div><strong>Source of funds record</strong><small>Evidence ready for advisor review</small></div></div></div><div className="report-actions">{kycStatus === 'verified' ? <div className="kyc-result"><span>✓</span>Demo verification complete · Advisor review required</div> : <button className="outline-link kyc-button" onClick={runKycVerification} disabled={kycStatus === 'checking'}>{kycStatus === 'checking' ? <><span className="spinner gold-spinner"></span>Running verification...</> : <>Run KYC verification <span>↗</span></>}</button>}<button className="report-button" onClick={exportKycReport}>Download KYC report <span>↓</span></button></div></section><section className="transactions"><div className="section-line"><div><div className="eyebrow">THE SARS AUDIT TRAIL</div><h2>Recent Transactions</h2></div><button className="report-button" onClick={exportAuditReport}>Export audit trail PDF <span>↓</span></button></div>{rows.map(([name, amount]) => <div className="transaction" key={name}><div><strong>{name}</strong><small>{classifications[name] === 'Unclassified' ? 'Needs compliance classification' : `Classified as ${classifications[name]}`}</small></div><b className={amount[0] === '+' ? 'positive' : ''}>{amount}</b><select className={classifications[name] !== 'Unclassified' ? 'classified' : ''} value={classifications[name]} onChange={event => setClassifications(current => ({ ...current, [name]: event.target.value }))} aria-label={`Classify ${name}`}><option>Unclassified</option><option>Loan to Member</option><option>Dividend</option><option>Expense</option></select></div>)}</section></div><p className="vault-disclaimer">Roxify is a financial technology company, not a bank. Banking services are provided by Mercury Technologies, Inc. and its partner banks, Members FDIC. Deposit insurance covers the failure of an insured bank. Currency conversions shown in this demo are illustrative and not live exchange rates.</p></main><Footer /><Concierge />{modal && <div className="modal-backdrop"><div className="modal"><button className="modal-close" onClick={() => setModal(false)} aria-label="Close settings">×</button><div className="eyebrow">VAULT SETTINGS</div><h2>Disconnect Mercury Account?</h2><p>Are you sure? Disconnecting will revoke Roxify's access to your Mercury data.</p><button className="danger" onClick={disconnect}>Disconnect Mercury Account</button></div></div>}</>
}

function App() { const path = window.location.pathname; if (path === '/dashboard') return <Dashboard />; if (path === '/vault') return <VaultPage />; if (path === '/partners') return <Partners />; if (path === '/personal') return <EnginePage />; if (path === '/corporate') return <EnginePage corporate />; if (path === '/privacy') return <Legal />; if (path === '/terms') return <Legal terms />; if (path === '/pricing') return <><Header /><main><Pricing /></main><Footer /><Concierge /></>; return <Home /> }

export default App
