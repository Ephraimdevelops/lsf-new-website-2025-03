
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowRight, Award, Users, Globe, Landmark, ArrowDownRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About LSF</h1>
            <p className="text-xl opacity-90">
              Learn about our mission to increase access to justice for all, in particular for women, through a legal empowerment approach across Tanzania
            </p>
          </div>
        </div>
      </section>
      
      {/* Vision & Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-lg text-neutral-dark">
                A society that is just, equal, accountable and respects the dignity and rights of all people, particularly women.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-secondary-teal"></div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-neutral-dark">
                To provide financial and technical support to civil society organizations in Tanzania towards increasing access to justice for all, in particular for women through legal empowerment.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-primary text-white text-sm font-medium px-4 py-2 rounded-full mb-4">
                Our Story
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Established in 2011 to Advance Access to Justice
              </h2>
              <p className="text-lg mb-6 text-neutral-dark">
                The Legal Services Facility (LSF) was established in 2011 as a non-profit organization to increase access to justice for all, particularly women, through a legal empowerment approach.
              </p>
              <p className="text-lg mb-6 text-neutral-dark">
                As a basket fund, LSF provides financial and technical support to organizations that offer basic legal aid services, with a special focus on women. Our approach centers on enabling marginalized communities to use the law to find concrete solutions to their justice problems.
              </p>
              <p className="text-lg mb-10 text-neutral-dark">
                Since our founding, LSF has supported over 180 legal aid providers across all 184 districts of Tanzania, reaching more than 39.8 million people through legal education and providing direct legal aid services to over 426,349 beneficiaries.
              </p>
              
              <Link to="/team">
                <Button className="flex items-center gap-2">
                  Meet Our Team
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                alt="LSF Team" 
                className="rounded-lg shadow-md h-full object-cover"
              />
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Community Workshop" 
                  className="rounded-lg shadow-md h-[calc(50%-0.5rem)] object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                  alt="Legal Aid" 
                  className="rounded-lg shadow-md h-[calc(50%-0.5rem)] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Core Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-4">
              Our Core Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              The Principles That Guide Our Work
            </h2>
            <p className="text-lg text-neutral-dark">
              At LSF, our work is guided by a set of core values that define our approach to increasing access to justice for all Tanzanians
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full inline-flex mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-neutral-dark">
                We are committed to the highest standards of honesty, transparency, and ethical behavior in all our work.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-teal/10 p-3 rounded-full inline-flex mb-4">
                <Users className="h-6 w-6 text-secondary-teal" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inclusion</h3>
              <p className="text-neutral-dark">
                We believe in equal rights and opportunities for all, particularly focusing on marginalized groups and women.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-orange/10 p-3 rounded-full inline-flex mb-4">
                <Landmark className="h-6 w-6 text-secondary-orange" />
              </div>
              <h3 className="text-xl font-bold mb-2">Accountability</h3>
              <p className="text-neutral-dark">
                We take responsibility for our actions and decisions, and maintain transparent processes in all our operations.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
              <div className="bg-secondary-yellow/10 p-3 rounded-full inline-flex mb-4">
                <Globe className="h-6 w-6 text-secondary-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-neutral-dark">
                We embrace creative approaches and innovative solutions to overcome barriers to justice.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Strategic Objectives Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-block bg-primary text-white text-sm font-medium px-4 py-2 rounded-full mb-4">
              Our Strategic Objectives
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Driving Meaningful Change
            </h2>
            <p className="text-lg text-neutral-dark">
              Our work is guided by four key strategic objectives that shape our programs and initiatives
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-6">
                <div className="bg-primary/10 p-4 rounded-full h-16 w-16 flex items-center justify-center flex-shrink-0">
                  <ArrowDownRight className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Legal Aid Services</h3>
                  <p className="text-lg text-neutral-dark mb-2">
                    Increase accessibility and quality of legal aid services to the marginalized communities, particularly women.
                  </p>
                  <ul className="space-y-2 text-neutral-dark">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Supporting 180+ legal aid organizations across Tanzania</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Training paralegals to provide quality legal aid services</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-6">
                <div className="bg-secondary-teal/10 p-4 rounded-full h-16 w-16 flex items-center justify-center flex-shrink-0">
                  <ArrowDownRight className="h-8 w-8 text-secondary-teal" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Legal Education</h3>
                  <p className="text-lg text-neutral-dark mb-2">
                    Promote legally empowered communities through legal awareness and education.
                  </p>
                  <ul className="space-y-2 text-neutral-dark">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-secondary-teal mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Conducting community legal literacy programs</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-secondary-teal mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Developing simplified legal information materials</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-6">
                <div className="bg-secondary-orange/10 p-4 rounded-full h-16 w-16 flex items-center justify-center flex-shrink-0">
                  <ArrowDownRight className="h-8 w-8 text-secondary-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Conducive Environment</h3>
                  <p className="text-lg text-neutral-dark mb-2">
                    Enhance a conducive environment for sustainable access to justice.
                  </p>
                  <ul className="space-y-2 text-neutral-dark">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-secondary-orange mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Advocating for policy and legal reforms</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-secondary-orange mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Promoting collaboration among justice sector stakeholders</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-6">
                <div className="bg-secondary-yellow/10 p-4 rounded-full h-16 w-16 flex items-center justify-center flex-shrink-0">
                  <ArrowDownRight className="h-8 w-8 text-secondary-yellow" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Institutional Sustainability</h3>
                  <p className="text-lg text-neutral-dark mb-2">
                    Strengthen institutional capacity and sustainability of LSF and the legal aid sector.
                  </p>
                  <ul className="space-y-2 text-neutral-dark">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-secondary-yellow mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Building organizational capacity of legal aid providers</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-secondary-yellow mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Enhancing resource mobilization and sustainability strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us in Our Mission</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Together, we can build a more just society where everyone has access to justice. Support our work through donations, partnerships, or by spreading awareness.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/donate">
              <Button variant="secondary" size="lg">Make a Donation</Button>
            </Link>
            <Link to="/partners">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Become a Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
