import Layout from '../components/layout/Layout';
import { ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary pattern-bg text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Story</h1>
            <p className="text-xl opacity-90">
              Learn about the Legal Services Facility, our vision, mission, and the impact we're making in promoting justice for all in Tanzania.
            </p>
          </div>
        </div>
      </section>
      
      {/* Who We Are */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Who We Are</h2>
              <p className="text-neutral-gray mb-4">
                Legal Services Facility (LSF) is a basket fund established in 2011 as a non-profit organization 
                that strives to increase access to justice for all, in particular for women through a legal 
                empowerment approach.
              </p>
              <p className="text-neutral-gray mb-4">
                As an independent basket fund, we work with a wide network of partners to promote legal aid, 
                advocate for policy change, and empower communities to understand and claim their rights.
              </p>
              <p className="text-neutral-gray">
                Our work spans across Tanzania, with a particular focus on serving marginalized and vulnerable 
                communities who face the greatest barriers to accessing justice.
              </p>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="LSF Team" 
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-secondary-teal rounded-lg transform translate-x-4 translate-y-4 -z-0 opacity-50"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Vision and Mission */}
      <section className="py-16 bg-neutral-light" id="mission">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Vision & Mission</h2>
            <p className="max-w-2xl mx-auto text-neutral-gray">
              Our vision and mission guide everything we do in our work to promote justice in Tanzania.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary w-16 h-16 flex items-center justify-center rounded-full mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Our Vision</h3>
              <p className="text-neutral-gray text-center">
                A society where all people, especially the most vulnerable, have equal access to justice and are able to claim and realize their rights.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary w-16 h-16 flex items-center justify-center rounded-full mb-6 mx-auto">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">Our Mission</h3>
              <p className="text-neutral-gray text-center">
                To promote access to justice for all, particularly for women and other vulnerable groups, by strengthening legal aid providers, advocating for legal reforms, and empowering communities through legal awareness.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Strategic Focus Areas */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Strategic Focus Areas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden bg-white shadow-md flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1589578527966-fdac0f44566c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Legal Empowerment" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3">Legal Empowerment</h3>
                <p className="text-neutral-gray mb-4 flex-grow">
                  We strengthen the capacity of legal aid providers, expand paralegal services, and promote legal awareness to empower communities to know, use, and shape the law.
                </p>
                <a 
                  href="/programs/legal-empowerment"
                  className="inline-flex items-center text-primary font-medium hover:underline mt-auto"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden bg-white shadow-md flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573497019949-b08c40365c71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Gender Justice" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3">Gender Justice</h3>
                <p className="text-neutral-gray mb-4 flex-grow">
                  We work to advance women's rights, address gender-based violence, and promote gender equality in both formal and traditional justice systems.
                </p>
                <a 
                  href="/programs/gender-justice"
                  className="inline-flex items-center text-primary font-medium hover:underline mt-auto"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden bg-white shadow-md flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1470058869958-2a77ade41c02?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Climate Justice" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3">Climate Justice</h3>
                <p className="text-neutral-gray mb-4 flex-grow">
                  We support communities affected by climate change to understand and protect their environmental rights and advocate for equitable climate policies.
                </p>
                <a 
                  href="/programs/climate-justice"
                  className="inline-flex items-center text-primary font-medium hover:underline mt-auto"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden bg-white shadow-md flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Digital Transformation" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3">Digital Transformation</h3>
                <p className="text-neutral-gray mb-4 flex-grow">
                  We leverage technology to improve access to justice, develop digital tools for legal aid providers, and enhance remote access to legal information.
                </p>
                <a 
                  href="/programs/digital-transformation"
                  className="inline-flex items-center text-primary font-medium hover:underline mt-auto"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Impact Section (from home page) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-primary mb-2">700,000+</div>
              <p className="text-neutral-gray">People Reached with Legal Services</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-primary mb-2">1,000+</div>
              <p className="text-neutral-gray">Paralegals Trained</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-primary mb-2">150+</div>
              <p className="text-neutral-gray">Legal Aid Organizations Supported</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-primary mb-2">30+</div>
              <p className="text-neutral-gray">Districts Covered</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden bg-white shadow-md flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" 
                  alt="Paralegal Training Initiative" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3">Paralegal Training Initiative</h3>
                <p className="text-neutral-gray mb-4 flex-grow">
                  Building capacity for over 1,000 paralegals to deliver legal aid in rural and urban communities across Tanzania.
                </p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden bg-white shadow-md flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80" 
                  alt="Digital Justice Tools" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3">Digital Justice Tools</h3>
                <p className="text-neutral-gray mb-4 flex-grow">
                  Developing and deploying mobile and web platforms to expand access to legal information and services.
                </p>
              </div>
            </div>
            {/* Add more projects as needed */}
          </div>
        </div>
      </section>
      
      {/* Success Stories Section (from home page) */}
      <section className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col">
              <h3 className="text-xl font-bold mb-3">Empowering Women in Rural Tanzania</h3>
              <p className="text-neutral-gray mb-4 flex-grow">
                Through our Gender Justice program, thousands of women have gained legal knowledge and support to claim their rights to land and property.
              </p>
              <span className="text-primary font-medium">Read More</span>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col">
              <h3 className="text-xl font-bold mb-3">Digital Tools for Justice</h3>
              <p className="text-neutral-gray mb-4 flex-grow">
                Our digital transformation initiatives have connected remote communities to legal aid and information, breaking barriers to justice.
              </p>
              <span className="text-primary font-medium">Read More</span>
            </div>
            {/* Add more stories as needed */}
          </div>
        </div>
      </section>
      
      {/* Core Values */}
      <section className="py-16 bg-secondary-teal text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-white border-opacity-30 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Integrity</h3>
              <p className="opacity-90">
                We uphold the highest standards of honesty, transparency, and ethical conduct in all our work and relationships.
              </p>
            </div>
            
            <div className="p-6 border border-white border-opacity-30 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Inclusivity</h3>
              <p className="opacity-90">
                We respect diversity and ensure that our programs and services are accessible to all, regardless of gender, age, disability, or social status.
              </p>
            </div>
            
            <div className="p-6 border border-white border-opacity-30 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="opacity-90">
                We embrace creative and forward-thinking approaches to addressing challenges in access to justice.
              </p>
            </div>
            
            <div className="p-6 border border-white border-opacity-30 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Collaboration</h3>
              <p className="opacity-90">
                We work in partnership with diverse stakeholders to leverage collective expertise and resources for greater impact.
              </p>
            </div>
            
            <div className="p-6 border border-white border-opacity-30 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Accountability</h3>
              <p className="opacity-90">
                We take responsibility for our actions, decisions, and results, and are committed to learning and improvement.
              </p>
            </div>
            
            <div className="p-6 border border-white border-opacity-30 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Empowerment</h3>
              <p className="opacity-90">
                We believe in strengthening people's capacity to advocate for themselves and participate in decisions that affect their lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section (from home page) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
              <img src="https://images.unsplash.com/photo-1568034428942-20b1614c526b?auto=format&fit=crop&w=120&q=80" alt="Ministry of Foreign Affairs, Denmark" className="h-16 mb-4" />
              <h3 className="text-lg font-bold mb-2">Ministry of Foreign Affairs, Denmark</h3>
              <p className="text-neutral-gray text-center">Primary donor supporting LSF's core programs and organizational development.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
              <img src="https://images.unsplash.com/photo-1487088678257-3a541e6e3922?auto=format&fit=crop&w=120&q=80" alt="European Union" className="h-16 mb-4" />
              <h3 className="text-lg font-bold mb-2">European Union</h3>
              <p className="text-neutral-gray text-center">Supports LSF's work on legal empowerment and access to justice programs.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
              <img src="https://images.unsplash.com/photo-1568600891621-50f697e32f36?auto=format&fit=crop&w=120&q=80" alt="SIDA" className="h-16 mb-4" />
              <h3 className="text-lg font-bold mb-2">SIDA</h3>
              <p className="text-neutral-gray text-center">Partners with LSF on gender justice initiatives and women's rights programming.</p>
            </div>
            {/* Add more partners as needed */}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
