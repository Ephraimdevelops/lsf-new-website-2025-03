import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Target, Users, Heart, CheckCircle2,
  Award, ArrowRight, Quote, TrendingUp, Scale, Home,
  Smartphone, FileText, Globe, Shield, Handshake, Leaf
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
        description: 'Using the Haki Yangu platform (5,831 Downloads), we provided a discreet reporting mechanism for GBV. In 2024 alone, 415 disputes were resolved directly via the App, allowing victims to seek help without the stigma of public stations.',
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
    { name: 'European Union', logo: '/lovable-uploads/Funded by European Union.png', color: '#003399' },
    { name: 'Enabel', logo: '/lovable-uploads/Enabel.png', color: '#F26522' },
  ],
};

// Gold Standard Wanawake Tunaweza Content (Updated from 2024 Report)
const wanawakeTunaweza = {
  slug: 'wanawake-tunaweza',
  title: 'Women We Can.',
  subtitle: 'Economic sovereignty and legal empowerment for Maasai women in Longido.',
  heroDescription: 'Implemented in partnership with North-South Cooperation of Luxembourg (2022-2024), Wanawake Tunaweza is a transformative initiative targeting Maasai women in Longido District, Arusha Region. By fusing economic empowerment (VICOBA groups), legal literacy, educational infrastructure, and male champion engagement, we are dismantling the patriarchal barriers that have marginalized women for generations.',
  heroImage: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',

  // The Challenge Section
  challenge: {
    headline: 'The Maasai Context.',
    intro: 'In Longido District, deeply rooted patriarchal systems prevail. Women face structural barriers to voice, resources, and education.',
    points: [
      {
        title: 'Voice Poverty',
        stat: 'Silenced',
        description: 'Women are often excluded from Boma councils where key decisions about land, marriage, and resources are made by men.',
        icon: 'volume-x',
      },
      {
        title: 'Harmful Practices',
        stat: '-87.3%',
        description: 'In 2024, we recorded an 87.3% decline in FGM and early marriage rates in target wards through community dialogue.',
        icon: 'ban',
      },
      {
        title: 'Educational Exclusion',
        stat: '<20%',
        description: 'Girls are viewed as temporary household members. We built 2 dormitories to change this reality.',
        icon: 'book-x',
      },
    ],
  },

  // Methodology Section
  methodology: {
    headline: 'The Four-Pillar Approach.',
    approaches: [
      {
        number: '01',
        title: 'VICOBA Economic Groups',
        description: 'We established 11 women\'s economic groups with 209 members trained in entrepreneurship. These Village Community Banks create internal capital markets, enabling women to access loans without male permission—a revolutionary act of financial independence.',
        icon: 'coins',
      },
      {
        number: '02',
        title: 'Educational Infrastructure',
        description: 'Construction of dormitories at Lekule and Namanga Secondary Schools benefiting 1,214 girls. A dormitory is a "safe harbor" where a girl\'s primary identity is student, not bride. ICT facilities enable 40 students to receive digital literacy simultaneously.',
        icon: 'school',
      },
      {
        number: '03',
        title: 'Male Champion Model',
        description: 'Through partner WASHEWILO, we trained 20 traditional leaders (Laigwanan) and 7 Male Champions on women\'s legal rights. When a traditional leader condemns GBV, it carries more weight than any statute. We shift norms from within.',
        icon: 'handshake',
      },
    ],
  },

  // Impact Dashboard
  impact: {
    headline: '2024 Results.',
    stats: [
      { value: '209', label: 'Women Trained', description: 'In 11 VICOBA/economic groups across Kimokouwa and Eworendeka villages.' },
      { value: '1,214', label: 'Girls Reached', description: 'Through dormitories and menstrual hygiene support at secondary schools.' },
      { value: '2,500+', label: 'Community Members', description: 'Exposed to gender rights education and legal awareness campaigns.' },
    ],
    achievement: {
      text: 'The "Osiligi" (Hope) collective was established with 11 sewing machines to produce reusable sanitary pads, providing income for women while addressing menstrual hygiene for girls. 1,420 tree seedlings were successfully nurtured despite drought conditions, integrating climate resilience with social development.',
    },
  },

  // Case Study
  caseStudy: {
    headline: 'The Osiligi Collective.',
    quote: 'Now we have our own money. We decide how to use it.',
    author: 'Osiligi Group Member',
    role: 'Entrepreneur, Longido',
    journey: 'Before Wanawake Tunaweza, the women of Longido had no access to credit without male permission. The VICOBA model changed everything—pooling savings to create an internal capital market.',
    shift: 'The Osiligi manufacturing group now produces reusable sanitary pads distributed to schools, closing the loop between economic production and social need.',
    result: 'Women who once lacked voice in Boma councils now run businesses, own capital assets, and mentor the next generation. The 11 sewing machines represent more than equipment—they are tools of liberation.',
    image: '/lovable-uploads/3fa5911c-166b-4104-90f7-f6f1e1049c2f.png',
  },
  // Donors/Partners
  donors: [
    { name: 'North-South Cooperation', logo: '/lovable-uploads/Northsouth cooperation.png', color: '#E30613' },
  ],
};

