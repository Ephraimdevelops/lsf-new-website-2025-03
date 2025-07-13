import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const partners = [
  {
    name: 'United States Agency for International Development',
    logo: '/lovable-uploads/e8daf61f-bec3-4182-b37c-69a73a839f6b.png',
    type: 'Development Partner',
    description: 'Supporting legal empowerment and governance initiatives across Tanzania.'
  },
  {
    name: 'European Union',
    logo: '/lovable-uploads/62202731-0156-45e1-9dea-8fe1ad1618aa.png',
    type: 'Funding Partner',
    description: 'Investing in human rights and access to justice programs.'
  },
  {
    name: 'Legal and Human Rights Centre',
    logo: '/lovable-uploads/7718b32e-3138-4e78-a7a1-4d63935a2951.png',
    type: 'Implementation Partner',
    description: 'Collaborating on legal aid delivery and advocacy initiatives.'
  },
  {
    name: 'Tanzania Law Society',
    logo: '/lovable-uploads/64c7c47e-f951-498d-bbf0-2c6602d2bd95.png',
    type: 'Professional Partner',
    description: 'Supporting professional development and legal standards.'
  },
  {
    name: 'UN Women Tanzania',
    logo: '/lovable-uploads/cbf914e5-d076-4c31-9e29-dacc8069c97a.png',
    type: 'UN Agency',
    description: 'Advancing gender equality and women\'s empowerment through legal aid.'
  },
  {
    name: 'World Bank',
    logo: '/lovable-uploads/e1ab15b7-1be8-4b43-a3c3-0e4c6b7a0c02.png',
    type: 'Financial Partner',
    description: 'Supporting systemic improvements in governance and justice delivery.'
  }
];

const partnerTypes = [
  { type: 'Development Partners', count: 8, color: 'bg-primary/10 text-primary' },
  { type: 'Government Agencies', count: 12, color: 'bg-secondary-teal/10 text-secondary-teal' },
  { type: 'Civil Society', count: 15, color: 'bg-secondary-green/10 text-secondary-green' },
  { type: 'International Organizations', count: 6, color: 'bg-secondary-orange/10 text-secondary-orange' }
];

const PartnersSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-primary/10 rounded-full px-6 py-3 mb-6">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Our Network
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-light mb-4 text-foreground">
            Strategic <span className="text-primary font-medium">Partnerships</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We collaborate with leading organizations across sectors to amplify our impact 
            and create sustainable change in Tanzania's justice system.
          </p>
        </div>

        {/* Partner Types Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partnerTypes.map((partnerType, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${partnerType.color} mb-4`}>
                  <span className="text-xl font-bold">{partnerType.count}</span>
                </div>
                <h3 className="font-medium text-foreground mb-1">
                  {partnerType.type}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Active partnerships
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Partners */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {partners.map((partner, index) => (
            <Card key={index} className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-muted/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      src={partner.logo} 
                      alt={partner.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-primary font-medium mb-1 uppercase tracking-wider">
                      {partner.type}
                    </div>
                    <h3 className="font-medium text-foreground mb-2 leading-tight">
                      {partner.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {partner.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partnership Benefits */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl lg:text-3xl font-light mb-6 text-foreground">
              Why Partner <span className="text-primary font-medium">With Us?</span>
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Proven Impact</h4>
                  <p className="text-muted-foreground">15+ years of successful program delivery with measurable outcomes and sustainable community change.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">National Reach</h4>
                  <p className="text-muted-foreground">Established presence in all 31 regions of Tanzania with deep community relationships and local expertise.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-primary font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Innovation Leadership</h4>
                  <p className="text-muted-foreground">Pioneering digital solutions and evidence-based approaches that set new standards in the sector.</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-muted/30 to-primary/5">
            <CardContent className="p-8">
              <h4 className="text-xl font-medium mb-4 text-foreground">
                Partnership Opportunities
              </h4>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Program Implementation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Research & Advocacy
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Capacity Building
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Technology Development
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  Policy Development
                </li>
              </ul>
              <Button className="w-full group">
                <Link to="/partners" className="flex items-center">
                  Explore Partnerships
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors">
            <CardContent className="p-12">
              <h3 className="text-2xl font-light mb-4 text-foreground">
                Ready to Make a Difference Together?
              </h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our network of partners working to transform access to justice in Tanzania. 
                Let's explore how we can collaborate to create lasting impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/contact">Start a Conversation</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/partners">View All Partners</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;