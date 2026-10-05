import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useMutation, useQuery } from 'convex/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, ChevronRight, CircleDollarSign, FileText, HeartHandshake, Landmark, Mail, MapPin, Menu, Network, PhoneCall, Scale, Search, ShieldCheck, Smartphone, Users, X } from 'lucide-react';
import { api } from '../../convex/_generated/api';
import TanzaniaDistrictMap from '../components/home/TanzaniaDistrictMap';
import { HomeImpactTicker } from '../components/home/HomeImpactNumbers';
import './NewHomepage.css';
import './HomepageConcept.css';

type Variant = 1 | 2 | 3;
const asset = (file: string) => `/lovable-uploads/${file}`;
const report = 'https://lsftz.org/reportsfiles/LSF%20Annual%20Report%202024-%20DIgital%20Use%20%281%29_compressed.pdf';
const conceptAsset = (file: string) => `/homepage-concepts/${file}`;
const partners = [
  ['Denmark', 'Danish amabssador.png'], ['European Union', 'Funded by European Union.png'],
  ['World Bank', 'WorldBank_logo.jpg'], ['FCDO', 'FCDO_logo.png'],
  ['Enabel', 'Enabel.png'], ['WINGS', 'WINGS_logo.png'],
];
const excludedSeedNews = new Set(['lsf-launches-digital-legal-aid-platform', 'womens-land-rights-initiative', 'climate-justice-program-expands', '500-paralegals-graduate', 'digital-transformation-rural-areas', 'government-partnership-strengthens-legal-aid']);

function ConceptHeader({ variant }: { variant: Variant }) {
  const [open, setOpen] = useState(false);
  return <header className="hc-header">
    {variant === 2 && <div className="hc-topline"><div className="hc-shell"><span>✧ A Tanzania where justice empowers people</span><span>Legal Services Facility · Tanzania</span></div></div>}
    <div className="hc-shell hc-header-main"><Link className="hc-logo" to="/" aria-label="LSF home"><img src="/lsf-logo.png" alt="Legal Services Facility" /></Link>
      <nav className={open ? 'hc-nav is-open' : 'hc-nav'} aria-label="Homepage concept navigation"><Link to="/about">About <ChevronDown size={12} /></Link><Link to="/what-we-do">Our Work <ChevronDown size={12} /></Link><Link to="/haki-yangu">Haki Yangu <ChevronDown size={12} /></Link><Link to="/resources">Resources <ChevronDown size={12} /></Link><Link to="/news">News <ChevronDown size={12} /></Link><Link to="/partners">Get involved <ArrowUpRight size={12} /></Link></nav>
      <div className="hc-header-actions"><Link className="hc-search" to="/resources" aria-label="Explore resources"><Search size={17} /></Link><Link className="hc-help" to="/legal-help">Get Legal Help <ArrowRight size={16} /></Link><button className="hc-menu" type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button></div>
    </div>
  </header>;
}

function Hero({ variant }: { variant: Variant }) {
  const split = variant === 2;
  return <section className={`hc-hero hc-hero-${variant}`} aria-labelledby={`hc-${variant}-title`}>
    <div className="hc-hero-picture"><img src={conceptAsset(split ? 'hero-portrait-woman.jpg' : 'hero-community-woman.jpg')} alt="Illustrative portrait of a woman in a Tanzanian community setting" fetchPriority="high" /></div>
    <div className="hc-hero-wash" /><div className="hc-shell hc-hero-content"><p className="hc-eyebrow">{split ? 'ACCESS TO JUSTICE FOR ALL' : 'JUSTICE FOR A FAIRER TANZANIA'}</p><h1 id={`hc-${variant}-title`}>When people<br />know their rights,<br /><span>change begins.</span></h1><p className="hc-hero-copy">We support legal aid, strengthen communities and work with partners to make justice accessible for everyone in Tanzania.</p><div className="hc-hero-buttons"><Link className="hc-button hc-primary" to="/legal-help">Get Legal Help <ArrowRight size={17} /></Link><Link className="hc-button hc-secondary" to={split ? '/haki-yangu' : '/what-we-do'}>{split ? 'Explore Haki Yangu' : 'Explore Our Work'} <ArrowRight size={17} /></Link></div></div>
    {split ? <div className="hc-hero-note">Real people.<br />Real change.<small>Across Tanzania.</small></div> : <div className="hc-hand-note">Haki<br />Zangu<br />Maisha<br />Bora</div>}
  </section>;
}

