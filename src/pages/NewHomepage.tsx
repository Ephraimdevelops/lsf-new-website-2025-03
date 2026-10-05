import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from 'convex/react';
import { ArrowRight, ArrowUpRight, BookOpenCheck, ChevronLeft, ChevronRight, HandHeart, Handshake, MapPin, Smartphone, Users } from 'lucide-react';
import { api } from '../../convex/_generated/api';
import Layout from '../components/layout/Layout';
import TanzaniaDistrictMap from '../components/home/TanzaniaDistrictMap';
import './NewHomepage.css';

const photo = (name: string) => `/lovable-uploads/${name}`;
const reportUrl = 'https://lsftz.org/reportsfiles/LSF%20Annual%20Report%202024-%20DIgital%20Use%20%281%29_compressed.pdf';
const slides = [
  { image: '09086165-bb32-43b3-ae0a-b266fd207f36.png', label: 'The Legal Services Facility', title: 'Justice, at the scale Tanzania needs.', copy: 'From community paralegals to national partnerships, LSF brings rights, support and lasting change within reach.', alt: 'LSF and community members gathered outdoors' },
  { image: 'wanawake tunaweza- image.jpg', label: 'Powered by people', title: 'When people know their rights, change begins.', copy: 'We work alongside communities so their voices shape fairer, more responsive justice systems.', alt: 'A woman speaking at a community gathering' },
  { image: 'lsf-paralegal-servicing.jpeg', label: 'Support within reach', title: 'Justice should be close to home.', copy: 'Our network connects people with legal information, practical help and trusted local support.', alt: 'A paralegal meeting community members' },
];
const pathways = [
  { icon: HandHeart, label: 'FOR PEOPLE', title: 'Find legal support', copy: 'Get help and take a confident next step.', to: '/legal-help' },
  { icon: Smartphone, label: 'DIGITAL JUSTICE', title: 'Explore Haki Yangu', copy: 'Legal knowledge and pathways to help, in your hands.', to: '/haki-yangu' },
  { icon: Handshake, label: 'FOR PARTNERS', title: 'Build impact with us', copy: 'Join a national effort for accessible justice.', to: '/partners' },
];
const partners = [
  ['Denmark / DANIDA', 'Danish amabssador.png'], ['FCDO', 'FCDO_logo.png'],
  ['European Union', 'Funded by European Union.png'], ['World Bank', 'WorldBank_logo.jpg'],
  ['Enabel', 'Enabel.png'], ['WINGS', 'WINGS_logo.png'],
];
const seedSlugs = new Set(['lsf-launches-digital-legal-aid-platform', 'womens-land-rights-initiative', 'climate-justice-program-expands', '500-paralegals-graduate', 'digital-transformation-rural-areas', 'government-partnership-strengthens-legal-aid']);

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  useEffect(() => {
    const nodes = document.querySelectorAll('.nh-reveal:not(.nh-visible)');
    if (!('IntersectionObserver' in window)) { nodes.forEach(node => node.classList.add('nh-visible')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('nh-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.09 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return <div className={`nh-reveal ${className}`}>{children}</div>;
}

function Updates() {
  const news = useQuery(api.news.get, {});
  const stories = news?.filter(item => !seedSlugs.has(item.slug || '')).slice(0, 3) || [];
  return <section className="nh-updates" aria-labelledby="nh-updates-title"><div className="nh-wrap">
    <Reveal className="nh-updates-head"><div><span className="nh-kicker">07 / FROM LSF</span><h2 id="nh-updates-title">The work continues.</h2><p>News, ideas and evidence from the people advancing access to justice.</p></div><Link className="nh-dark-link" to="/news">All updates <ArrowUpRight size={18} /></Link></Reveal>
    {stories.length ? <div className="nh-updates-grid">{stories.map((story, index) => <Reveal className="nh-update" key={story._id}><Link to={`/news/${story.slug || story._id}`}><div className="nh-update-image"><img src={story.image || photo('community-legal-aid.jpg')} alt="" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = photo('community-legal-aid.jpg'); }} /></div><div className="nh-update-body"><span>{story.category || 'LSF update'} {story.date ? `· ${story.date}` : ''}</span><h3>{story.title}</h3><p>{story.excerpt}</p><strong>Read update <ArrowUpRight size={17} /></strong></div></Link></Reveal>)}</div> : <div className="nh-update-links"><Link to="/news"><span>01</span><strong>News & stories</strong><em>Follow the latest from LSF and the communities we work with.</em><ArrowUpRight size={20} /></Link><Link to="/publications"><span>02</span><strong>Reports & research</strong><em>See the evidence and learning behind our work.</em><ArrowUpRight size={20} /></Link><Link to="/opportunities"><span>03</span><strong>Opportunities</strong><em>Find ways to contribute to a fairer Tanzania.</em><ArrowUpRight size={20} /></Link></div>}
  </div></section>;
}

export default function NewHomepage() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused]);
  const slide = slides[active];
  const changeSlide = (direction: number) => { setPaused(true); setActive(value => (value + direction + slides.length) % slides.length); };

  return <Layout>
    <Helmet><title>Justice, at the scale Tanzania needs | Legal Services Facility</title><meta name="description" content="Explore LSF's national legal aid network, 2024 impact, partnerships and Haki Yangu digital support in Tanzania." /><meta name="robots" content="noindex, nofollow" /></Helmet>
    <div className="nh-page">
      <section className="nh-hero" aria-label="Legal Services Facility highlights" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}>
        {slides.map((item, index) => <img key={item.image} className={`nh-hero-photo ${index === active ? 'is-active' : ''}`} src={photo(item.image)} alt={index === active ? item.alt : ''} aria-hidden={index !== active} loading={index === 0 ? 'eager' : 'lazy'} />)}
        <div className="nh-hero-shade" /><div className="nh-hero-brand" aria-hidden="true" />
        <div className="nh-wrap nh-hero-inner" key={active}><span className="nh-pill"><span className="nh-pill-dot" />{slide.label}</span><h1>{slide.title}</h1><p>{slide.copy}</p><div className="nh-hero-actions"><Link className="nh-button nh-button-light" to="/what-we-do">See how we work <ArrowUpRight size={18} /></Link><Link className="nh-text-link" to="/impact">Explore our impact <ArrowRight size={18} /></Link></div></div>
        <div className="nh-hero-controls nh-wrap"><span>LEGAL SERVICES FACILITY · TANZANIA</span><div><button onClick={() => changeSlide(-1)} aria-label="Previous slide"><ChevronLeft size={19} /></button><span className="nh-slide-count">0{active + 1} <i>/ 0{slides.length}</i></span><button onClick={() => changeSlide(1)} aria-label="Next slide"><ChevronRight size={19} /></button></div></div>
      </section>

      <nav className="nh-wrap nh-route-strip" aria-label="Explore LSF services and partnerships">{pathways.map(path => <Link to={path.to} className="nh-route" key={path.title}><span className="nh-route-icon"><path.icon size={26} strokeWidth={1.7} /></span><span><small>{path.label}</small><strong>{path.title}</strong><em>{path.copy}</em></span><ArrowUpRight className="nh-route-arrow" size={20} /></Link>)}</nav>

      <section className="nh-proof" aria-labelledby="nh-proof-title"><div className="nh-wrap"><Reveal className="nh-proof-head"><div><span className="nh-kicker">01 / THE EVIDENCE</span><h2 id="nh-proof-title">A national mission.<br /><span>Measurable human impact.</span></h2></div><p>LSF's 2024 results show the breadth of our work, from public legal education to direct support for people facing barriers to justice.</p></Reveal><div className="nh-proof-grid"><div><strong>7.67M</strong><span>People reached with legal education</span></div><div><strong>26,451</strong><span>People received direct legal aid</span></div><div><strong>TZS 1.65B</strong><span>Assets reclaimed by women</span></div></div><a className="nh-proof-source" href={reportUrl} target="_blank" rel="noopener noreferrer">Source: LSF 2024 Annual Report <ArrowUpRight size={14} /></a></div></section>

      <section className="nh-about nh-wrap" aria-labelledby="nh-about-title"><Reveal className="nh-about-image"><img src={photo('lsf-paralegal-servicing.jpeg')} alt="LSF paralegal speaking with community members" loading="lazy" /><div className="nh-image-note"><span>Rooted in communities</span><strong>Focused on justice for all.</strong></div></Reveal><Reveal className="nh-about-copy"><span className="nh-kicker">02 / WHO WE ARE</span><h2 id="nh-about-title">Justice becomes real when everyone can reach it.</h2><p>Since 2011, LSF has helped build Tanzania's legal aid ecosystem. Today we work with people, paralegals and institutions to make rights understood and support accessible.</p><p className="nh-rule-copy">We combine the reach of a national network with the trust of local, community-led action.</p><Link className="nh-dark-link" to="/about">Meet LSF <ArrowUpRight size={18} /></Link></Reveal></section>

      <section className="nh-work" aria-labelledby="nh-work-title"><div className="nh-wrap"><Reveal className="nh-section-heading"><div><span className="nh-kicker">03 / WHAT WE DO</span><h2 id="nh-work-title">Turning rights into<br /><span>everyday realities.</span></h2></div><p>Legal aid, community leadership and institutional change work together to make justice more responsive.</p></Reveal><div className="nh-work-layout"><Reveal className="nh-work-feature"><img src={photo('women-legal-consultation.jpg')} alt="A woman receiving legal guidance" loading="lazy" /><div><span>ACCESS TO JUSTICE</span><h3>Support that meets people where they are.</h3><Link to="/what-we-do">Discover our approach <ArrowUpRight size={19} /></Link></div></Reveal><Reveal className="nh-work-side"><Link to="/focus-areas/empowered-communities"><Users size={28} strokeWidth={1.5} /><span><small>OUR FOCUS</small><strong>Empowered communities</strong><em>People understand their rights and lead change.</em></span><ArrowUpRight size={18} /></Link><Link to="/focus-areas/conducive-environment"><Handshake size={28} strokeWidth={1.5} /><span><small>OUR FOCUS</small><strong>Stronger justice systems</strong><em>Partners make support more accessible and responsive.</em></span><ArrowUpRight size={18} /></Link><Link to="/what-we-do" className="nh-work-all">See everything we do <ArrowRight size={18} /></Link></Reveal></div></div></section>

      <section className="nh-reach" aria-labelledby="nh-reach-title"><div className="nh-wrap nh-reach-layout"><Reveal className="nh-reach-copy"><span className="nh-kicker">04 / NATIONAL REACH</span><h2 id="nh-reach-title">A network that spans Tanzania.</h2><p>LSF's work connects national leadership with local legal aid providers and community paralegals. The map makes that geographic scale visible, district by district.</p><div className="nh-reach-points"><span><MapPin size={19} /> Mainland and Zanzibar</span><span><Users size={19} /> Local partners and paralegals</span><span><BookOpenCheck size={19} /> Legal knowledge and direct support</span></div><Link className="nh-dark-link" to="/legal-help">Find support near you <ArrowUpRight size={18} /></Link></Reveal><Reveal className="nh-map-panel"><TanzaniaDistrictMap /><p>District boundaries are shown for geographic context, not live service availability. 2021 Tanzania National Bureau of Statistics / UN OCHA ROSA data via <a href="https://www.geoboundaries.org/api.html" target="_blank" rel="noopener noreferrer">geoBoundaries</a>, CC BY 3.0 IGO.</p></Reveal></div></section>

      <section className="nh-impact" aria-labelledby="nh-impact-title"><div className="nh-impact-photo"><img src={photo('wanawake tunaweza- image.jpg')} alt="A community member sharing her experience" loading="lazy" /></div><div className="nh-wrap nh-impact-inner"><Reveal><span className="nh-pill"><span className="nh-pill-dot" />05 / OUR IMPACT</span><h2 id="nh-impact-title">The most meaningful change has a human story.</h2><p>Behind every result are people finding their voice, resolving challenges and helping build a fairer future.</p><Link className="nh-button nh-button-light" to="/impact">Explore our impact <ArrowUpRight size={18} /></Link></Reveal></div></section>

      <section className="nh-digital nh-wrap" aria-labelledby="nh-digital-title"><Reveal className="nh-digital-copy"><span className="nh-kicker">06 / DIGITAL ACCESS</span><h2 id="nh-digital-title">Help can start wherever you are.</h2><p>Haki Yangu brings legal information and pathways to support closer to people on their phones.</p><div className="nh-digital-actions"><Link className="nh-button nh-button-dark" to="/haki-yangu">Explore Haki Yangu <ArrowUpRight size={18} /></Link><Link className="nh-dark-link" to="/legal-help">Find legal help <ArrowRight size={18} /></Link></div></Reveal><Reveal className="nh-digital-visual"><img src={photo('haki yangu app uzinuzi.webp')} alt="LSF introducing the Haki Yangu app" loading="lazy" /><span><Smartphone size={19} /> Justice, within reach.</span></Reveal></section>

      <section className="nh-partners" aria-labelledby="nh-partners-title"><div className="nh-wrap"><Reveal className="nh-partners-heading"><div><span className="nh-kicker">STRATEGIC ALLIANCES</span><h2 id="nh-partners-title">The work is bigger<br />because we work together.</h2></div><p>Our partnerships bring resources, expertise and shared commitment to the pursuit of justice.</p></Reveal><div className="nh-partner-grid">{partners.map(([name, logo]) => <div className="nh-partner" key={name}><img src={photo(logo)} alt={name} loading="lazy" /></div>)}</div><Link className="nh-dark-link" to="/partners">Explore our partnerships <ArrowUpRight size={18} /></Link></div></section>

      <Updates />
      <section className="nh-close"><div className="nh-wrap nh-close-inner"><Reveal><span className="nh-kicker">LET'S MOVE FORWARD</span><h2>Progress happens together.</h2><p>Connect with LSF to seek support, collaborate or learn more about our work.</p></Reveal><Link className="nh-button nh-button-light" to="/contact">Contact us <ArrowUpRight size={18} /></Link></div></section>
    </div>
  </Layout>;
}
