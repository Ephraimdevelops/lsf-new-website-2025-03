
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface ProgramCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  color: string;
  keyPoints: string[];
}

const ProgramCard = ({ title, description, image, link, color, keyPoints }: ProgramCardProps) => {
  return (
    <div className={`rounded-lg overflow-hidden border border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg bg-white flex flex-col h-full group`}>
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={`absolute bottom-0 left-0 w-full h-1 ${color}`}></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className={`text-2xl font-bold mb-4 group-hover:text-primary transition-colors duration-300`}>{title}</h3>
        <p className="text-neutral-gray mb-6">{description}</p>
        
        <div className="mb-6">
          <h4 className="font-bold mb-2">Key Focus Areas:</h4>
          <ul className="space-y-2">
            {keyPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className={`flex-shrink-0 h-5 w-5 mr-2 text-primary`} />
                <span className="text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Link 
          to={link}
          className={`inline-flex items-center text-primary font-medium mt-auto`}
        >
          Learn More
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const Programs = () => {
  const programs: ProgramCardProps[] = [
    {
      title: "Legal Empowerment",
      description: "Our Legal Empowerment program focuses on enhancing access to justice through community-based legal aid providers and paralegals. We build capacity among local organizations to provide quality legal services.",
      image: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      link: "/programs/legal-empowerment",
      color: "bg-primary",
      keyPoints: [
        "Strengthening paralegal networks",
        "Supporting legal aid organizations",
        "Promoting legal awareness",
        "Strategic litigation support",
        "Advocating for legal reforms"
      ]
    },
    {
      title: "Gender Justice",
      description: "Our Gender Justice program is dedicated to advancing women's rights and addressing gender-based violence and discrimination. We support initiatives that promote gender equality and empower women.",
      image: "https://images.unsplash.com/photo-1573497019949-b08c40365c71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      link: "/programs/gender-justice",
      color: "bg-secondary-green",
      keyPoints: [
        "Combating gender-based violence",
        "Advancing women's property rights",
        "Improving gender-responsive services",
        "Enhancing women's leadership",
        "Addressing harmful practices"
      ]
    },
    {
      title: "Climate Justice",
      description: "Our Climate Justice program supports communities affected by climate change and promotes environmental rights. We ensure communities have legal tools to protect their resources in the face of environmental challenges.",
      image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      link: "/programs/climate-justice",
      color: "bg-secondary-teal",
      keyPoints: [
        "Supporting climate-affected communities",
        "Environmental rights awareness",
        "Land and resource rights protection",
        "Climate policy advocacy",
        "Community resilience building"
      ]
    },
    {
      title: "Digital Transformation",
      description: "Our Digital Transformation program leverages technology to improve access to justice and legal information. We develop digital tools that make legal services more accessible to rural and marginalized communities.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      link: "/programs/digital-transformation",
      color: "bg-secondary-orange",
      keyPoints: [
        "Digital legal aid tools",
        "Remote case management systems",
        "Digital literacy for paralegals",
        "Online legal information platforms",
        "Legal data collection and analysis"
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary pattern-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
            <p className="text-xl opacity-90">
              We work across four strategic focus areas to promote justice for all in Tanzania, with a particular focus on women and vulnerable groups.
            </p>
          </div>
        </div>
      </section>
      
      {/* Programs Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Strategic Focus Areas</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">
              LSF's work spans four interconnected focus areas that together address the most pressing access to justice challenges in Tanzania.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <ProgramCard
                key={index}
                title={program.title}
                description={program.description}
                image={program.image}
                link={program.link}
                color={program.color}
                keyPoints={program.keyPoints}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Approach */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
            <p className="text-neutral-gray max-w-2xl mx-auto">
              Our programmatic approach is guided by core principles that ensure our work is effective, sustainable, and responsive to community needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Community-Centered</h3>
              <p className="text-neutral-gray">
                We place communities at the center of our work, ensuring their active participation in designing and implementing solutions that address their justice needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Rights-Based</h3>
              <p className="text-neutral-gray">
                We apply a rights-based approach that recognizes people as rights-holders and empowers them to know, use, and shape the law to claim their rights and seek remedies.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Transformative</h3>
              <p className="text-neutral-gray">
                We aim for transformative change that addresses root causes of injustice and builds sustainable systems that continue to deliver justice beyond our interventions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Inclusive</h3>
              <p className="text-neutral-gray">
                We ensure that our programs are inclusive and accessible to all, with special attention to the needs of women, children, people with disabilities, and other marginalized groups.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-3-3h-2a3 3 0 00-3 3v2h-7m-10 0h5v-2a3 3 0 00-3-3H7a3 3 0 00-3 3v2zM7 10a5 5 0 1110 0M7 10a5 5 0 0110 0" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Collaborative</h3>
              <p className="text-neutral-gray">
                We foster collaboration among diverse stakeholders, including government, civil society, communities, and international partners to leverage collective expertise and resources.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Innovative</h3>
              <p className="text-neutral-gray">
                We embrace innovation and new approaches, particularly through digital transformation, to overcome barriers to justice and improve the efficiency and reach of legal services.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Program Impact */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
              <p className="text-neutral-gray mb-6">
                Since our establishment in 2011, LSF has made significant contributions to improving access to justice in Tanzania. Our programs have:
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 mr-3 text-primary" />
                  <div>
                    <h4 className="font-bold">Extended Legal Aid Services</h4>
                    <p className="text-sm text-neutral-gray">Supported a network of over 150 legal aid organizations and 1,000+ paralegals across all regions of Tanzania</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 mr-3 text-primary" />
                  <div>
                    <h4 className="font-bold">Improved Policy and Legal Frameworks</h4>
                    <p className="text-sm text-neutral-gray">Contributed to the development and implementation of the Legal Aid Act and other key legal reforms</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 mr-3 text-primary" />
                  <div>
                    <h4 className="font-bold">Empowered Women and Girls</h4>
                    <p className="text-sm text-neutral-gray">Helped over 300,000 women secure their rights to land, property, and freedom from violence</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <CheckCircle className="flex-shrink-0 h-6 w-6 mr-3 text-primary" />
                  <div>
                    <h4 className="font-bold">Pioneered Digital Solutions</h4>
                    <p className="text-sm text-neutral-gray">Developed innovative digital platforms that have extended legal services to remote areas</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8">
                <Link 
                  to="/about#impact" 
                  className="bg-primary text-white hover:bg-primary/90 px-6 py-3 rounded-md font-bold transition-colors duration-300 inline-flex items-center"
                >
                  Learn More About Our Impact
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">150+</div>
                  <p className="text-neutral-gray">Legal Aid Organizations Supported</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">1,000+</div>
                  <p className="text-neutral-gray">Paralegals Trained</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">700,000+</div>
                  <p className="text-neutral-gray">People Reached with Legal Services</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="text-4xl font-bold text-primary mb-2">30+</div>
                  <p className="text-neutral-gray">Districts Covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Partner with Us</h2>
            <p className="opacity-90 mb-8">
              We welcome partnerships with organizations and individuals who share our commitment to 
              promoting access to justice for all in Tanzania. Together, we can create positive change.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/contact" 
                className="bg-white text-primary hover:bg-neutral-100 px-8 py-3 rounded-md font-bold transition duration-300"
              >
                Contact Us
              </Link>
              <Link 
                to="/donate" 
                className="bg-secondary-orange hover:bg-opacity-90 text-white px-8 py-3 rounded-md font-bold transition duration-300"
              >
                Support Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Programs;
