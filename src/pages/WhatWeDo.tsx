
import Layout from '../components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Scale, Users, BookOpen, LayoutGrid, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const WhatWeDo = () => {
  return (
    <Layout>
      <div className="pt-20 bg-neutral-50">
        {/* Hero section */}
        <div className="pattern-bg text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-panton">Our Approach</h1>
              <p className="text-xl md:text-2xl mb-6 text-white/90 font-calibri">
                We empower communities through legal support, advocacy, and capacity building to promote justice and equality for all.
              </p>
            </div>
          </div>
        </div>
        
        {/* Approach Tabs */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="community" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="community" className="font-calibri">Community-Centered</TabsTrigger>
              <TabsTrigger value="rights" className="font-calibri">Rights-Based</TabsTrigger>
              <TabsTrigger value="sustainable" className="font-calibri">Sustainable Impact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="community" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 font-panton">Community-Centered Approach</h3>
                      <p className="text-neutral-dark mb-4 font-calibri">
                        We believe that sustainable change must be driven by communities themselves. Our approach centers on:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 mb-6 font-calibri">
                        <li>Working directly with community paralegals and leaders</li>
                        <li>Building local capacity and knowledge</li>
                        <li>Supporting community-led advocacy initiatives</li>
                        <li>Fostering collaborative decision-making processes</li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <img 
                        src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                        alt="Community meeting" 
                        className="rounded-lg shadow-md w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rights" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 font-panton">Rights-Based Approach</h3>
                      <p className="text-neutral-dark mb-4 font-calibri">
                        We focus on empowering people to understand, use and shape the law to secure their rights:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 mb-6 font-calibri">
                        <li>Legal literacy and awareness campaigns</li>
                        <li>Strategic litigation support on key rights issues</li>
                        <li>Policy advocacy for legal reform</li>
                        <li>Strengthening justice institutions to protect rights</li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <img 
                        src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                        alt="Rights-based advocacy" 
                        className="rounded-lg shadow-md w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sustainable" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold mb-4 font-panton">Sustainable Impact Approach</h3>
                      <p className="text-neutral-dark mb-4 font-calibri">
                        We design interventions that create lasting change through:
                      </p>
                      <ul className="list-disc pl-5 space-y-2 mb-6 font-calibri">
                        <li>Long-term partnerships with communities and institutions</li>
                        <li>Knowledge transfer and capacity building</li>
                        <li>Supporting local ownership of initiatives</li>
                        <li>Robust monitoring and evaluation frameworks</li>
                      </ul>
                    </div>
                    <div className="flex items-center justify-center">
                      <img 
                        src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                        alt="Sustainable development" 
                        className="rounded-lg shadow-md w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Programs Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-panton">Our Programs</h2>
              <p className="max-w-2xl mx-auto text-neutral-gray font-calibri text-lg">
                We work across key focus areas to promote access to justice and empower communities.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {programs.map((program) => (
                <Link 
                  key={program.id}
                  to={`/programs/${program.id}`}
                  className="block group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                    <div className={`h-2 ${program.color}`}></div>
                    <div className="p-6 flex flex-col h-[calc(100%-0.5rem)]">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${program.bgColor}`}>
                        {program.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors font-panton">
                        {program.title}
                      </h3>
                      <p className="text-neutral-dark mb-4 flex-grow font-calibri">{program.description}</p>
                      <div className="inline-flex items-center text-primary font-medium group-hover:underline font-calibri">
                        Learn more
                        <ArrowRight className="ml-1 w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-14 text-center">
              <Link to="/what-we-do">
                <Button className="bg-primary hover:bg-primary-dark text-white font-calibri text-lg px-8 py-6 h-auto">
                  Learn About Our Approach
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Services Section */}
        <div className="py-16 md:py-24 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 font-panton">What We Do</h2>
              <p className="max-w-2xl mx-auto text-neutral-gray font-calibri text-lg">
                Our comprehensive approach to promoting access to justice focuses on these key service areas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="text-primary mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 font-panton">{service.title}</h3>
                  <p className="text-neutral-gray mb-4 font-calibri">{service.description}</p>
                  <Link 
                    to={`/what-we-do#${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center text-primary font-medium hover:underline font-calibri"
                  >
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Program data
const programs = [
  {
    id: "legal-empowerment",
    title: "Accessible Legal Update",
    description: "Increasing accessibility of quality legal aid services to the marginalized communities in particular women.",
    icon: <Scale size={30} className="text-white" />,
    color: "bg-primary",
    bgColor: "bg-primary/5"
  },
  {
    id: "gender-justice",
    title: "Empowered Communities",
    description: "Promoting legally empowered communities, in particular women, through legal awareness and education.",
    icon: <Users size={30} className="text-white" />,
    color: "bg-secondary-teal",
    bgColor: "bg-secondary-teal/5"
  },
  {
    id: "climate-justice",
    title: "Conducive Environment",
    description: "Enhancing a conducive environment for sustainable access to justice and advocating for justice reform.",
    icon: <LayoutGrid size={30} className="text-white" />,
    color: "bg-secondary-orange",
    bgColor: "bg-secondary-orange/5"
  },
  {
    id: "digital-transformation",
    title: "Institutional Sustainability",
    description: "Institutional development and sustainability of LSF and the legal aid sector across Tanzania.",
    icon: <BookOpen size={30} className="text-white" />,
    color: "bg-secondary-green",
    bgColor: "bg-secondary-green/5"
  }
];

// Services data
const services = [
  {
    icon: <Scale className="h-10 w-10" />,
    title: "Grant Making",
    description: "Result-oriented grants aim to facilitate legal empowerment with increased protection of women's rights to land, property, safety and security."
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Capacity Building",
    description: "The LSF supports legal aid providers to build and develop capacities both institutionally and technically, enhancing their ability to deliver services."
  },
  {
    icon: <BookOpen className="h-10 w-10" />,
    title: "Partnerships & Networking",
    description: "LSF works closely with key stakeholders in the country and across the region, including government, developing partners, private sector, and Civil Society."
  },
  {
    icon: <LayoutGrid className="h-10 w-10" />,
    title: "Learning and Research",
    description: "Learning is promoted by rigorously establishing what works and what does not work. We pilot different approaches and systematically monitor our partners."
  },
  {
    icon: <Lightbulb className="h-10 w-10" />,
    title: "Policy and Advocacy",
    description: "We engage extensively in policy and advocacy efforts, spanning from grassroots initiatives to the national stage, ensuring that voices of the marginalized are heard."
  }
];

export default WhatWeDo;
