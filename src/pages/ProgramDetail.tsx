
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const programsData = {
  'legal-empowerment': {
    title: 'Legal Empowerment',
    description: `Our Legal Empowerment program focuses on enhancing access to justice through community-based legal aid providers and paralegals. We work to build capacity among local organizations and individuals to provide quality legal services to marginalized communities.`,
    image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb',
    color: 'bg-primary',
    objectives: [
      'Strengthen the capacity of legal aid providers',
      'Expand paralegal services in underserved areas',
      'Promote legal awareness and education',
      'Support strategic litigation for systemic change',
      'Advocate for legal reforms that enhance access to justice'
    ]
  },
  'gender-justice': {
    title: 'Gender Justice',
    description: `Our Gender Justice program is dedicated to advancing women's rights and addressing gender-based violence and discrimination. We support initiatives that promote gender equality and empower women to claim their rights.`,
    image: 'https://images.unsplash.com/photo-1573497019949-b08c40365c71',
    color: 'bg-secondary-green',
    objectives: [
      'Combat gender-based violence and discrimination',
      'Support women's rights organizations',
      'Promote women's land and property rights',
      'Enhance women's political participation',
      'Address harmful traditional practices'
    ]
  },
  'climate-justice': {
    title: 'Climate Justice',
    description: `Our Climate Justice program supports communities affected by climate change and promotes environmental rights. We work to ensure that vulnerable communities have the legal tools to protect their resources and livelihoods in the face of environmental challenges.`,
    image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02',
    color: 'bg-secondary-teal',
    objectives: [
      'Support communities affected by climate change',
      'Promote environmental rights awareness',
      'Strengthen legal frameworks for environmental protection',
      'Advocate for equitable climate policies',
      'Build community resilience against climate impacts'
    ]
  },
  'digital-transformation': {
    title: 'Digital Transformation',
    description: `Our Digital Transformation program leverages technology to improve access to justice and legal information. We develop digital tools and platforms that make legal services more accessible, especially to rural and marginalized communities.`,
    image: 'https://images.unsplash.com/photo-1496096265110-f83ad7f96608',
    color: 'bg-secondary-orange',
    objectives: [
      'Develop digital tools for legal aid services',
      'Enhance remote access to legal information',
      'Train community paralegals in using digital tools',
      'Create online platforms for legal education',
      'Build data systems for monitoring access to justice'
    ]
  }
};

const ProgramDetail = () => {
  const { programId } = useParams<{ programId: string }>();
  
  const program = programId ? programsData[programId as keyof typeof programsData] : undefined;
  
  if (!program) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Program Not Found</h1>
            <p className="text-gray-600 mb-8">We couldn't find the program you're looking for.</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className={`${program.color} py-20 md:py-28`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{program.title}</h1>
            <p className="text-xl opacity-90">{program.description.substring(0, 120)}...</p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Content Column */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">About the Program</h2>
                <p className="text-neutral-gray mb-4">{program.description}</p>
                <p className="text-neutral-gray">
                  Through strategic partnerships with local organizations, government agencies, and international stakeholders, 
                  we implement initiatives that address the root causes of injustice and provide sustainable solutions to 
                  challenges faced by marginalized communities.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Key Objectives</h2>
                <ul className="space-y-3">
                  {program.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <svg className={`flex-shrink-0 h-6 w-6 mr-2 text-${program.color.replace('bg-', '')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Approach</h2>
                <p className="text-neutral-gray mb-4">
                  We take a community-centered approach to all our programs, ensuring that the people we serve 
                  are involved in designing and implementing solutions. Our work is guided by principles of:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-neutral-light p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Participation</h3>
                    <p className="text-sm text-neutral-gray">Involving communities in decision-making processes</p>
                  </div>
                  <div className="bg-neutral-light p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Sustainability</h3>
                    <p className="text-sm text-neutral-gray">Creating long-term solutions that can be maintained locally</p>
                  </div>
                  <div className="bg-neutral-light p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Innovation</h3>
                    <p className="text-sm text-neutral-gray">Testing new approaches to access to justice challenges</p>
                  </div>
                  <div className="bg-neutral-light p-4 rounded-lg">
                    <h3 className="font-bold mb-2">Learning</h3>
                    <p className="text-sm text-neutral-gray">Continuous monitoring and adaptation of our approaches</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              <div>
                <img 
                  src={program.image} 
                  alt={program.title} 
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              
              <div className="bg-neutral-light p-6 rounded-lg">
                <h3 className="font-bold text-xl mb-4">Get Involved</h3>
                <p className="text-neutral-gray mb-4">
                  Interested in supporting our {program.title} program? There are several ways you can contribute:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Volunteer your expertise</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Donate to support our work</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="flex-shrink-0 h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Partner with us</span>
                  </li>
                </ul>
                <a href="/contact" className="btn-primary w-full block text-center">Contact Us</a>
              </div>
              
              <div className="bg-primary p-6 rounded-lg text-white">
                <h3 className="font-bold text-xl mb-4">Success Story</h3>
                <p className="italic mb-4">
                  "LSF's program helped our community understand our legal rights and access essential services. 
                  Now we have the tools to advocate for ourselves and create positive change."
                </p>
                <p className="font-bold">- Maria J., Community Member</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProgramDetail;