function Pathways({ variant }: { variant: Variant }) {
  const items = [
    { icon: PhoneCall, label: 'I need legal support', title: 'Find Legal Support', detail: 'Get connected to legal aid and support near you.', href: '/legal-help' },
    { icon: BookOpen, label: 'I want to know my rights', title: 'Explore Haki Yangu', detail: 'Simple information, guided steps and tools.', href: '/haki-yangu' },
    { icon: Users, label: 'I want to partner with LSF', title: 'Partner With Us', detail: 'Work with us to expand access to justice.', href: '/partners' },
  ];
  return <nav className={`hc-shell hc-pathways hc-pathways-${variant}`} aria-label="Ways to engage with LSF">{items.map(({ icon: Icon, label, title, detail, href }) => <Link className="hc-path" to={href} key={href}><span className="hc-path-icon"><Icon size={27} strokeWidth={1.8} /></span><span className="hc-path-text"><small>{variant !== 1 ? title : label}</small>{variant === 1 && <strong>{title}</strong>}<em>{detail}</em></span><span className="hc-path-arrow"><ArrowRight size={17} /></span></Link>)}</nav>;
}

const metrics = [
  { icon: Users, figure: '7.67M+', label: 'People reached with legal education' },
  { icon: Scale, figure: '26,451', label: 'People supported with legal aid' },
  { icon: Landmark, figure: 'TZS 1.65B', label: 'Assets reclaimed by women' },
  { icon: HeartHandshake, figure: '6,825', label: 'GBV cases addressed' },
  { icon: MapPin, figure: 'National', label: 'Mainland and Zanzibar' },
];
function ImpactNumbers({ variant }: { variant: Variant }) {
  if (variant === 3) return <section className="hc-impact-numbers hc-impact-numbers-3" aria-labelledby="hc-impact-3"><div className="hc-shell"><div className="hc-impact-intro"><div><p className="hc-eyebrow">OUR IMPACT</p><h2 id="hc-impact-3">A national mission.<br /><span>Measurable human impact.</span></h2></div><p>Reaching 7 million people annually through legal aid, advocacy and community empowerment across Tanzania.</p></div></div><HomeImpactTicker tone="light" /><div className="hc-shell"><Link className="hc-source" to="/impact">Explore LSF’s impact <ArrowUpRight size={13} /></Link></div></section>;
  const shown = variant === 2 ? metrics.slice(0, 3) : metrics;
  return <section className={`hc-impact-numbers hc-impact-numbers-${variant}`} aria-labelledby={`hc-impact-${variant}`}><div className="hc-shell"><div className="hc-impact-intro"><div><p className="hc-eyebrow">OUR IMPACT · 2024</p><h2 id={`hc-impact-${variant}`}>{variant === 2 ? <>A fairer Tanzania<br />is possible.</> : <>A national mission.<br />Measurable human impact.</>}</h2></div><p>LSF works with communities, legal aid providers, paralegals and partners to create a fairer Tanzania where everyone can access justice.</p></div><div className="hc-metric-grid">{shown.map(({ icon: Icon, figure, label }) => <div className="hc-metric" key={figure}><Icon size={26} strokeWidth={1.65} /><strong>{figure}</strong><span>{label}</span></div>)}</div><a className="hc-source" href={report} target="_blank" rel="noopener noreferrer">2024 results: LSF Annual Report <ArrowUpRight size={13} /></a></div></section>;
}

function About({ variant }: { variant: Variant }) {
  if (variant === 3) return null;
  return <section className={`hc-section hc-about hc-about-${variant}`} aria-labelledby="hc-about-title"><div className="hc-shell hc-about-layout"><div className="hc-about-copy"><p className="hc-eyebrow">{variant === 2 ? 'WHO WE ARE' : 'WHAT WE DO'}</p><h2 id="hc-about-title">Justice becomes real<br />when everyone can <span>reach it.</span></h2><p>LSF supports people with legal information, direct assistance, community paralegals, digital tools like Haki Yangu, and partnerships that strengthen the justice system.</p><Link className="hc-inline-link" to="/about">More about LSF <ArrowRight size={16} /></Link></div><div className="hc-about-visual"><img src={asset(variant === 2 ? 'lsf-paralegal-servicing.jpeg' : 'women-legal-consultation.jpg')} alt="LSF community legal aid work" loading="lazy" /><div className="hc-about-list"><span><Users size={19} />Legal aid services</span><span><HeartHandshake size={19} />Community paralegals</span><span><Smartphone size={19} />Haki Yangu</span><span><ShieldCheck size={19} />Stronger justice systems</span></div></div></div></section>;
}

