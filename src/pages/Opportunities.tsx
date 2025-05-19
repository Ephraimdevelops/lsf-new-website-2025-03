
import { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ArrowRight } from 'lucide-react';
import { Link } from "react-router-dom";

const Opportunities = () => {
  const [category, setCategory] = useState<string>("all");
  
  const filterOpportunities = (opportunities: any[], type: string) => {
    if (category === "all") return opportunities;
    return opportunities.filter(opportunity => opportunity.category === category);
  };
  
  return (
    <Layout>
      <div className="pt-20 bg-neutral-light">
        {/* Hero section */}
        <div className="bg-primary pattern-bg text-white py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-panton">Opportunities</h1>
              <p className="text-xl md:text-2xl mb-6 text-white/90 font-calibri">
                Explore our latest job openings, grants, and tender opportunities to join our mission for justice.
              </p>
            </div>
          </div>
        </div>
        
        {/* Opportunities Tabs */}
        <div className="container mx-auto px-4 py-12">
          <Tabs defaultValue="jobs" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="jobs" className="font-calibri">Job Openings</TabsTrigger>
              <TabsTrigger value="grants" className="font-calibri">Grants</TabsTrigger>
              <TabsTrigger value="tenders" className="font-calibri">Tenders</TabsTrigger>
            </TabsList>
            
            {/* Jobs Tab */}
            <TabsContent value="jobs">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <h2 className="text-2xl font-bold font-panton">Job Openings</h2>
                  <span className="bg-primary text-white text-sm rounded-full px-3 py-1">{jobs.length}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button 
                    variant={category === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory("all")}
                    className="font-calibri"
                  >
                    All
                  </Button>
                  <Button 
                    variant={category === "full-time" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory("full-time")}
                    className="font-calibri"
                  >
                    Full-time
                  </Button>
                  <Button 
                    variant={category === "part-time" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory("part-time")}
                    className="font-calibri"
                  >
                    Part-time
                  </Button>
                  <Button 
                    variant={category === "consultant" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategory("consultant")}
                    className="font-calibri"
                  >
                    Consultant
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {filterOpportunities(jobs, "jobs").map((job, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={`${
                          job.category === 'full-time' ? 'bg-primary' : 
                          job.category === 'part-time' ? 'bg-secondary-green' : 
                          'bg-secondary-teal'
                        }`}>
                          {job.category === 'full-time' ? 'Full-time' : 
                           job.category === 'part-time' ? 'Part-time' : 'Consultant'}
                        </Badge>
                        <div className="flex items-center text-neutral-gray text-sm font-calibri">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          <span>Deadline: {job.deadline}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-2 font-panton">{job.title}</h3>
                      <p className="text-neutral-gray mb-4 font-calibri">{job.description}</p>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="mb-3 md:mb-0">
                          <span className="text-sm text-neutral-dark font-bold font-calibri">Location: </span>
                          <span className="text-sm text-neutral-gray font-calibri">{job.location}</span>
                        </div>
                        <Button variant="outline" size="sm" className="font-calibri">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Grants Tab */}
            <TabsContent value="grants">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-6">
                  <h2 className="text-2xl font-bold font-panton">Grant Opportunities</h2>
                  <span className="bg-secondary-green text-white text-sm rounded-full px-3 py-1">{grants.length}</span>
                </div>
              </div>
              
              <div className="space-y-6">
                {grants.map((grant, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="md:flex md:justify-between">
                        <div className="md:w-2/3 md:pr-6">
                          <div className="flex justify-between items-start mb-3">
                            <Badge className="bg-secondary-green">{grant.type}</Badge>
                            <div className="flex items-center text-neutral-gray text-sm font-calibri">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              <span>Deadline: {grant.deadline}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2 font-panton">{grant.title}</h3>
                          <p className="text-neutral-gray mb-4 font-calibri">{grant.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-neutral-dark font-bold block font-calibri">Grant Amount:</span>
                              <span className="text-neutral-gray font-calibri">{grant.amount}</span>
                            </div>
                            <div>
                              <span className="text-sm text-neutral-dark font-bold block font-calibri">Duration:</span>
                              <span className="text-neutral-gray font-calibri">{grant.duration}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 md:mt-0 md:w-1/3 flex md:flex-col md:items-end">
                          <div className="bg-neutral-light rounded-lg p-4 w-full">
                            <h4 className="font-bold mb-2 font-panton">Eligibility</h4>
                            <ul className="list-disc pl-5 text-sm space-y-1 font-calibri">
                              {grant.eligibility.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-gray-50 flex justify-end">
                      <Button className="font-calibri">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Tenders Tab */}
            <TabsContent value="tenders">
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-6">
                  <h2 className="text-2xl font-bold font-panton">Open Tenders</h2>
                  <span className="bg-secondary-orange text-white text-sm rounded-full px-3 py-1">{tenders.length}</span>
                </div>
                <p className="text-neutral-gray mb-6 font-calibri">
                  Browse our current procurement opportunities. We are committed to fair, transparent and competitive procurement processes.
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="py-3 px-4 font-panton">Tender ID</th>
                      <th className="py-3 px-4 font-panton">Title</th>
                      <th className="py-3 px-4 font-panton">Category</th>
                      <th className="py-3 px-4 font-panton">Issue Date</th>
                      <th className="py-3 px-4 font-panton">Closing Date</th>
                      <th className="py-3 px-4 font-panton">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenders.map((tender, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-4 px-4 font-calibri">{tender.id}</td>
                        <td className="py-4 px-4 font-bold font-calibri">{tender.title}</td>
                        <td className="py-4 px-4 font-calibri">
                          <Badge className={`${
                            tender.category === 'services' ? 'bg-primary' : 
                            tender.category === 'goods' ? 'bg-secondary-green' : 
                            'bg-secondary-teal'
                          }`}>
                            {tender.category === 'services' ? 'Services' : 
                            tender.category === 'goods' ? 'Goods' : 'Consultancy'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 font-calibri">{tender.issueDate}</td>
                        <td className="py-4 px-4 font-calibri">{tender.closingDate}</td>
                        <td className="py-4 px-4">
                          <Button variant="outline" size="sm" className="font-calibri">
                            Download RFP
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

// Sample data
const jobs = [
  {
    title: "Program Manager - Gender Justice",
    category: "full-time",
    description: "Lead and oversee our Gender Justice program, coordinating with partners and stakeholders to implement activities that advance women's rights.",
    location: "Dar es Salaam",
    deadline: "June 15, 2025"
  },
  {
    title: "Legal Empowerment Officer",
    category: "full-time",
    description: "Support community paralegals and legal aid providers in delivering services to marginalized communities across Tanzania.",
    location: "Dodoma",
    deadline: "June 20, 2025"
  },
  {
    title: "Digital Transformation Specialist",
    category: "consultant",
    description: "Provide technical expertise to develop and implement digital solutions that enhance access to justice and legal information.",
    location: "Remote",
    deadline: "May 30, 2025"
  },
  {
    title: "Monitoring & Evaluation Officer",
    category: "full-time",
    description: "Design and implement M&E frameworks to track program outcomes and impact across all LSF activities.",
    location: "Dar es Salaam",
    deadline: "June 10, 2025"
  },
  {
    title: "Communications Assistant",
    category: "part-time",
    description: "Support the communications team in creating content, managing social media, and documenting program activities and impact stories.",
    location: "Dar es Salaam",
    deadline: "May 25, 2025"
  }
];

const grants = [
  {
    title: "Community Legal Empowerment Initiative",
    type: "Program Grant",
    description: "Funding for organizations implementing community-based legal aid and empowerment activities in underserved regions.",
    amount: "$10,000 - $50,000",
    duration: "12-24 months",
    deadline: "July 15, 2025",
    eligibility: [
      "Registered NGOs with min. 3 years experience",
      "Focus on legal empowerment",
      "Operating in target regions",
      "Strong community engagement"
    ]
  },
  {
    title: "Digital Justice Innovation Fund",
    type: "Innovation Grant",
    description: "Support for innovative tech-based solutions that improve access to justice and legal information for marginalized communities.",
    amount: "$5,000 - $25,000",
    duration: "6-12 months",
    deadline: "June 30, 2025",
    eligibility: [
      "Tech-focused organizations or startups",
      "Solution addresses clear justice gap",
      "Scalable model",
      "Co-funding preferred"
    ]
  },
  {
    title: "Women's Rights Advocacy Grant",
    type: "Advocacy Grant",
    description: "Funding for advocacy initiatives focused on women's legal rights, including land rights, inheritance, and gender-based violence.",
    amount: "$15,000 - $40,000",
    duration: "12-18 months",
    deadline: "July 30, 2025",
    eligibility: [
      "Women-led organizations preferred",
      "Clear advocacy strategy",
      "Experience in women's rights",
      "Strong networks with target communities"
    ]
  }
];

const tenders = [
  {
    id: "LSF-T-2025-001",
    title: "Baseline Survey for Climate Justice Program",
    category: "services",
    issueDate: "May 10, 2025",
    closingDate: "June 5, 2025"
  },
  {
    id: "LSF-T-2025-002",
    title: "Supply of Office Equipment",
    category: "goods",
    issueDate: "May 12, 2025",
    closingDate: "June 10, 2025"
  },
  {
    id: "LSF-T-2025-003",
    title: "Legal Information Database Development",
    category: "consultancy",
    issueDate: "May 15, 2025",
    closingDate: "June 15, 2025"
  },
  {
    id: "LSF-T-2025-004",
    title: "Training Services for Community Paralegals",
    category: "services",
    issueDate: "May 18, 2025",
    closingDate: "June 18, 2025"
  }
];

export default Opportunities;
