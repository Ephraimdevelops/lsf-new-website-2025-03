import { TouchEvent, useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, HeartHandshake,
  PhoneCall, Scale, Users,
  CircleDollarSign, FileText, Network, GraduationCap, MapPin, Accessibility,
} from 'lucide-react';
import { api } from '../../convex/_generated/api';
import { HomeImpactTicker, type ImpactStat } from '../components/home/HomeImpactNumbers';
import TanzaniaDistrictMap from '../components/home/TanzaniaDistrictMap';
import Layout from '../components/layout/Layout';
import './NewHomepage.css';
import './HomepageThree.css';

const upload = (name: string) => `/lovable-uploads/${name}`;
const partners = [
  ['Denmark', 'Danish amabssador.png'],
  ['European Union', 'Funded by European Union.png'],
  ['World Bank', 'WorldBank_logo.jpg'],
  ['FCDO', 'FCDO_logo.png'],
  ['Enabel', 'Enabel.png'],
  ['WINGS', 'WINGS_logo.png'],
];
const excludedSeedNews = new Set(['lsf-launches-digital-legal-aid-platform', 'womens-land-rights-initiative', 'climate-justice-program-expands', '500-paralegals-graduate', 'digital-transformation-rural-areas', 'government-partnership-strengthens-legal-aid']);