function Approach({ variant }: { variant: Variant }) {
  if (variant === 2) return null;
  if (variant === 3) {
    const approaches = [
      { icon: CircleDollarSign, title: 'Strategic grant-making', copy: 'Resourcing paralegal organisations and community actors.', href: '/what-we-do/grant-making' },
      { icon: HeartHandshake, title: 'Direct implementation', copy: 'Testing and delivering flagship initiatives in priority areas.', href: '/what-we-do/direct-implementation' },
      { icon: Users, title: 'Capacity and systems', copy: 'Strengthening paralegals, CSOs and duty bearers.', href: '/what-we-do/capacity-building' },
      { icon: Scale, title: 'Advocacy and policy', copy: 'Using evidence to influence laws and public policy.', href: '/what-we-do/advocacy-policy' },
      { icon: FileText, title: 'Learning and research', copy: 'Measuring results and improving what works.', href: '/what-we-do/lr-me' },
      { icon: Network, title: 'Partnerships and networks', copy: 'Connecting government, civil society and development partners.', href: '/what-we-do/partnerships-networks' },
    ];
    return <section className="hc-section hc-approach hc-approach-v3" aria-labelledby="hc-approach-v3-title"><div className="hc-shell hc-approach-v3-layout"><div className="hc-approach-v3-visual"><img src={asset('women-legal-consultation.jpg')} alt="Legal aid consultation in a community" loading="lazy" /><div className="hc-approach-v3-visual-copy"><p className="hc-eyebrow">OUR APPROACH</p><h2 id="hc-approach-v3-title">Local action.<br />Lasting change.</h2><p>Six connected ways to make justice accessible.</p></div></div><div className="hc-approach-v3-main"><p className="hc-approach-v3-intro">We invest in local actors, deliver programmes, strengthen systems and use evidence to shape change.</p><div className="hc-approach-v3-grid">{approaches.map(({ icon: Icon, title, copy, href }, index) => <Link className="hc-approach-v3-card" to={href} key={title}><span className="hc-approach-v3-icon"><Icon size={20} strokeWidth={1.7} /></span><span className="hc-approach-v3-text"><strong>{title}</strong><small>{copy}</small></span><span className="hc-approach-v3-number">0{index + 1}</span></Link>)}</div><Link className="hc-inline-link" to="/what-we-do">Explore our approach <ArrowRight size={16} /></Link></div></div></section>;
  }
  const steps = [
    { icon: Users, text: 'People know their rights' },
    { icon: Scale, text: 'Community support and legal aid' },
    { icon: Smartphone, text: 'Digital innovation like Haki Yangu' },
    { icon: Landmark, text: 'Evidence and systems change' },
  ];
  return <section className="hc-section hc-approach"><div className="hc-shell hc-approach-layout"><div><p className="hc-eyebrow">OUR APPROACH</p><h2>Turning rights into<br /><span>everyday realities.</span></h2><p>We work with communities, civil society, government and development partners to break down legal barriers and create lasting change.</p><Link className="hc-button hc-primary" to="/what-we-do">Our approach <ArrowRight size={16} /></Link></div><div className="hc-steps">{steps.map(({ icon: Icon, text }, index) => <div className="hc-step" key={text}><span><Icon size={26} /></span><strong>{text}</strong>{index < steps.length - 1 && <i aria-hidden="true">⟶</i>}</div>)}</div></div></section>;
}

