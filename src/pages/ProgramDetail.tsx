import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Target, Users, Heart, CheckCircle2,
  Award, ArrowRight, Quote, TrendingUp, Scale, Home,
  Smartphone, FileText, Globe, Shield, Handshake
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import Typography from '../components/shared/Typography';
import { Button } from '../components/ui/button';

// Gold Standard Sauti ya Mwanamke Content
const sautiYaMwanamke = {
  slug: 'sauti-ya-mwanamke',
  title: 'Amplifying Her Voice.',
  subtitle: 'From the village meeting to the high court, we ensure women are seen, heard, and protected.',
  heroDescription: 'In partnership with the European Union and Enabel, the Sauti ya Mwanamke initiative is Tanzania\'s largest grassroots movement for gender justice. We don\'t just advocate for rights; we build the infrastructure to enforce them. By mobilizing over 4,000 paralegals across 168 districts, we are dismantling the barriers of silence, poverty, and custom that have held women back for generations. This initiative also encompasses IMPAWLA (Improving Women\'s Access to Land Rights), addressing climate-related land disputes affecting women.',
  heroImage: '/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png',

  // The Challenge Section
  challenge: {
    headline: 'The Silence We Are Breaking.',
    intro: 'Despite progressive national laws, the reality for women in rural Tanzania remains governed by discriminatory customary practices.',
    points: [
      {
        title: 'The Land Gap',
        stat: '< 20%',
        description: 'While the Land Acts of 1999 grant equal ownership, women legally own less than 20% of registered land in Tanzania.',
        icon: <Home className="h-6 w-6" />,
      },
      {
        title: 'The Violence Epidemic',
        stat: '~40%',
        description: 'Data indicates that nearly 40% of women aged 15-49 have experienced physical violence.',
        icon: <Shield className="h-6 w-6" />,
      },
      {
        title: 'The Access Void',
        stat: '100km+',
        description: 'For a widow in a remote ward in Shinyanga or Dodoma, the nearest courtroom is often 100km away, and legal fees are impossible to pay.',
        icon: <Scale className="h-6 w-6" />,
      },
    ],
    closing: 'Sauti ya Mwanamke exists to close this gap between the law as written and the law as lived.',
  },

  // Methodology Section
  methodology: {
    headline: 'Justice Where She Lives.',
    approaches: [
      {
        number: '01',
        title: 'The Paralegal First-Responders',
        description: 'We have trained a specialized cadre of Community Paralegals embedded in 168 districts. These are not outsiders; they are trusted neighbors who speak the local dialect. They are trained to intervene in domestic disputes, draft simple wills, and stop land grabbing before it escalates to court.',
        icon: <Users className="h-8 w-8" />,
      },
      {
        number: '02',
        title: 'Economic Security as Justice',
        description: 'A woman with her own money is harder to silence. We integrate legal aid with economic empowerment groups (VICOBA). When a woman secures her Certificate of Customary Right of Occupancy (CCRO), she gains collateral for loans, transforming her from a dependent to a landowner.',
        icon: <TrendingUp className="h-8 w-8" />,
      },
      {
        number: '03',
        title: 'Digital Safe Spaces',
        description: 'Using the Haki Yangu platform, we provide a discreet reporting mechanism for Gender-Based Violence (GBV). This allows victims to seek help without the stigma or danger of walking into a police station publicly.',
        icon: <Smartphone className="h-8 w-8" />,
      },
    ],
  },

  // Impact Dashboard
  impact: {
    headline: 'A Decade of Difference.',
    stats: [
      { value: '4,000+', label: 'Paralegals Deployed', description: 'The largest legal aid network in East Africa.' },
      { value: '168', label: 'Districts Covered', description: 'Reaching from Arusha to Mtwara.' },
      { value: '60%', label: 'Case Resolution Rate', description: 'Disputes resolved at village level without costly litigation.' },
    ],
    achievement: {
      text: 'In 2024, LSF partners facilitated the issuance of over 1,200 land titles to single mothers and widows in the Lake Zone, securing assets worth over TZS 2.5 Billion for vulnerable families.',
    },
  },

  // Case Study
  caseStudy: {
    headline: 'Meet Mama Zuwena.',
    quote: 'They told me a widow has no voice. LSF showed me I have a roar.',
    context: 'When Zuwena\'s husband passed away in the Simiyu Region, her in-laws claimed her three-acre maize farm was "clan property." They ordered her to leave the house she had built with her own hands. In the past, Zuwena would have become destitute.',
    intervention: 'Instead of leaving, Zuwena contacted an LSF-supported paralegal in her ward. The paralegal didn\'t just give advice; they convened a Ward Tribunal meeting and presented the Probate and Administration of Estates Act, proving Zuwena\'s right to inherit.',
    outcome: 'Today, Zuwena holds the legal title to her farm. She has used the land as collateral to start a poultry business and now serves as a "Balozi wa Haki" (Justice Ambassador), mentoring other widows in her village.',
    image: '/lovable-uploads/07fc4d64-f9f2-40fb-83d5-6a1a52bbdb98.png',
  },

  // Donors/Partners
  donors: [
    { name: 'European Union', logo: '/lovable-uploads/eu-logo.png', color: '#003399' },
    { name: 'Enabel', logo: '/lovable-uploads/enabel-logo.png', color: '#F26522' },
  ],
};