function Hero() {
  const homepageSlides = useQuery(api.hero.get);
  const fallbackSlides = [
    { id: 'rights', image: '/homepage-concepts/hero-community-woman.jpg', label: 'Justice for a fairer Tanzania', headline: 'When people know their rights, change begins.', copy: 'We support legal aid, strengthen communities and work with partners to make justice accessible for everyone in Tanzania.', action: 'Get Legal Help', href: '/legal-help' },
    { id: 'community', image: upload('09086165-bb32-43b3-ae0a-b266fd207f36.png'), label: 'Community impact', headline: 'Justice reaches further when we work together.', copy: 'From community paralegals to national partnerships, LSF brings rights, support and lasting change within reach.', action: 'Explore Our Work', href: '/what-we-do' },
    { id: 'digital', image: upload('lsf-paralegal-servicing.jpeg'), label: 'Support within reach', headline: 'Legal help should be close to home.', copy: 'Our network connects people with legal information, practical help and trusted local support.', action: 'Find Legal Support', href: '/legal-help' },
  ];
  const published = homepageSlides?.filter(slide => slide.isActive && slide.imageUrl).sort((a, b) => a.order - b.order);
  const slides = published?.length ? published.map(slide => ({ id: slide._id, image: slide.imageUrl!, label: slide.category || 'Justice for a fairer Tanzania', headline: slide.title, copy: slide.subtitle || slide.description || '', action: slide.ctaText || 'Get Legal Help', href: slide.ctaLink?.startsWith('/') ? slide.ctaLink : '/legal-help' })) : fallbackSlides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const index = active % slides.length;
  const slide = slides[index];
  useEffect(() => {
    if (paused || slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setActive(value => (value + 1) % slides.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);
  const move = (direction: number) => setActive(value => (value + direction + slides.length) % slides.length);
  const words = slide.headline.trim().split(/\s+/);
  const highlight = index === 0 && !published?.length ? 'change begins.' : words.slice(-2).join(' ');
  const leading = index === 0 && !published?.length ? 'When people know their rights,' : words.slice(0, -2).join(' ');
  return <section className="h3-hero" aria-labelledby="h3-hero-title" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}><img key={slide.id} className="h3-hero-image" src={slide.image} alt="" fetchPriority={index === 0 ? 'high' : 'auto'} /><div className="h3-hero-wash" /><div className="h3-wrap h3-hero-inner"><div key={`${slide.id}-copy`} className="h3-hero-copy"><p className="h3-kicker">{slide.label}</p><h1 id="h3-hero-title">{leading}{' '}<span>{highlight}</span></h1><p>{slide.copy}</p><div className="h3-hero-actions"><Link className="h3-button h3-button-primary" to={slide.href}>{slide.action} <ArrowRight size={17} /></Link><Link className="h3-button h3-button-white" to="/what-we-do">Explore Our Work <ArrowRight size={17} /></Link></div></div></div>{slides.length > 1 && <div className="h3-hero-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous hero slide"><ArrowLeft size={18} /></button><div className="h3-hero-dots" aria-label="Choose hero slide">{slides.map((item, position) => <button type="button" key={item.id} onClick={() => setActive(position)} className={position === index ? 'is-active' : ''} aria-label={`Show slide ${position + 1}`} aria-current={position === index ? 'true' : undefined} />)}</div><button type="button" onClick={() => move(1)} aria-label="Next hero slide"><ArrowRight size={18} /></button></div>}</section>;
}

function Pathways() {
  const items = [
    { icon: PhoneCall, title: 'Find Legal Support', detail: 'Get connected to legal aid near you.', href: '/legal-help' },
    { icon: BookOpen, title: 'Explore Haki Yangu', detail: 'Learn your rights and take your next step.', href: '/haki-yangu' },
    { icon: HeartHandshake, title: 'Partner With Us', detail: 'Work with us to expand access to justice.', href: '/partners' },
  ];
  return <nav className="h3-pathways h3-wrap" aria-label="Ways to engage with LSF">{items.map(({ icon: Icon, title, detail, href }) => <Link to={href} key={href} className="h3-pathway"><span className="h3-path-icon"><Icon size={25} strokeWidth={1.8} /></span><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight className="h3-path-arrow" size={18} /></Link>)}</nav>;
}

const verifiedImpact: ImpactStat[] = [
  { value: '39.6M+', label: 'People reached since 2016', icon: Users },
  { value: '426,000+', label: 'Cases handled', icon: Scale },
  { value: '4,195+', label: 'Active paralegals', icon: HeartHandshake },
  { value: '184', label: 'Districts covered', icon: MapPin },
  { value: '1.2M+', label: 'People with disabilities reached', icon: Accessibility },
  { value: '64%', label: 'Women beneficiaries', icon: Users },
];

function Impact() {
  return <section className="h3-impact" aria-labelledby="h3-impact-title"><div className="h3-wrap h3-impact-intro"><div><p className="h3-kicker">Our impact</p><h2 id="h3-impact-title">A national mission.<br /><span>Measurable human impact.</span></h2></div><p>Since 2016, LSF has helped millions of people understand and use their rights. Our national network combines community legal aid, advocacy, strategic grants and direct programmes. Figures from the 2026 LSF capability statement.</p></div><HomeImpactTicker tone="dark" density="compact" figures={verifiedImpact} /><div className="h3-wrap h3-impact-link"><Link className="h3-text-link" to="/impact">Explore our impact <ArrowRight size={16} /></Link></div></section>;
}

function About() {
  const highlights = [
    { icon: Scale, label: 'Legal Aid' },
    { icon: HeartHandshake, label: 'Community First' },
    { icon: Users, label: 'Partnerships' },
  ];
  return <section className="h3-about" aria-labelledby="h3-about-title"><div className="h3-wrap h3-about-grid"><div className="h3-about-copy"><p className="h3-kicker h3-pill">Who we are</p><h2 id="h3-about-title">Justice Within <span>Reach</span></h2><div className="h3-about-statement"><p>LSF is a Tanzanian organisation working to make justice accessible through community legal aid and legal empowerment.</p><p>We combine <strong>strategic grants and direct implementation</strong>, working with local paralegals, civil society and public institutions.</p><p>Our work spans women’s rights, gender equality, climate justice, digital legal tools and stronger justice systems across Mainland Tanzania and Zanzibar.</p></div><div className="h3-about-highlights">{highlights.map(({ icon: Icon, label }) => <span key={label}><Icon size={22} strokeWidth={1.7} />{label}</span>)}</div><Link className="h3-button h3-button-primary" to="/about">Our Story <ArrowRight size={16} /></Link></div><img className="h3-about-photo" src="/homepage-concepts/lsf-paralegal-consultation-v2.jpg" alt="Illustrative scene of an LSF paralegal consulting community members" loading="lazy" /></div></section>;
}

function ReachAndWork() {
  const items = [
    { icon: Scale, title: 'Access to justice', detail: 'Community legal education, advice and case support.', href: '/what-we-do' },
    { icon: HeartHandshake, title: 'Women’s rights', detail: 'Gender equality, protection and economic empowerment.', href: '/what-we-do' },
    { icon: GraduationCap, title: 'Climate justice', detail: 'Supporting rights-based climate resilience.', href: '/what-we-do' },
    { icon: FileText, title: 'Digital legal support', detail: 'Making rights information easier to access with Haki Yangu.', href: '/haki-yangu' },
    { icon: Network, title: 'Institutions and policy', detail: 'Strengthening legal aid systems and public practice.', href: '/what-we-do' },
    { icon: CircleDollarSign, title: 'Grants and partnerships', detail: 'Resourcing and supporting local paralegal organisations.', href: '/what-we-do/grant-making' },
  ];
  return <section className="h3-reach-work" aria-labelledby="h3-reach-work-title"><div className="h3-wrap h3-reach-work-grid"><div className="h3-approach"><div className="h3-approach-intro"><p className="h3-kicker">Our work</p><h2>Local action.<br /><span>Lasting change.</span></h2><p>We bring legal support close to communities while strengthening the systems they rely on.</p></div><div className="h3-approach-list">{items.map(({ icon: Icon, title, detail, href }) => <Link to={href} className="h3-approach-item" key={title}><Icon className="h3-approach-icon" size={22} strokeWidth={1.7} /><span><strong>{title}</strong><small>{detail}</small></span><ArrowUpRight size={17} /></Link>)}</div><Link className="h3-text-link" to="/what-we-do">Explore our approach <ArrowRight size={16} /></Link></div><div className="h3-reach"><div className="h3-reach-heading"><div><p className="h3-kicker">Our reach</p><h2 id="h3-reach-work-title">A network across <span>Tanzania.</span></h2></div><div className="h3-reach-facts"><span><strong>31</strong>Regions</span><span><strong>184</strong>Districts</span></div></div><div className="h3-map"><TanzaniaDistrictMap showPresenceMarkers showAllRegions /></div><p className="h3-map-note">All 31 regional markers illustrate LSF’s national network, not individual service locations. District boundaries: 2021 <a href="https://www.geoboundaries.org/api.html" target="_blank" rel="noopener noreferrer">geoBoundaries</a>, CC BY 3.0 IGO.</p><Link className="h3-text-link" to="/legal-help">Explore our reach <ArrowRight size={16} /></Link></div></div></section>;
}

function Stories() {
  const stories = useQuery(api.stories.get);
  const excerpt = (html: string) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    if (text.length <= 190) return text;
    const cut = text.slice(0, 190);
    return `${cut.slice(0, cut.lastIndexOf(' '))}…`;
  };
  const available = stories?.filter(item => Boolean(item.imageUrl) && !item.imageUrl?.includes('placeholder.svg')) || [];
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const index = available.length ? active % available.length : 0;
  const story = available[index];
  const move = (direction: number) => setActive(current => (current + direction + available.length) % available.length);
  const onTouchEnd = (event: TouchEvent<HTMLElement>) => { if (touchStart === null || available.length < 2) { setTouchStart(null); return; } const distance = event.changedTouches[0].clientX - touchStart; if (Math.abs(distance) > 45) move(distance < 0 ? 1 : -1); setTouchStart(null); };
  if (!story) return null;
  const photo = story.imageUrl && !failedImages.includes(story.imageUrl) ? story.imageUrl : '';
  const imageFailed = () => { if (story.imageUrl) setFailedImages(current => current.includes(story.imageUrl!) ? current : [...current, story.imageUrl!]); };
  return <section className="h3-stories" aria-labelledby="h3-stories-title" onTouchStart={event => setTouchStart(event.touches[0].clientX)} onTouchEnd={onTouchEnd}>
    {photo && <img className="h3-stories-backdrop" key={`backdrop-${story._id}`} src={photo} alt="" aria-hidden="true" onError={imageFailed} />}
    <div className={`h3-wrap h3-stories-inner ${photo ? '' : 'is-without-photo'}`}>
      <div className="h3-stories-copy">
        <p className="h3-story-label">Impact <span>stories</span></p>
        {story.quote ? <blockquote className="h3-story-quote"><span aria-hidden="true">“</span><p>{story.quote}</p><cite>{story.personName} <small>{story.location}</small></cite></blockquote> : <div className="h3-story-summary"><p>{excerpt(story.story)}</p><strong>{story.personName}{story.location ? ` · ${story.location}` : ''}</strong></div>}
        <h2 id="h3-stories-title">{story.title}</h2>
        <Link className="h3-button h3-button-white" to={`/stories/${story._id}`}>Read this story <ArrowRight size={16} /></Link>
        {available.length > 1 && <div className="h3-story-controls"><button type="button" onClick={() => move(-1)} aria-label="Previous story"><ArrowLeft size={17} /></button><span>{index + 1} / {available.length}</span><button type="button" onClick={() => move(1)} aria-label="Next story"><ArrowRight size={17} /></button></div>}
      </div>
      {photo && <figure className="h3-story-visual" key={`image-${story._id}`}><img src={photo} alt={`Photo for ${story.title}`} loading="lazy" onError={imageFailed} /></figure>}
    </div>
  </section>;
}

function News() {
  const news = useQuery(api.news.get, {});
  const items = news?.filter(item => !excludedSeedNews.has(item.slug || '')).slice(0, 3) || [];
  const fallback = [
    { title: 'News and updates from LSF', image: upload('LSF with partner meeting.jpg'), href: '/news', label: 'NEWS' },
    { title: 'Community stories and local voices', image: upload('lsf-paralegal-servicing.jpeg'), href: '/success-stories', label: 'STORIES' },
    { title: 'Reports and evidence from our work', image: upload('LSF 2024 ANNUAL REPORT (Mobile Video).png'), href: '/publications', label: 'PUBLICATIONS' },
  ];
  return <section className="h3-news" aria-labelledby="h3-news-title"><div className="h3-wrap"><div className="h3-section-head"><div><p className="h3-kicker">News & updates</p><h2 id="h3-news-title">The work <span>continues.</span></h2></div><Link className="h3-text-link" to="/news">View all news <ArrowRight size={16} /></Link></div><div className="h3-news-list">{items.length ? items.map(item => <Link className="h3-news-item" to={`/news/${item.slug || item._id}`} key={item._id}><img src={item.image || upload('community-legal-aid.jpg')} alt="" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = upload('community-legal-aid.jpg'); }} /><span>{item.category || 'NEWS'}</span><strong>{item.title}</strong><small>{item.date}</small><ArrowUpRight size={18} /></Link>) : fallback.map(item => <Link className="h3-news-item" to={item.href} key={item.href}><img src={item.image} alt="" loading="lazy" /><span>{item.label}</span><strong>{item.title}</strong><ArrowUpRight size={18} /></Link>)}</div></div></section>;
}

function Partners() {
  return <section className="h3-partners" aria-labelledby="h3-partners-title"><div className="h3-wrap h3-partners-grid"><div><p className="h3-kicker">Our partners</p><h2 id="h3-partners-title">The work is bigger<br />because we work <span>together.</span></h2><p>We collaborate with government, civil society and development partners to expand access to justice.</p></div><div><div className="h3-partner-logos">{partners.map(([name, logo]) => <img key={name} src={upload(logo)} alt={name} loading="lazy" />)}</div><Link className="h3-text-link" to="/partners">View all partners <ArrowRight size={16} /></Link></div></div></section>;
}

export default function HomepageThree() {
  return <Layout><Helmet><title>Homepage concept 03 | LSF Tanzania</title><meta name="robots" content="noindex, nofollow" /><meta name="description" content="Explore a new Legal Services Facility homepage design concept." /></Helmet><div className="h3-page"><Hero /><Pathways /><Impact /><About /><ReachAndWork /><Stories /><News /><Partners /></div></Layout>;
}