function Reach({ variant }: { variant: Variant }) {
  if (variant === 3) return <section className="hc-section hc-identity-reach" aria-labelledby="hc-identity-title"><div className="hc-shell hc-identity-reach-layout"><div className="hc-identity-content"><span className="hc-identity-pill"><Scale size={15} /> WHO WE ARE</span><h2 id="hc-identity-title">Justice within<br /><span>reach.</span></h2><div className="hc-identity-message"><p>For over a decade, LSF has helped build Tanzania’s legal aid ecosystem.</p><p>Today, we also implement projects directly, working with communities and local partners to connect legal rights with practical support.</p></div><div className="hc-identity-highlights"><span><Scale size={18} />Legal aid</span><span><HeartHandshake size={18} />Community first</span><span><Users size={18} />Partnerships</span></div><Link className="hc-inline-link" to="/about">Discover our story <ArrowRight size={16} /></Link><div className="hc-identity-photo"><img src={asset('lsf-paralegal-servicing.jpeg')} alt="LSF community legal aid work" loading="lazy" /></div></div><div className="hc-identity-map"><div className="hc-identity-map-head"><div><p className="hc-eyebrow">OUR REACH</p><h3>A network across Tanzania.</h3></div><div className="hc-identity-map-facts"><span><strong>31</strong> regions</span><span><strong>168</strong> districts</span></div></div><div className="hc-reach-map"><TanzaniaDistrictMap showPresenceMarkers /><small>Regional markers illustrate LSF’s reported national network, not individual service locations. District boundaries: 2021 <a href="https://www.geoboundaries.org/api.html" target="_blank" rel="noopener noreferrer">geoBoundaries</a>, CC BY 3.0 IGO.</small></div><Link className="hc-inline-link" to="/legal-help">Explore our reach <ArrowRight size={16} /></Link></div></div></section>;
  return <section className={`hc-section hc-reach hc-reach-${variant}`} aria-labelledby={`hc-reach-${variant}`}><div className="hc-shell hc-reach-layout"><div className="hc-reach-copy"><p className="hc-eyebrow">OUR REACH</p><h2 id={`hc-reach-${variant}`}>A network that<br />spans Tanzania.</h2><p>LSF works with local partners, paralegals and legal aid providers across Mainland Tanzania and Zanzibar.</p><ul><li><Check size={16} />Community-based paralegals</li><li><Check size={16} />Legal aid providers and CSOs</li><li><Check size={16} />Government and development partners</li></ul><Link className="hc-button hc-primary" to="/legal-help">Explore our reach <ArrowRight size={16} /></Link></div><div className="hc-reach-map"><TanzaniaDistrictMap /><small>District boundaries: 2021 <a href="https://www.geoboundaries.org/api.html" target="_blank" rel="noopener noreferrer">geoBoundaries</a>, CC BY 3.0 IGO.</small></div>{variant === 1 && <div className="hc-region-list"><strong>Explore support</strong>{['Arusha', 'Dar es Salaam', 'Dodoma', 'Geita', 'Iringa', 'Kagera'].map(region => <Link to="/legal-help" key={region}>{region}<ChevronRight size={15} /></Link>)}</div>}</div></section>;
}

function Stories({ variant }: { variant: Variant }) {
  if (variant === 2) return <section className="hc-section hc-story-side"><div className="hc-shell"><div className="hc-story-side-card"><img src={asset('community-legal-aid.jpg')} alt="Legal aid staff serving a community member" loading="lazy" /><div><p className="hc-eyebrow">IMPACT STORIES</p><h2>Real people. Real change.</h2><p>Explore how legal knowledge and local support can help people find a way forward.</p><Link className="hc-inline-link" to="/success-stories">Read their stories <ArrowRight size={16} /></Link></div></div></div></section>;
  if (variant === 3) return <HomepageThreeStories />;
  return <section className="hc-story-banner"><img src={asset('wanawake tunaweza- image.jpg')} alt="Woman speaking at a community meeting" loading="lazy" /><div className="hc-shell"><p className="hc-eyebrow">IMPACT STORIES</p><h2>The most meaningful<br />change has a human story.</h2><p>From inheritance rights to protection from violence, these are the people and communities transforming their lives through access to justice.</p><Link className="hc-button hc-secondary" to="/success-stories">Read their stories <ArrowRight size={16} /></Link></div></section>;
}

function HomepageThreeStories() {
  const slides = [
    { image: 'wanawake tunaweza- image.jpg', kicker: 'Women and justice', title: 'Rights become powerful when people can use them.', copy: 'Explore stories of women using legal knowledge and community support to take the next step.' },
    { image: 'lsf-paralegal-servicing.jpeg', kicker: 'Community paralegals', title: 'Justice starts closer to home.', copy: 'Meet the local people helping communities understand their options and connect with legal aid.' },
    { image: 'community-legal-aid.jpg', kicker: 'Access to legal help', title: 'A conversation can open a path forward.', copy: 'See how practical guidance and trusted support make legal help more accessible.' },
  ];
  const [active, setActive] = useState(0);
  const slide = slides[active];
  const move = (direction: number) => setActive(current => (current + direction + slides.length) % slides.length);
  return <section className="hc-story-carousel" aria-labelledby="hc-story-carousel-title"><img key={slide.image} className="hc-story-carousel-image" src={asset(slide.image)} alt="LSF community legal empowerment work" loading="lazy" /><div className="hc-story-carousel-wash" /><div className="hc-shell hc-story-carousel-inner"><div className="hc-story-carousel-content" aria-live="polite"><p className="hc-eyebrow">IMPACT STORIES · {slide.kicker}</p><h2 id="hc-story-carousel-title">{slide.title}</h2><p>{slide.copy}</p><Link className="hc-button hc-secondary" to="/success-stories">Explore impact stories <ArrowRight size={16} /></Link></div><div className="hc-story-carousel-controls"><span className="hc-story-count">0{active + 1} <i /> 0{slides.length}</span><div className="hc-story-dots" aria-label="Choose an impact story">{slides.map((item, index) => <button type="button" key={item.kicker} className={index === active ? 'is-active' : ''} aria-label={`Show story ${index + 1}`} aria-current={index === active ? 'true' : undefined} onClick={() => setActive(index)} />)}</div><div className="hc-story-arrows"><button type="button" onClick={() => move(-1)} aria-label="Previous story"><ArrowLeft size={18} /></button><button type="button" onClick={() => move(1)} aria-label="Next story"><ArrowRight size={18} /></button></div></div></div></section>;
}