// Gold Standard Wanawake Tunaweza Content
const wanawakeTunaweza = {
  slug: 'wanawake-tunaweza',
  title: 'Leadership Has No Gender.',
  subtitle: 'We are moving women from the back of the room to the head of the table.',
  heroDescription: 'True justice requires representation. Wanawake Tunaweza is LSF\'s flagship initiative dedicated to increasing women\'s participation in leadership and decision-making bodies across Tanzania. From Village Councils to Ward Tribunals, we are equipping women with the legal literacy, economic confidence, and leadership skills to shape the future of their communities. We believe that when a woman leads, the entire nation succeeds.',
  heroImage: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',

  // The Challenge Section
  challenge: {
    headline: 'The Representation Gap.',
    intro: 'Women constitute more than 51% of Tanzania\'s population, yet their voice in local governance remains disproportionately low.',
    points: [
      {
        title: 'The "Silent" Seats',
        stat: 'Silent',
        description: 'Even when women are elected to quotas in village councils, cultural norms often pressure them to remain silent during debates.',
        icon: 'volume-x',
      },
      {
        title: 'The Economic Barrier',
        stat: 'Blocked',
        description: 'You cannot run for office if you cannot feed your family. Economic vulnerability is the primary barrier to political participation.',
        icon: 'ban',
      },
      {
        title: 'The Knowledge Gap',
        stat: 'Missing',
        description: 'Many women aspire to lead but lack the technical knowledge of the Local Government Laws required to campaign and govern effectively.',
        icon: 'book-x',
      },
    ],
  },

  // Methodology Section
  methodology: {
    headline: 'Cultivating Civics & Commerce.',
    approaches: [
      {
        number: '01',
        title: 'The "Seat at the Table" Strategy',
        description: 'We don\'t just ask women to vote; we train them to run. We provide mentorship and legal training for women aspiring to positions in Village Councils, School Boards, and Water Committees. We teach them parliamentary procedure, public speaking, and the Local Government Act so they can govern with authority.',
        icon: 'podium',
      },
      {
        number: '02',
        title: 'Economic Sovereignty (The Engine)',
        description: 'Power requires resources. We link women\'s groups to Community Microfinance (VICOBA) and legal aid for business registration. By securing women\'s property rights, we give them the financial stability needed to enter the civic space without fear of intimidation.',
        icon: 'coins',
      },
      {
        number: '03',
        title: 'Male Allyship',
        description: 'You cannot change the system by talking only to women. We run dialogue sessions with traditional leaders and husbands to reframe women\'s leadership not as a threat, but as a community asset.',
        icon: 'handshake',
      },
    ],
  },

  // Impact Dashboard
  impact: {
    headline: 'Shaping the Future.',
    stats: [
      { value: '35%', label: 'Increase in Women Leaders', description: 'In target Village Councils since 2022.' },
      { value: '2,500+', label: 'Women Trained', description: 'In leadership and governance protocols.' },
      { value: '120+', label: 'Ward Tribunals', description: 'Now chaired or co-chaired by women in our zones.' },
    ],
    achievement: {
      text: 'In the 2024 Local Government Elections, 40% of LSF-trained candidates in the Morogoro region successfully won their seats, shifting the gender balance in local decision-making for the next 5 years.',
    },
  },

  // Case Study
  caseStudy: {
    headline: 'From "Housewife" to Chairperson.',
    quote: 'They said a woman cannot resolve land disputes. Now, they come to me for judgments.',
    author: 'Hon. Neema M.',
    role: 'Ward Tribunal Member',
    journey: 'Neema used to be afraid to speak at village meetings. When LSF launched Wanawake Tunaweza in her district, she attended the leadership boot camp. She learned that the law explicitly allows women to sit on tribunals—a fact that had been hidden from her community.',
    shift: 'Armed with knowledge of the Ward Tribunals Act, Neema campaigned for a seat. She faced ridicule, but her ability to quote the law silenced her critics.',
    result: 'Today, Neema is a respected member of the tribunal. She has personally presided over 50+ cases, ensuring fair rulings for widows and orphans who were previously ignored. She is proof that competence conquers prejudice.',
    image: '/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png',
  },
};

