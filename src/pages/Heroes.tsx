
import Layout from '../components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const Heroes = () => {
  return (
    <Layout>
      <div className="pt-20 bg-neutral-light">
        {/* Hero section */}
        <div className="bg-primary pattern-bg text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-panton">Our Heroes</h1>
              <p className="text-xl md:text-2xl mb-6 text-white/90 font-calibri">
                Meet the people whose lives have been transformed through our programs and who continue to inspire our work.
              </p>
            </div>
          </div>
        </div>
        
        {/* Testimonial Tabs */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="communities" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="communities" className="font-calibri">Communities</TabsTrigger>
              <TabsTrigger value="individuals" className="font-calibri">Individuals</TabsTrigger>
              <TabsTrigger value="partners" className="font-calibri">Partners</TabsTrigger>
            </TabsList>
            
            <TabsContent value="communities" className="space-y-8">
              {communityTestimonials.map((testimonial, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="md:flex">
                      <div className="md:w-2/5">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.community} 
                          className="w-full h-64 md:h-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-3/5">
                        <Badge className="mb-2 bg-primary">{testimonial.program}</Badge>
                        <h3 className="text-2xl font-bold mb-2 font-panton">{testimonial.community}</h3>
                        <p className="text-neutral-gray mb-4 font-calibri">
                          <em>"{testimonial.quote}"</em>
                        </p>
                        <p className="text-neutral-dark font-calibri">{testimonial.impact}</p>
                        <div className="mt-4 font-calibri">
                          <span className="text-sm text-neutral-gray">— {testimonial.representative}, {testimonial.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            
            <TabsContent value="individuals" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {individualTestimonials.map((testimonial, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col h-full">
                        <div className="h-64 overflow-hidden">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6 flex-grow">
                          <Badge className="mb-2 bg-secondary-green">{testimonial.program}</Badge>
                          <h3 className="text-xl font-bold mb-2 font-panton">{testimonial.name}</h3>
                          <p className="text-neutral-gray mb-4 font-calibri">
                            <em>"{testimonial.quote}"</em>
                          </p>
                          <div className="mt-4 font-calibri">
                            <span className="text-sm text-neutral-gray">— {testimonial.location}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="partners" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {partnerTestimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <img 
                          src={testimonial.logo} 
                          alt={testimonial.organization} 
                          className="h-16 object-contain"
                        />
                      </div>
                      <p className="text-neutral-gray mb-4 font-calibri">
                        <em>"{testimonial.quote}"</em>
                      </p>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <img 
                            src={testimonial.representative.image} 
                            alt={testimonial.representative.name} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold font-panton">{testimonial.representative.name}</h4>
                          <p className="text-sm text-neutral-gray font-calibri">{testimonial.representative.title}, {testimonial.organization}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

// Sample data - in a real app, this would come from an API
const communityTestimonials = [
  {
    community: "Mwanza Women's Collective",
    representative: "Maria Sanga",
    location: "Mwanza, Tanzania",
    program: "Gender Justice",
    quote: "The legal empowerment program has transformed how our community addresses gender-based violence. We now have the knowledge and tools to support survivors and hold perpetrators accountable.",
    impact: "Since partnering with LSF, reported cases of domestic violence have decreased by 30%, and more women are participating in local governance structures.",
    image: "https://images.unsplash.com/photo-1532635241-17e820acc59f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    community: "Coastal Environmental Conservation Group",
    representative: "James Mbwana",
    location: "Dar es Salaam, Tanzania",
    program: "Climate Justice",
    quote: "With LSF's support, our community successfully challenged illegal logging operations that were destroying our forests and threatening our livelihoods.",
    impact: "We've established community-managed conservation areas covering over 5,000 hectares and developed sustainable income-generating activities for local families.",
    image: "https://images.unsplash.com/photo-1469125155630-7ed37e065743?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

const individualTestimonials = [
  {
    name: "Grace Mwakipesile",
    location: "Dodoma, Tanzania",
    program: "Legal Empowerment",
    quote: "When I was wrongfully evicted from my land, I thought there was nothing I could do. The community paralegal trained by LSF helped me understand my rights and guided me through the process of reclaiming my property.",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Samuel Kioko",
    location: "Arusha, Tanzania",
    program: "Digital Transformation",
    quote: "The mobile legal aid clinic reached our remote village and provided crucial services. I was able to obtain legal advice through their digital platform that would have otherwise required traveling hundreds of kilometers.",
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Fatima Hussein",
    location: "Tabora, Tanzania",
    program: "Gender Justice",
    quote: "After attending the women's rights workshop, I understood that I had a right to inherit family property. The legal support from LSF helped me secure my inheritance and provide for my children.",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Joseph Mwandila",
    location: "Kigoma, Tanzania",
    program: "Climate Justice",
    quote: "When pollution from a nearby factory contaminated our water source, we didn't know how to respond. The environmental rights training gave us the tools to document the issue and advocate for remediation.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
  }
];

const partnerTestimonials = [
  {
    organization: "Ministry of Justice",
    logo: "https://images.unsplash.com/photo-1569937756447-1d44f657dc69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    quote: "LSF has been an invaluable partner in extending legal services to underserved communities. Their innovative approaches have complemented government efforts to expand access to justice.",
    representative: {
      name: "Hon. Mary Mulongo",
      title: "Director of Legal Aid",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    organization: "Community Legal Empowerment Network",
    logo: "https://images.unsplash.com/photo-1560264280-88b68371db39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    quote: "Our collaboration with LSF has exponentially increased our reach and impact. Together, we've trained over 500 community paralegals who are now serving their communities.",
    representative: {
      name: "Daniel Masawe",
      title: "Executive Director",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  },
  {
    organization: "Women's Rights Association",
    logo: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    quote: "LSF's gender justice program has been transformative for women in rural communities, providing them with the knowledge and support to assert their rights.",
    representative: {
      name: "Sarah Kimaro",
      title: "Program Manager",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
    }
  }
];

export default Heroes;