function HelpAndApp({ variant }: { variant: Variant }) {
  if (variant === 3) return null;
  if (variant === 2) return <section className="hc-section hc-app"><div className="hc-shell hc-app-layout"><div><p className="hc-eyebrow">HAKI YANGU</p><h2>Your rights.<br />Your next step.</h2><p>Haki Yangu connects people to legal information, trusted services and support—anytime, anywhere in Tanzania.</p><Link className="hc-button hc-primary" to="/haki-yangu">Learn about Haki Yangu <ArrowRight size={16} /></Link></div><div className="hc-phone" aria-label="Illustrative Haki Yangu interface"><div className="hc-phone-screen"><span className="hc-phone-top">Haki Yangu</span><strong>How can we help?</strong><div><span>Know your rights</span><span>Find help</span><span>Ask Saada</span><span>My requests</span></div><small>Justice, within reach.</small></div></div><div className="hc-app-links"><span><MapPin />Find help<small>Verified services near you</small></span><span><BookOpen />Know your rights<small>Short, practical guides</small></span><span><PhoneCall />Request support<small>Take the next step</small></span></div></div></section>;
  const items = [
    { image: 'lsf-paralegal-servicing.jpeg', icon: MapPin, title: 'In your community', copy: 'Find local legal aid providers and paralegals.', href: '/legal-help' },
    { image: 'haki yangu app uzinuzi.webp', icon: Smartphone, title: 'Online with Haki Yangu', copy: 'Get information, tools and guided steps.', href: '/haki-yangu' },
    { image: 'community-legal-aid.jpg', icon: PhoneCall, title: 'By phone', copy: 'Speak to our support channels for guidance.', href: '/contact' },
  ];
  return <section className="hc-section hc-help"><div className="hc-shell hc-help-layout"><div><p className="hc-eyebrow">GET HELP</p><h2>Help can start<br />wherever you are.</h2><p>Get legal support, find a nearby service provider, or use Haki Yangu to understand your rights and take the next step.</p><Link className="hc-button hc-primary" to="/legal-help">Find Legal Support <ArrowRight size={16} /></Link></div><div className="hc-help-cards">{items.map(({ image, icon: Icon, title, copy, href }) => <Link className="hc-help-card" to={href} key={title}><img src={asset(image)} alt="" loading="lazy" /><span className="hc-help-icon"><Icon size={19} /></span><strong>{title}</strong><small>{copy}</small></Link>)}</div></div></section>;
}

function Updates({ variant }: { variant: Variant }) {
  const news = useQuery(api.news.get, {});
  const stories = news?.filter(item => !excludedSeedNews.has(item.slug || '')).slice(0, 3) || [];
  const fallback = [
    { image: 'LSF with partner meeting.jpg', type: 'NEWS', title: 'News and updates from LSF', href: '/news' },
    { image: 'lsf-paralegal-servicing.jpeg', type: 'STORIES', title: 'Community stories and local voices', href: '/success-stories' },
    { image: 'LSF 2024 ANNUAL REPORT (Mobile Video).png', type: 'PUBLICATIONS', title: 'Explore our reports and evidence', href: '/publications' },
  ];
  return <section className={`hc-section hc-updates hc-updates-${variant}`} aria-labelledby={`hc-updates-${variant}`}><div className="hc-shell"><div className="hc-updates-head"><div><p className="hc-eyebrow">NEWS & UPDATES</p><h2 id={`hc-updates-${variant}`}>The work continues.</h2>{variant !== 3 && <p>Stay informed with our latest stories, publications and announcements.</p>}</div><Link className="hc-inline-link" to="/news">View all news <ArrowRight size={16} /></Link></div><div className="hc-news-grid">{stories.length ? stories.map(story => <Link className="hc-news-card" to={`/news/${story.slug || story._id}`} key={story._id}><img src={story.image || asset('community-legal-aid.jpg')} alt="" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = asset('community-legal-aid.jpg'); }} /><span>{story.category}</span><strong>{story.title}</strong><small>{story.date}</small><ArrowUpRight size={17} /></Link>) : fallback.map(story => <Link className="hc-news-card" to={story.href} key={story.title}><img src={asset(story.image)} alt="" loading="lazy" /><span>{story.type}</span><strong>{story.title}</strong><ArrowUpRight size={17} /></Link>)}</div></div></section>;
}