const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Sauti ya Mwanamke - Gold Standard Page
  if (id === 'sauti-ya-mwanamke') {
    const program = sautiYaMwanamke;

    return (
      <Layout>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-fixed bg-cover bg-center"
            style={{ backgroundImage: `url(${program.heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-primary/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10 py-32">
            <div className="max-w-4xl">
              {/* Back Link */}
              <Link to="/programs" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Programs
              </Link>

              {/* Partner Badge */}
              <div className="inline-flex items-center gap-3 mb-8 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 border border-white/20">
                <Handshake className="h-4 w-4 text-[#F26522]" />
                <span className="text-white/90 text-sm">In partnership with <strong className="text-[#003399]">EU</strong> & <strong className="text-[#F26522]">Enabel</strong></span>
              </div>

              {/* Title */}
              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-[0.95]">
                {program.title}
              </h1>

              {/* Subtitle */}
              <p className="text-secondary-orange text-xl md:text-2xl lg:text-3xl font-semibold mb-8 max-w-3xl">
                {program.subtitle}
              </p>

              {/* Description */}
              <p className="text-white/90 text-lg md:text-xl max-w-3xl leading-relaxed mb-12">
                {program.heroDescription}
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Link to="/publications">
                  <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-6 text-lg rounded-full shadow-xl">
                    <FileText className="mr-3 h-5 w-5" />
                    View the 2025 Impact Report
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE CHALLENGE */}
        <section className="py-24 bg-neutral-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {program.challenge.headline}
              </Typography>
              <p className="text-white/80 text-xl">
                {program.challenge.intro}
              </p>
            </div>

            {/* Challenge Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {program.challenge.points.map((point, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-secondary-orange/50 transition-colors">
                  <div className="w-14 h-14 bg-secondary-orange/20 rounded-2xl flex items-center justify-center mb-6 text-secondary-orange">
                    {point.icon}
                  </div>
                  <p className="text-4xl md:text-5xl font-black text-secondary-orange mb-2">{point.stat}</p>
                  <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
                  <p className="text-white/70 leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-secondary-orange text-xl font-semibold italic max-w-3xl mx-auto">
              {program.challenge.closing}
            </p>
          </div>
        </section>

        {/* SECTION 3: METHODOLOGY */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-secondary-orange font-bold text-sm uppercase tracking-widest mb-4">
                <Target className="h-4 w-4" />
                How We Empower
              </div>
              <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900">
                {program.methodology.headline}
              </Typography>
            </div>

            <div className="space-y-12 max-w-5xl mx-auto">
              {program.methodology.approaches.map((approach, index) => (
                <div key={index} className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  {/* Number & Icon */}
                  <div className="lg:w-1/4 flex justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-secondary-orange to-secondary-orange/80 rounded-3xl flex items-center justify-center text-white shadow-xl">
                        {approach.icon}
                      </div>
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-black text-lg">
                        {approach.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:w-3/4 text-center lg:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">{approach.title}</h3>
                    <p className="text-neutral-600 text-lg leading-relaxed">{approach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: IMPACT DASHBOARD */}
        <section className="py-24 bg-gradient-to-br from-primary via-primary-dark to-neutral-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-secondary-orange font-bold text-sm uppercase tracking-widest mb-4">
                <TrendingUp className="h-4 w-4" />
                Impact Dashboard
              </div>
              <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold">
                {program.impact.headline}
              </Typography>
            </div>

            {/* Stats Grid - Geometric/Tech style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-16 bg-white/10 rounded-3xl overflow-hidden">
              {program.impact.stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm p-10 text-center border-b md:border-b-0 md:border-r border-white/10 last:border-r-0">
                  <p className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2">{stat.value}</p>
                  <p className="text-secondary-orange font-bold text-lg uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-white/70 text-sm">{stat.description}</p>
                </div>
              ))}
            </div>

            {/* Key Achievement */}
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-6xl text-secondary-orange/20">"</div>
              <Award className="h-8 w-8 text-secondary-orange mb-4" />
              <p className="text-xl md:text-2xl text-white leading-relaxed font-medium">
                {program.impact.achievement.text}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: CASE STUDY */}
        <section className="py-24 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={program.caseStudy.image}
                    alt="Mama Zuwena"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                {/* Quote overlay */}
                <div className="absolute -bottom-8 -right-8 bg-secondary-orange text-white p-8 rounded-3xl max-w-[280px] shadow-xl">
                  <Quote className="h-8 w-8 mb-3 opacity-50" />
                  <p className="font-bold text-lg leading-snug">"{program.caseStudy.quote}"</p>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="inline-flex items-center gap-2 text-secondary-orange font-bold text-sm uppercase tracking-widest mb-4">
                  <Heart className="h-4 w-4" />
                  Real Story
                </div>
                <Typography variant="h2" className="text-4xl md:text-5xl font-bold text-neutral-900 mb-8">
                  {program.caseStudy.headline}
                </Typography>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-primary text-lg mb-2">The Context</h4>
                    <p className="text-neutral-600 leading-relaxed">{program.caseStudy.context}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-primary text-lg mb-2">The Intervention</h4>
                    <p className="text-neutral-600 leading-relaxed">{program.caseStudy.intervention}</p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                    <h4 className="font-bold text-green-700 text-lg mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      The Outcome
                    </h4>
                    <p className="text-green-800 leading-relaxed">{program.caseStudy.outcome}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DONOR SECTION */}
        <section className="py-16 bg-white border-t border-neutral-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold">Funded By</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {/* EU Logo placeholder with EU Blue */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#003399' }}>
                  <span className="text-white font-black text-xl">EU</span>
                </div>
                <div>
                  <p className="font-bold text-neutral-900">European Union</p>
                  <p className="text-sm text-neutral-500">Development Partner</p>
                </div>
              </div>

              {/* Enabel Logo placeholder with Enabel Orange */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F26522' }}>
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900">Enabel</p>
                  <p className="text-sm text-neutral-500">Belgian Development Agency</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-neutral-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <Typography variant="h3" className="text-3xl md:text-4xl font-bold mb-6">
              Join the Movement for Gender Justice
            </Typography>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
              Partner with LSF to expand the reach of Sauti ya Mwanamke and help more women across Tanzania find their voice.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary-orange hover:bg-secondary-orange/90 text-white font-bold px-10 py-5 rounded-full text-lg">
                  Partner With Us
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-bold px-10 py-5 rounded-full text-lg">
                  Support This Program
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Wanawake Tunaweza - Gold Standard Page (Leadership Theme)
  if (id === 'wanawake-tunaweza') {
    const program = wanawakeTunaweza;

    return (
      <Layout>
        {/* HERO SECTION - Bold Leadership Theme */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${program.heroImage})` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-secondary-teal/70 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          <div className="container mx-auto px-4 relative z-10 py-32">
            <div className="max-w-4xl">
              <Link to="/programs" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Programs
              </Link>

              <div className="inline-flex items-center gap-3 mb-8 bg-secondary-teal rounded-full px-5 py-2">
                <Award className="h-4 w-4 text-white" />
                <span className="text-white font-bold text-sm uppercase tracking-widest">Leadership Initiative</span>
              </div>

              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-[0.95]">
                {program.title}
              </h1>

              <p className="text-secondary-yellow text-xl md:text-2xl lg:text-3xl font-semibold mb-8 max-w-3xl">
                {program.subtitle}
              </p>

              <p className="text-white/90 text-lg md:text-xl max-w-3xl leading-relaxed mb-12">
                {program.heroDescription}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/impact">
                  <Button size="lg" className="bg-secondary-yellow hover:bg-secondary-yellow/90 text-black font-bold px-10 py-6 text-lg rounded-full shadow-xl">
                    <TrendingUp className="mr-3 h-5 w-5" />
                    See the Leadership Data
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE CHALLENGE - The Representation Gap */}
        <section className="py-24 bg-neutral-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {program.challenge.headline}
              </Typography>
              <p className="text-white/80 text-xl">
                {program.challenge.intro}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {program.challenge.points.map((point, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-secondary-yellow/50 transition-colors text-center">
                  <div className="w-16 h-16 bg-secondary-yellow/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <span className="text-secondary-yellow text-3xl font-black">{point.stat.charAt(0)}</span>
                  </div>
                  <p className="text-2xl md:text-3xl font-black text-secondary-yellow mb-2">{point.stat}</p>
                  <h3 className="text-xl font-bold text-white mb-3">{point.title}</h3>
                  <p className="text-white/70 leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: METHODOLOGY - Cultivating Civics & Commerce */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-secondary-teal font-bold text-sm uppercase tracking-widest mb-4">
                <Target className="h-4 w-4" />
                How We Build Leaders
              </div>
              <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900">
                {program.methodology.headline}
              </Typography>
            </div>

            <div className="space-y-12 max-w-5xl mx-auto">
              {program.methodology.approaches.map((approach, index) => (
                <div key={index} className={`flex flex-col lg:flex-row gap-8 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="lg:w-1/4 flex justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-secondary-teal to-secondary-teal-dark rounded-3xl flex items-center justify-center text-white shadow-xl">
                        {approach.icon === 'podium' && <Users className="h-10 w-10" />}
                        {approach.icon === 'coins' && <TrendingUp className="h-10 w-10" />}
                        {approach.icon === 'handshake' && <Handshake className="h-10 w-10" />}
                      </div>
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-secondary-yellow rounded-xl flex items-center justify-center text-black font-black text-lg">
                        {approach.number}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-3/4 text-center lg:text-left">
                    <h3 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">{approach.title}</h3>
                    <p className="text-neutral-600 text-lg leading-relaxed">{approach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: IMPACT DASHBOARD - Shaping the Future */}
        <section className="py-24 bg-gradient-to-br from-secondary-teal via-secondary-teal-dark to-neutral-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 text-secondary-yellow font-bold text-sm uppercase tracking-widest mb-4">
                <TrendingUp className="h-4 w-4" />
                Impact Dashboard
              </div>
              <Typography variant="h2" className="text-4xl md:text-5xl lg:text-6xl font-bold">
                {program.impact.headline}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mb-16 bg-white/10 rounded-3xl overflow-hidden">
              {program.impact.stats.map((stat, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm p-10 text-center border-b md:border-b-0 md:border-r border-white/10 last:border-r-0">
                  <p className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-2">{stat.value}</p>
                  <p className="text-secondary-yellow font-bold text-lg uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-white/70 text-sm">{stat.description}</p>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-6xl text-secondary-yellow/20">"</div>
              <Award className="h-8 w-8 text-secondary-yellow mb-4" />
              <p className="text-xl md:text-2xl text-white leading-relaxed font-medium">
                {program.impact.achievement.text}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: CASE STUDY - Hon. Neema */}
        <section className="py-24 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={program.caseStudy.image}
                    alt={program.caseStudy.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 bg-secondary-teal text-white p-8 rounded-3xl max-w-[300px] shadow-xl">
                  <Quote className="h-8 w-8 mb-3 opacity-50" />
                  <p className="font-bold text-lg leading-snug mb-4">"{program.caseStudy.quote}"</p>
                  <p className="text-white/90 text-sm">— {program.caseStudy.author}, {program.caseStudy.role}</p>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 text-secondary-teal font-bold text-sm uppercase tracking-widest mb-4">
                  <Heart className="h-4 w-4" />
                  Real Story
                </div>
                <Typography variant="h2" className="text-4xl md:text-5xl font-bold text-neutral-900 mb-8">
                  {program.caseStudy.headline}
                </Typography>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-bold text-secondary-teal text-lg mb-2">The Journey</h4>
                    <p className="text-neutral-600 leading-relaxed">{program.caseStudy.journey}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary-teal text-lg mb-2">The Shift</h4>
                    <p className="text-neutral-600 leading-relaxed">{program.caseStudy.shift}</p>
                  </div>
                  <div className="bg-secondary-teal/10 border-l-4 border-secondary-teal p-6 rounded-r-xl">
                    <h4 className="font-bold text-secondary-teal text-lg mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      The Result
                    </h4>
                    <p className="text-neutral-700 leading-relaxed">{program.caseStudy.result}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-neutral-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <Typography variant="h3" className="text-3xl md:text-4xl font-bold mb-6">
              Support Women's Leadership in Tanzania
            </Typography>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
              Partner with LSF to expand Wanawake Tunaweza and help more women take their rightful seat at the table.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary-teal hover:bg-secondary-teal/90 text-white font-bold px-10 py-5 rounded-full text-lg">
                  Partner With Us
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-bold px-10 py-5 rounded-full text-lg">
                  Support This Program
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Not Found
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Typography variant="h2" className="text-neutral-900 mb-4">Program Not Found</Typography>
          <p className="text-neutral-600 mb-8">The program you're looking for doesn't exist.</p>
          <Link to="/programs"><Button className="bg-primary text-white"><ArrowLeft className="mr-2 h-4 w-4" />Back to Programs</Button></Link>
        </div>
      </div>
    </Layout>
  );
};

export default ProgramDetail;