// Mama Samia Legal Aid Campaign Content (LSF as Strategic Co-Lead)
const mamaSamiaLegalAid = {
  slug: 'mama-samia-legal-aid-campaign',
  title: 'Justice for Every Tanzanian.',
  subtitle: 'A State-Civil Society Partnership Operationalizing the Legal Aid Act.',
  heroDescription: 'The Mama Samia Legal Aid Campaign (MSLAC) is Tanzania\'s largest coordinated effort to bring legal aid to every citizen. LSF serves as Vice-Chair of the National Campaign Committee alongside the Ministry of Constitutional and Legal Affairs. In 2023, LSF disbursed TZS 3.1 billion to 168 implementing partners, deploying 4,000+ paralegals as the campaign\'s primary frontline workforce.',
  heroImage: '/lovable-uploads/mama%20samia%20legal%20aid%20campaingn.jpg',

  // The Challenge Section
  challenge: {
    headline: 'Closing the Justice Gap.',
    intro: 'Despite the Legal Aid Act of 2017, millions of Tanzanians still lack access to basic legal services.',
    points: [
      {
        title: 'The Awareness Gap',
        stat: '70%',
        description: 'An estimated 70% of rural Tanzanians are unaware of free legal aid services available through the Legal Aid Act.',
        icon: <Globe className="h-6 w-6" />,
      },
      {
        title: 'The Infrastructure Gap',
        stat: 'Limited',
        description: 'Legal aid desks exist in only a fraction of courts. Without community-based delivery, the law remains inaccessible.',
        icon: <Scale className="h-6 w-6" />,
      },
      {
        title: 'The Gender Gap',
        stat: '60%+',
        description: 'Women and children are disproportionately affected by the justice gap, particularly in cases of GBV, land disputes, and inheritance.',
        icon: <Shield className="h-6 w-6" />,
      },
    ],
    closing: 'The Mama Samia Legal Aid Campaign exists to bridge these gaps through coordinated national action.',
  },

  // Methodology Section
  methodology: {
    headline: 'The LSF Engine.',
    approaches: [
      {
        number: '01',
        title: 'Strategic Governance',
        description: 'LSF CEO Ms. Lulu Ng\'wanakilala serves as Vice-Chair of the National Campaign Committee, positioning LSF directly alongside MoCLA in guiding the campaign\'s direction. This ensures it is a joint State-CSO partnership, not just a government initiative.',
        icon: <Award className="h-8 w-8" />,
      },
      {
        number: '02',
        title: 'Financial Backbone',
        description: 'In 2023, LSF directed TZS 3.1 billion to 168 implementing partners (NGOs and paralegal organizations) to execute campaign activities at the grassroots level. This bridges the gap between government planning and village-level delivery.',
        icon: <TrendingUp className="h-8 w-8" />,
      },
      {
        number: '03',
        title: 'Operational Infrastructure',
        description: 'The campaign relies on LSF\'s existing paralegal network of 4,000+ trained community legal workers to conduct legal education, dispute resolution, and case tracking across all 31 regions.',
        icon: <Users className="h-8 w-8" />,
      },
    ],
  },

  // Impact Dashboard
  impact: {
    headline: '2023-2024 Results.',
    stats: [
      { value: 'TZS 3.1B', label: 'Funds Disbursed', description: 'Directed to 168 implementing partners across Tanzania.' },
      { value: '31', label: 'Regions Covered', description: 'All regions of Mainland Tanzania and Zanzibar.' },
      { value: '4,000+', label: 'Paralegals Deployed', description: 'The campaign\'s primary frontline workforce.' },
    ],
    achievement: {
      text: 'The campaign specifically targets Gender-Based Violence (GBV), land disputes (inheritance/matrimonial), and legal education for women and children—aligning with LSF\'s "Access to Justice" and "Legal Empowerment" strategic pillars.',
    },
  },

  // Case Study
  caseStudy: {
    headline: 'National Coordination in Action.',
    quote: 'When government and civil society work together, no citizen is left behind.',
    context: 'The Mama Samia Legal Aid Campaign represents a new model of State-CSO partnership in Tanzania. Named after President Samia Suluhu Hassan, the campaign operationalizes the Legal Aid Act that LSF helped champion.',
    intervention: 'Rather than working in silos, LSF coordinates with MoCLA, the Judiciary, Tanzania Bar Association, and 168 grassroots organizations to deliver unified messaging and services.',
    outcome: 'The result is unprecedented reach: legal awareness campaigns in every region, mobile legal clinics in remote wards, and thousands of cases resolved through Alternative Dispute Resolution at community level.',
    image: '/lovable-uploads/mama samia legal aid campaingn.jpg',
  },

  // Donors/Partners
  donors: [
    { name: 'Government of Tanzania', logo: '/lovable-uploads/tz-coat-of-arms.png', color: '#00A651' },
    { name: 'Ministry of Constitutional and Legal Affairs', logo: '/lovable-uploads/mocla-logo.png', color: '#003399' },
  ],
};