function Partners() {
  return <section className="hc-section hc-partners"><div className="hc-shell hc-partners-layout"><div><p className="hc-eyebrow">OUR PARTNERS</p><h2>The work is bigger<br />because we work together.</h2><p>We collaborate with government institutions, civil society organisations and development partners to expand access to justice.</p></div><div><div className="hc-partner-logos">{partners.map(([name, logo]) => <div key={name}><img src={asset(logo)} alt={name} loading="lazy" /></div>)}</div><Link className="hc-inline-link" to="/partners">View all partners <ArrowRight size={16} /></Link></div></div></section>;
}

function Newsletter({ variant }: { variant: Variant }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  const subscribe = useMutation(api.newsletter.subscribe);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try { const result = await subscribe({ email, source: `new-homepage0${variant}` }); setStatus(result.message); if (result.success) setEmail(''); }
    catch { setStatus('Unable to subscribe right now. Please try again.'); }
    finally { setPending(false); }
  }
  return <section className="hc-newsletter"><div className="hc-shell"><div><Mail size={24} /><span><strong>Progress happens together.</strong><small>Get the latest stories, publications and opportunities.</small></span></div><form onSubmit={submit}><label className="hc-sr-only" htmlFor={`hc-email-${variant}`}>Email address</label><input id={`hc-email-${variant}`} type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Enter your email address" required /><button type="submit" disabled={pending}>{pending ? 'Joining…' : 'Subscribe'} <ArrowRight size={15} /></button></form>{status && <p role="status">{status}</p>}</div></section>;
}

function ConceptFooter() {
  return <footer className="hc-footer"><div className="hc-shell"><div className="hc-footer-grid"><div><img src="/lsf-logo.png" alt="Legal Services Facility" /><strong>Empowering Justice for All.</strong><p>LSF advances accessible justice and legal empowerment across Tanzania.</p></div><div><b>About</b><Link to="/about">Our story</Link><Link to="/what-we-do">What we do</Link><Link to="/impact">Our impact</Link></div><div><b>Get help</b><Link to="/legal-help">Legal support</Link><Link to="/haki-yangu">Haki Yangu</Link><Link to="/resources">Resources</Link></div><div><b>Take action</b><Link to="/partners">Partner with us</Link><Link to="/contact">Contact us</Link><Link to="/opportunities">Opportunities</Link></div></div><div className="hc-footer-bottom"><span>© {new Date().getFullYear()} Legal Services Facility</span><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/accessibility">Accessibility</Link></div></div></div></footer>;
}

export default function HomepageConcept({ variant }: { variant: Variant }) {
  return <div className={`hc-page hc-v${variant}`}><Helmet><title>{`Homepage concept 0${variant} | LSF Tanzania`}</title><meta name="robots" content="noindex, nofollow" /><meta name="description" content="Explore a new Legal Services Facility homepage design concept." /></Helmet><ConceptHeader variant={variant} /><main>{variant === 3 ? <div className="hc-opening"><Hero variant={variant} /><Pathways variant={variant} /><ImpactNumbers variant={variant} /></div> : <><Hero variant={variant} /><Pathways variant={variant} /><ImpactNumbers variant={variant} /></>}{variant === 3 && <Reach variant={variant} />}<About variant={variant} /><Approach variant={variant} />{variant === 3 && <Stories variant={variant} />}{variant !== 3 && <Reach variant={variant} />}{variant !== 3 && <Stories variant={variant} />}<HelpAndApp variant={variant} /><Updates variant={variant} /><Partners /><Newsletter variant={variant} /></main><ConceptFooter /></div>;
}
