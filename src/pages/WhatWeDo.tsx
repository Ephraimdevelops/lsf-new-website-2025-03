
import Layout from '../components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const WhatWeDo = () => {
  return (
    <Layout>
      <div className="pt-20 bg-neutral-light">
        {/* Hero section */}
        <div className="bg-primary pattern-bg text-white py-16 md:py-24">
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
                        <li>Support for strategic litigation on key rights issues</li>
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
              <h2 className="text-3xl font-bold mb-4 font-panton">Our Programs</h2>
              <p className="max-w-2xl mx-auto text-neutral-gray font-calibri">
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
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${program.color} bg-opacity-10`}>
                        {program.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-3 font-panton">{program.title}</h3>
                      <p className="text-neutral-gray mb-4 flex-grow font-calibri">{program.description}</p>
                      <div className="inline-flex items-center text-primary font-medium group-hover:underline font-calibri">
                        Learn more
                        <ArrowRight className="ml-1 w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
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
    title: "Legal Empowerment",
    description: "Building knowledge and capacity of communities to understand and use the law to seek justice.",
    icon: <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    color: "bg-primary",
  },
  {
    id: "gender-justice",
    title: "Gender Justice",
    description: "Promoting women's rights and gender equality through targeted legal and social interventions.",
    icon: <svg className="w-6 h-6 text-secondary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    color: "bg-secondary-green",
  },
  {
    id: "climate-justice",
    title: "Climate Justice",
    description: "Supporting communities affected by climate change and promoting environmental rights.",
    icon: <svg className="w-6 h-6 text-secondary-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    color: "bg-secondary-teal",
  },
  {
    id: "digital-transformation",
    title: "Digital Transformation",
    description: "Leveraging technology to improve access to justice and legal information.",
    icon: <svg className="w-6 h-6 text-secondary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    color: "bg-secondary-orange",
  },
];

export default WhatWeDo;