// Climate Justice & Resilience Content (New Gold Standard)
const climateJustice = {
  slug: 'climate-justice',
  title: 'Climate Justice.',
  subtitle: 'Building Resilience for Communities on the Frontlines.',
  heroDescription: 'LSF partners with the World Bank and Rufiji Water Basin Board to empower communities facing climate vulnerability. By integrating legal aid with environmental governance, we are ensuring that those least responsible for climate change—yet most affected—have the legal tools to protect their land, livelihoods, and future.',
  heroImage: '/lovable-uploads/climate-justice-group.jpg', // Updated community image

  // The Challenge Section
  challenge: {
    headline: 'The Climate-Justice Nexus.',
    intro: 'Climate change is not just an environmental issue; it is a legal and human rights crisis. In Tanzania\'s Rufiji Basin, changing weather patterns are fueling conflicts over dwindling resources.',
    points: [
      {
        title: 'Resource Conflict',
        stat: '+40%',
        description: 'Increase in land and water disputes between farmers and pastoralists due to climate stressors.',
        icon: <Scale className="h-6 w-6" />,
      },
      {
        title: 'Vulnerable Exclusions',
        stat: '70%',
        description: 'Of climate-vulnerable populations are women who often lack legal title to the land they farm.',
        icon: <Users className="h-6 w-6" />,
      },
      {
        title: 'Governance Gap',
        stat: 'Weak',
        description: 'Local environmental by-laws are often outdated or not enforced, allowing degradation to continue unchecked.',
        icon: <Quote className="h-6 w-6" />,
      },
    ],
    closing: 'Legal empowerment is the missing link in climate adaptation. We turn victims into advocates.',
  },

  // Methodology Section
  methodology: {
    headline: 'Our Resilience Framework.',
    approaches: [
      {
        number: '01',
        title: 'Grievance Redress Committees',
        description: 'We established and trained 225 leaders in Grievance Redress Committees. These local bodies provide a formal mechanism for communities to resolve environmental disputes and hold authorities accountable without expensive litigation.',
        icon: <Scale className="h-8 w-8" />,
      },
      {
        number: '02',
        title: 'COCOBA Green Groups',
        description: 'We support 30 Active COCOBA (Community Conservation Banks) groups. These groups combine savings and loans with environmental stewardship, funding eco-friendly businesses like beekeeping and tree nurseries.',
        icon: <Target className="h-8 w-8" />,
      },
      {
        number: '03',
        title: 'Participatory Governance',
        description: 'Through our partnership with the Rufiji Water Basin Board, we ensure communities have a seat at the table in water management decisions, translating technical policy into local rights.',
        icon: <Users className="h-8 w-8" />,
      },
    ],
  },

  // Impact Dashboard
  impact: {
    headline: '2024 Impact.',
    stats: [
      { value: '23,000+', label: 'Trees Planted', description: 'Reforestation efforts led by 30 COCOBA groups and community marathons.' },
      { value: '30', label: 'Green Groups', description: 'COCOBA groups actively funding climate-resilient livelihoods.' },
      { value: '225', label: 'Leaders Trained', description: 'Grievance Committee members equipped with legal tools.' },
    ],
    achievement: {
      text: 'Our "Run for Climate Justice" marathon mobilized over 3,000 citizens, directly funding the planting of 10,000 trees in degraded catchment areas.',
    },
  },

  // Case Study
  caseStudy: {
    headline: 'Restoring the Basin.',
    quote: 'We used to fight over water. Now we manage it together.',
    context: 'The Rufiji River Basin is a lifeline for millions, but prolonged droughts turned water access into a flashpoint for conflict.',
    intervention: 'LSF supported the formation of Water User Associations and trained them on the Water Resources Management Act. We empowered women to take leadership roles in these traditionally male-dominated bodies.',
    outcome: 'Optimized water usage plans were developed by the communities themselves. Conflicts dropped significantly, and 23 kilometers of riverbank were reforested to prevent erosion.',
    image: '/lovable-uploads/climate-justice-child.jpg',
  },

  // Donors/Partners
  donors: [
    { name: 'World Bank', logo: '/lovable-uploads/WorldBank_logo.jpg', color: '#002244' },
    { name: 'Rufiji Water Basin Board', logo: '/lovable-uploads/LSF Favicon.png', color: '#00A651' },
  ],
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
        {/* DONOR SECTION */}
        <section className="py-16 bg-white border-t border-neutral-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold">Funded By</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {program.donors.map((d, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center p-4 border border-neutral-100 shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={d.logo}
                      alt={d.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{d.name}</p>
                    <p className="text-sm text-neutral-500">Strategic Partner</p>
                  </div>
                </div>
              ))}
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

  // Mama Samia Legal Aid Campaign - Gold Standard Page
  if (id === 'mama-samia-legal-aid-campaign') {
    const program = mamaSamiaLegalAid;

    return (
      <Layout>
        {/* HERO SECTION - Government Partnership Theme */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: `url("${program.heroImage}")` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-primary/70 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          <div className="container mx-auto px-4 relative z-10 py-32">
            <div className="max-w-4xl">
              <Link to="/programs" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Programs
              </Link>

              <div className="inline-flex items-center gap-3 mb-8 bg-primary rounded-full px-5 py-2">
                <Scale className="h-4 w-4 text-white" />
                <span className="text-white font-bold text-sm uppercase tracking-widest">National Campaign</span>
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
                    See Campaign Impact
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CHALLENGE SECTION */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
                <Target className="h-4 w-4" />
                The Challenge
              </div>
              <Typography variant="h2" className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                {program.challenge.headline}
              </Typography>
              <p className="text-neutral-600 text-lg leading-relaxed">
                {program.challenge.intro}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {program.challenge.points.map((point, idx) => (
                <div key={idx} className="bg-neutral-50 rounded-3xl p-8 text-center border border-neutral-100 hover:shadow-xl transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-6">
                    {point.icon}
                  </div>
                  <p className="text-4xl font-black text-primary mb-2">{point.stat}</p>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{point.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-xl font-semibold text-primary max-w-3xl mx-auto border-l-4 border-primary pl-6 text-left">
              {program.challenge.closing}
            </p>
          </div>
        </section>

        {/* METHODOLOGY SECTION */}
        <section className="py-24 bg-neutral-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Typography variant="h2" className="text-4xl md:text-5xl font-bold mb-4">
                {program.methodology.headline}
              </Typography>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                How LSF drives the Mama Samia Legal Aid Campaign
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {program.methodology.approaches.map((approach, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-black text-primary/50">{approach.number}</span>
                    <div className="text-secondary-yellow">{approach.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{approach.title}</h3>
                  <p className="text-white/80 leading-relaxed">{approach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* IMPACT SECTION */}
        <section className="py-24 bg-gradient-to-br from-primary to-primary-dark text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Typography variant="h2" className="text-4xl md:text-5xl font-bold mb-4">
                {program.impact.headline}
              </Typography>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {program.impact.stats.map((stat, idx) => (
                <div key={idx} className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <p className="text-5xl md:text-6xl font-black mb-2">{stat.value}</p>
                  <p className="text-secondary-yellow font-bold text-lg uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-white/70 text-sm">{stat.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center max-w-4xl mx-auto">
              <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="text-xl leading-relaxed">{program.impact.achievement.text}</p>
            </div>
          </div>
        </section>

        {/* CASE STUDY SECTION */}
        <section className="py-24 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={program.caseStudy.image}
                    alt="MSLAC Campaign"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 bg-primary text-white p-8 rounded-3xl max-w-[280px] shadow-xl">
                  <Quote className="h-8 w-8 mb-3 opacity-50" />
                  <p className="font-bold text-lg leading-snug">"{program.caseStudy.quote}"</p>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
                  <Heart className="h-4 w-4" />
                  Partnership Model
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
                    <h4 className="font-bold text-primary text-lg mb-2">The Coordination</h4>
                    <p className="text-neutral-600 leading-relaxed">{program.caseStudy.intervention}</p>
                  </div>
                  <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-xl">
                    <h4 className="font-bold text-green-700 text-lg mb-2 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      The Result
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
              <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold">Key Partners</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {program.donors.map((d, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center p-4 border border-neutral-100 shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={d.logo}
                      alt={d.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{d.name}</p>
                    <p className="text-sm text-neutral-500">National Partner</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-neutral-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <Typography variant="h3" className="text-3xl md:text-4xl font-bold mb-6">
              Support the Mama Samia Legal Aid Campaign
            </Typography>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
              Partner with LSF to expand this historic State-CSO collaboration and bring legal aid to every corner of Tanzania.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full text-lg">
                  Partner With Us
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/donate">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 font-bold px-10 py-5 rounded-full text-lg">
                  Support This Campaign
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Climate Justice - Gold Standard Page
  if (id === 'climate-justice') {
    const program = climateJustice;

    return (
      <Layout>
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: `url("${program.heroImage}")` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-emerald-900/40 to-black/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          <div className="container mx-auto px-4 relative z-10 py-32">
            <div className="max-w-4xl">
              <Link to="/programs" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Programs
              </Link>

              <div className="inline-flex items-center gap-3 mb-8 bg-emerald-600 rounded-full px-5 py-2">
                <Leaf className="h-4 w-4 text-white" />
                <span className="text-white font-bold text-sm uppercase tracking-widest">Climate Resilience</span>
              </div>

              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-[0.95]">
                {program.title}
              </h1>

              <p className="text-emerald-400 text-xl md:text-2xl lg:text-3xl font-semibold mb-8 max-w-3xl">
                {program.subtitle}
              </p>

              <p className="text-white/90 text-lg md:text-xl max-w-3xl leading-relaxed mb-12">
                {program.heroDescription}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/impact">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-6 text-lg rounded-full shadow-xl">
                    <TrendingUp className="mr-3 h-5 w-5" />
                    See Climate Impact
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CHALLENGE SECTION */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
                <Target className="h-4 w-4" />
                The Challenge
              </div>
              <Typography variant="h2" className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                {program.challenge.headline}
              </Typography>
              <p className="text-neutral-600 text-lg leading-relaxed">
                {program.challenge.intro}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {program.challenge.points.map((point, idx) => (
                <div key={idx} className="bg-neutral-50 rounded-3xl p-8 text-center border border-neutral-100 hover:shadow-xl transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-6">
                    {point.icon}
                  </div>
                  <p className="text-4xl font-black text-primary mb-2">{point.stat}</p>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">{point.title}</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-xl font-semibold text-primary max-w-3xl mx-auto border-l-4 border-primary pl-6 text-left">
              {program.challenge.closing}
            </p>
          </div>
        </section>

        {/* METHODOLOGY SECTION */}
        <section className="py-24 bg-neutral-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Typography variant="h2" className="text-4xl md:text-5xl font-bold mb-4">
                {program.methodology.headline}
              </Typography>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                How LSF builds climate resilience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {program.methodology.approaches.map((approach, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-black text-primary/50">{approach.number}</span>
                    <div className="text-emerald-400">{approach.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{approach.title}</h3>
                  <p className="text-white/80 leading-relaxed">{approach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VISUAL GALLERY - Action on the Ground */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Typography variant="h2" className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900">
                Action on the Ground
              </Typography>
              <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
                Real resilience is built with hands in the soil.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image 1: Planting */}
              <div className="relative group rounded-3xl overflow-hidden shadow-xl aspect-video cursor-pointer">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500 z-10" />
                <img
                  src="/lovable-uploads/climate-justice-planting.jpg"
                  alt="Community Planting"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 z-20 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-white font-bold text-sm">Community Reforestation</p>
                </div>
              </div>

              {/* Image 2: Hands */}
              <div className="relative group rounded-3xl overflow-hidden shadow-xl aspect-video cursor-pointer">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500 z-10" />
                <img
                  src="/lovable-uploads/climate-justice-hands.jpg"
                  alt="Nurturing Growth"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute bottom-4 left-4 z-20 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-white font-bold text-sm">Nurturing Resilience</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IMPACT SECTION */}
        <section className="py-24 bg-gradient-to-br from-emerald-800 to-black text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <Typography variant="h2" className="text-4xl md:text-5xl font-bold mb-4">
                {program.impact.headline}
              </Typography>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {program.impact.stats.map((stat, idx) => (
                <div key={idx} className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <p className="text-5xl md:text-6xl font-black mb-2">{stat.value}</p>
                  <p className="text-emerald-400 font-bold text-lg uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-white/70 text-sm">{stat.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center max-w-4xl mx-auto">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto mb-4" />
              <p className="text-xl leading-relaxed">{program.impact.achievement.text}</p>
            </div>
          </div>
        </section>

        {/* CASE STUDY SECTION */}
        <section className="py-24 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src={program.caseStudy.image}
                    alt="Climate Project"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 bg-emerald-600 text-white p-8 rounded-3xl max-w-[280px] shadow-xl">
                  <Quote className="h-8 w-8 mb-3 opacity-50" />
                  <p className="font-bold text-lg leading-snug">"{program.caseStudy.quote}"</p>
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
                  <Heart className="h-4 w-4" />
                  Community Impact
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
              <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold">Funded By & Partnering With</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {program.donors.map((d, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center p-4 border border-neutral-100 shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={d.logo}
                      alt={d.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{d.name}</p>
                    <p className="text-sm text-neutral-500">Strategic Partner</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-neutral-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <Typography variant="h3" className="text-3xl md:text-4xl font-bold mb-6">
              Support Climate Resilience
            </Typography>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
              Partner with LSF to bring legal empowerment to the frontlines of climate change.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-10 py-5 rounded-full text-lg">
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

        {/* DONOR SECTION */}
        <section className="py-16 bg-white border-t border-neutral-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-neutral-500 text-sm uppercase tracking-widest font-bold">Supported By</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {program.donors.map((d, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-20 h-20 rounded-full bg-neutral-50 flex items-center justify-center p-4 border border-neutral-100 shadow-sm group-hover:shadow-md transition-all">
                    <img
                      src={d.logo}
                      alt={d.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-neutral-900">{d.name}</p>
                    <p className="text-sm text-neutral-500">Implementing Partner</p>
                  </div>
                </div>
              ))}
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
