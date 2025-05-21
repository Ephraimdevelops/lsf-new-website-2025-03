
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Calendar, MapPin } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';

// Define the story data structure
interface StoryData {
  id: string;
  name: string;
  location: string;
  date: string;
  summary: string;
  challenge: string;
  solution: string;
  impact: string;
  image: string;
  quote: string;
  relatedImages?: string[];
}

// Sample success stories data
const successStories: StoryData[] = [
  {
    id: "maria-joseph",
    name: "Maria Joseph",
    location: "Morogoro Region",
    date: "June 2023",
    summary: "After being denied her inheritance rights following her husband's death, Maria sought help from our paralegals. Through legal education and representation, she was able to secure her rightful property.",
    challenge: "When Maria Joseph's husband passed away, her in-laws claimed all the family property, including land that she had farmed for decades. As a widow without formal education, Maria didn't know her legal rights and faced potential destitution along with her three children.",
    solution: "LSF paralegals provided immediate support by educating Maria about her inheritance rights under both statutory and customary law. They arranged community mediation with village elders and Maria's in-laws. When mediation wasn't fully successful, they connected Maria with pro bono legal services to formalize her land ownership through the courts.",
    impact: "Maria successfully secured her rightful property, including five acres of farmland and the family home. She now leads a community women's group that educates other women about property and inheritance rights. Her increased income from the farm has enabled her to send all three children to school, with her eldest daughter now attending university.",
    image: "https://images.unsplash.com/photo-1542103749-8ef59b94f47e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    quote: "I thought all was lost when my husband died and his family wanted me to leave. The paralegals showed me that the law protects women like me. Now I help other widows know their rights too.",
    relatedImages: [
      "https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507836772445-e2081c138613?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    ]
  },
  {
    id: "emmanuel-baraka",
    name: "Emmanuel Baraka",
    location: "Mwanza Region",
    date: "April 2023",
    summary: "Emmanuel's community faced environmental damage from a nearby factory. With our support, they pursued legal action that resulted in proper environmental safeguards being implemented.",
    challenge: "A manufacturing facility on the outskirts of Emmanuel's village began releasing untreated waste into the river that served as the primary water source for six villages. Community members were experiencing health issues, and fish—an important food source—were dying. Local authorities were initially unresponsive to complaints.",
    solution: "LSF-supported paralegals helped Emmanuel and other community leaders to document the pollution's effects and understand relevant environmental regulations. They organized community environmental monitoring committees and engaged with local media. The paralegals facilitated meetings with district environmental officers and factory management, pressing for compliance with environmental laws.",
    impact: "The factory installed proper waste treatment facilities and agreed to regular monitoring by community representatives. Water quality in the river has significantly improved, health complaints have decreased by over 70%, and fish populations are recovering. The community now has an established relationship with environmental authorities and a voice in local development decisions.",
    image: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    quote: "When we organized together with knowledge of our rights, even the powerful companies had to listen. Our children will now have clean water for generations."
  },
  {
    id: "fatima-hassan",
    name: "Fatima Hassan",
    location: "Zanzibar",
    date: "September 2023",
    summary: "As a single mother, Fatima struggled to obtain child support. Our paralegals helped her navigate the legal system and successfully negotiate a fair support arrangement.",
    challenge: "After Fatima's husband abandoned the family, she was left to raise three young children alone with no financial support. Working as a part-time domestic helper, she couldn't afford school fees or adequate healthcare for her children. She didn't know how to claim child support or navigate the legal system.",
    solution: "LSF paralegals provided Fatima with information about her children's rights to support. They helped her gather necessary documentation and initially attempted mediation with her estranged husband's family. When mediation proved insufficient, they connected her with a legal aid attorney who helped file a formal child support case and represent her in court proceedings.",
    impact: "Fatima secured a formal child support order that covers her children's educational and healthcare needs. All three children are now attending school regularly, with the oldest showing significant improvement in academic performance. Fatima has joined a women's economic empowerment group and started a small food business to supplement her income, improving the family's overall financial stability.",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    quote: "I used to cry every night worrying about my children's future. Now they are in school, have enough to eat, and I can sleep knowing tomorrow will be better. The paralegals gave me courage to stand up for my children's rights."
  },
  {
    id: "john-mkwawa",
    name: "John Mkwawa",
    location: "Dodoma Region",
    date: "December 2022",
    summary: "John's village had a long-standing land dispute with a neighboring community. Through mediation and legal support, both communities reached a sustainable agreement.",
    challenge: "A decades-old boundary dispute between two villages had recently escalated into violence when one community began clearing land for new farming. The unclear demarcation of village lands, dating back to colonial times, was causing increasing tension and threatening the livelihoods of hundreds of families in both communities.",
    solution: "LSF paralegals facilitated a series of dialogue sessions between village elders from both communities. They brought in land experts to conduct proper surveys and researched historical records. Working with local government authorities, they helped establish a joint committee with representatives from both villages to develop a fair resolution based on both customary uses and formal land laws.",
    impact: "The communities reached a formal agreement that established clear boundaries while creating shared access to critical water points and grazing areas. A community land monitoring committee with members from both villages was formed to manage ongoing implementation. The process has become a model for other villages in the region facing similar conflicts, and John now volunteers as a community paralegal, helping other communities resolve land disputes peacefully.",
    image: "https://images.unsplash.com/photo-1512411233342-92208dfe81af?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    quote: "Our grandfathers fought over this land, and we were continuing the same path. Now our children will farm together in peace because we found a way to share justly."
  }
];

const HeroDetail = () => {
  const { heroId } = useParams<{ heroId: string }>();
  
  // Find the story that matches the heroId parameter
  const story = successStories.find(s => s.id === heroId);
  
  // If no story found, show a message
  if (!story) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4 font-panton">Story Not Found</h1>
          <p className="mb-6 font-calibri">We couldn't find the success story you're looking for.</p>
          <Link to="/heroes">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Stories
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-cover bg-center" style={{ backgroundImage: `url(${story.image})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 flex flex-col justify-end p-8">
          <div className="container mx-auto px-4">
            <Link to="/heroes" className="inline-flex items-center text-white bg-white/20 px-4 py-2 rounded-full mb-6 hover:bg-white/30 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Stories
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-panton">{story.name}'s Story</h1>
            <div className="flex flex-wrap gap-4 items-center text-white/90 mb-6">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-secondary-orange" />
                <span className="font-calibri">{story.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-secondary-orange" />
                <span className="font-calibri">{story.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 font-panton">Summary</h2>
            <p className="text-lg text-neutral-dark font-calibri">{story.summary}</p>
          </div>
          
          {/* Quote */}
          <div className="bg-primary/5 border-l-4 border-primary p-6 my-8 rounded-r-md">
            <blockquote className="text-xl italic font-calibri text-neutral-dark">
              "{story.quote}"
              <footer className="mt-2 font-bold">— {story.name}</footer>
            </blockquote>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 font-panton">The Challenge</h2>
            <p className="text-lg text-neutral-dark font-calibri">{story.challenge}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 font-panton">Our Solution</h2>
            <p className="text-lg text-neutral-dark font-calibri">{story.solution}</p>
          </div>
          
          {/* Additional Images */}
          {story.relatedImages && story.relatedImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              {story.relatedImages.map((img, index) => (
                <div key={index} className="aspect-video rounded-md overflow-hidden">
                  <img 
                    src={img} 
                    alt={`${story.name}'s story - image ${index+1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 font-panton">Impact</h2>
            <p className="text-lg text-neutral-dark font-calibri">{story.impact}</p>
          </div>
          
          {/* Social Share */}
          <div className="flex justify-between items-center border-t border-b border-gray-200 py-6 my-8">
            <div>
              <h3 className="font-bold mb-2 font-panton">Share this story</h3>
              <div className="flex gap-3">
                <button className="bg-blue-600 text-white p-2 rounded-full">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="bg-green-600 text-white p-2 rounded-full">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="bg-sky-500 text-white p-2 rounded-full">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <Link to="/legal-help">
              <Button className="font-calibri">
                Get Legal Help
                <ArrowLeft className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          {/* More Stories */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center font-panton">More Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successStories
                .filter(s => s.id !== heroId)
                .slice(0, 3)
                .map(s => (
                  <Link key={s.id} to={`/heroes/${s.id}`} className="group">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-3">
                      <img 
                        src={s.image} 
                        alt={s.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold font-panton">{s.name}</h3>
                        <p className="text-white/80 text-sm font-calibri">{s.location}</p>
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

export default HeroDetail;
