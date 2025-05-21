
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowLeft, Download, Share, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { publicationService } from '@/services/api';

// Mock publication data - this would normally come from an API
const mockPublications = [
  {
    id: "annual-report-2024",
    title: "Annual Report 2024: 26,000+ Disputes Resolved Through Legal Aid",
    type: "Report",
    date: "April 2024",
    downloadUrl: "/publications/annual-report-2024.pdf",
    coverImage: "https://images.unsplash.com/photo-1544115559-6731bccacc70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "This comprehensive annual report details LSF's impact across Tanzania in 2024, highlighting our work in legal aid provision, gender justice initiatives, and digital transformation projects. Key achievements include resolving over 26,000 legal disputes through our paralegal network and reaching 7 million Tanzanians with legal education programs.",
    authors: ["LSF Research Team"],
    tags: ["Annual Report", "Impact", "Legal Aid"]
  },
  {
    id: "womens-land-rights-climate",
    title: "Women's Land Rights in Tanzania: Climate Justice Perspective",
    type: "Research",
    date: "March 2024",
    downloadUrl: "/publications/womens-land-rights-climate.pdf",
    coverImage: "https://images.unsplash.com/photo-1574195133452-f0830139812e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "This groundbreaking research explores the intersection of climate change, land rights, and gender justice in Tanzania. The report examines how women's land ownership is affected by climate change and provides recommendations for policy reform to protect women's land rights in the context of environmental challenges.",
    authors: ["Dr. Amina Hassan", "Dr. John Kimaro"],
    tags: ["Climate Justice", "Land Rights", "Women", "Research"]
  },
  {
    id: "digital-legal-services-impact",
    title: "Digital Legal Services: Haki Yangu App Impact Study",
    type: "Research",
    date: "February 2024",
    downloadUrl: "/publications/digital-legal-services-impact.pdf",
    coverImage: "https://images.unsplash.com/photo-1583345237708-61a5c607c276?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    description: "This impact study measures the effectiveness of the Haki Yangu mobile application in increasing access to justice for remote and underserved communities. The research includes user demographics, most common legal issues addressed, and success rates in resolving disputes through digital platforms.",
    authors: ["LSF Digital Team"],
    tags: ["Digital Transformation", "Mobile App", "Impact Study"]
  }
];

const PublicationDetail = () => {
  const { publicationId } = useParams<{ publicationId: string }>();
  const [publication, setPublication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPublications, setRelatedPublications] = useState<any[]>([]);

  useEffect(() => {
    const fetchPublication = async () => {
      setLoading(true);
      try {
        // Try to fetch from API first
        const apiData = await publicationService.getPublicationById(parseInt(publicationId || '0'));
        if (apiData) {
          setPublication(apiData);
        } else {
          // Fall back to mock data
          const mockData = mockPublications.find(p => p.id === publicationId);
          setPublication(mockData || null);
        }
        
        // Get related publications (either from API or mock)
        const relatedData = mockPublications.filter(p => p.id !== publicationId).slice(0, 3);
        setRelatedPublications(relatedData);
      } catch (error) {
        console.error("Failed to fetch publication:", error);
        // Fall back to mock data on error
        const mockData = mockPublications.find(p => p.id === publicationId);
        setPublication(mockData || null);
        
        const relatedData = mockPublications.filter(p => p.id !== publicationId).slice(0, 3);
        setRelatedPublications(relatedData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublication();
  }, [publicationId]);

  // Handle download tracking
  const handleDownload = async () => {
    try {
      if (publication && publication.id) {
        await publicationService.recordDownload(parseInt(publication.id));
      }
    } catch (error) {
      console.error("Failed to record download:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-200 rounded w-96 mb-6"></div>
              <div className="h-4 bg-neutral-200 rounded w-72 mb-4"></div>
              <div className="h-64 bg-neutral-200 rounded w-full mb-6"></div>
              <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!publication) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4 font-panton">Publication Not Found</h1>
            <p className="text-neutral-gray mb-8 font-calibri">The publication you're looking for doesn't exist or has been removed.</p>
            <Link to="/publications">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Publications
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-neutral-50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/publications" className="inline-flex items-center text-primary font-medium hover:underline font-calibri">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Publications
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Cover Image and Details */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <img 
                  src={publication.coverImage} 
                  alt={publication.title}
                  className="w-full h-auto rounded-lg mb-6"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1553830591-d8632a99e6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                  }}
                />
                
                <div className="flex justify-between mb-6">
                  <Button onClick={handleDownload} className="flex-1 mr-2 font-calibri bg-primary hover:bg-primary-dark">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button variant="outline" className="font-calibri">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm font-panton">Publication Date</h3>
                      <p className="text-neutral-gray font-calibri">{publication.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FileText className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm font-panton">Document Type</h3>
                      <p className="text-neutral-gray font-calibri">{publication.type}</p>
                    </div>
                  </div>
                  {publication.authors && (
                    <div>
                      <h3 className="font-bold text-sm font-panton">Authors</h3>
                      <ul className="list-disc list-inside text-neutral-gray font-calibri">
                        {publication.authors.map((author: string, index: number) => (
                          <li key={index}>{author}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {publication.tags && (
                    <div>
                      <h3 className="font-bold text-sm mb-2 font-panton">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {publication.tags.map((tag: string, index: number) => (
                          <span key={index} className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-calibri">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column: Title and Content */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="mb-2">
                  <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-4 font-calibri">
                    {publication.type}
                  </span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-6 font-panton">{publication.title}</h1>
                
                <div className="prose max-w-none font-calibri">
                  <p className="text-lg mb-6">{publication.description}</p>
                  
                  {/* This would typically be HTML content from CMS */}
                  <p>This publication is part of LSF's commitment to advancing access to justice through research, education, and advocacy. The findings presented here inform our programmatic work and policy recommendations.</p>
                  
                  <h2 className="text-2xl font-bold mt-8 mb-4 font-panton">Key Findings</h2>
                  <ul className="list-disc pl-6 mb-6">
                    <li className="mb-2">Increased awareness of legal rights among target populations</li>
                    <li className="mb-2">Improved resolution rates for common legal disputes</li>
                    <li className="mb-2">Enhanced capacity of local legal aid providers</li>
                    <li className="mb-2">Stronger collaboration with government institutions</li>
                  </ul>
                  
                  <h2 className="text-2xl font-bold mt-8 mb-4 font-panton">Recommendations</h2>
                  <p>Based on the findings in this publication, we recommend:</p>
                  <ol className="list-decimal pl-6 mb-6">
                    <li className="mb-2">Increasing support for community-based legal aid providers</li>
                    <li className="mb-2">Strengthening digital platforms for legal services</li>
                    <li className="mb-2">Enhancing gender-responsive approaches in legal aid</li>
                    <li className="mb-2">Integrating climate justice considerations into legal frameworks</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related Publications */}
          {relatedPublications.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8 font-panton">Related Publications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPublications.map((pub, index) => (
                  <Link key={index} to={`/publications/${pub.id}`} className="group">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:translate-y-[-5px] duration-300">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={pub.coverImage} 
                          alt={pub.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1553830591-d8632a99e6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-sm text-neutral-gray font-calibri">{pub.type} • {pub.date}</span>
                        <h3 className="text-lg font-bold mt-2 group-hover:text-primary transition-colors font-panton">
                          {pub.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PublicationDetail;
