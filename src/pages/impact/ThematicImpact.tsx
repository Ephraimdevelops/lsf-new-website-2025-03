import Section from '../../components/shared/Section';
import ResponsiveContainer from '../../components/shared/ResponsiveContainer';
import Typography from '../../components/shared/Typography';
import { Scale, Shield, Gavel, Smartphone, Leaf } from 'lucide-react';
import DesignIcon from '../../components/design-system/DesignIcon';

const impactAreas = [
  {
    title: 'Legal Aid Access',
    icon: <Scale className="h-8 w-8" />,
    points: [
      'Free legal support available in every region',
      'Thousands of community-level legal resolutions annually',
      'Mobile legal clinics reaching remote areas'
    ],
    color: 'from-primary to-primary-dark'
  },
  {
    title: 'Gender Justice',
    icon: <Shield className="h-8 w-8" />,
    points: [
      'Paralegals addressing GBV, inheritance, land rights',
      'Women supported to access justice and leadership spaces',
      'Gender-responsive legal aid services'
    ],
    color: 'from-pink-500 to-pink-600'
  },
  {
    title: 'Policy Reform',
    icon: <Gavel className="h-8 w-8" />,
    points: [
      'Legal Aid Act supported & operationalized',
      'Mama Samia Legal Aid Campaign scaled nationally',
      'Evidence-based policy recommendations'
    ],
    color: 'from-secondary-teal to-teal-600'
  },
  {
    title: 'Digital Transformation',
    icon: <Smartphone className="h-8 w-8" />,
    points: [
      'Haki Yangu app connects users to paralegals',
      'Digital training & case tracking introduced',
      '10,000+ app users accessing justice digitally'
    ],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'Climate Justice & Land Rights',
    icon: <Leaf className="h-8 w-8" />,
    points: [
      'Communities empowered to challenge land grabs',
      'Legal support for environmental protection',
      'Climate-vulnerable communities protected'
    ],
    color: 'from-green-500 to-emerald-600'
  }
];

export const ThematicImpact = () => {
  return (
    <Section variant="secondary" padding="xl">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          {/* Header */}
         <div className="text-center mb-12">
        <div className="inline-flex items-center bg-gradient-to-r from-primary/10 via-secondary-teal/10 to-secondary-orange/10 backdrop-blur-sm rounded-full px-8 py-4 mb-8 border border-primary/20">
            <DesignIcon 
              icon={<div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
              size="sm"
              className="mr-4"
            />
            <Typography variant="overline" color="primary" className="font-bold text-lg tracking-widest">
            Impact
            </Typography>
          </div>
          <Typography variant="h2" className="mb-8 text-5xl md:text-6xl font-bold">
          Thematic<span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent"></span>
            <span className="block bg-gradient-to-r from-primary to-secondary-teal bg-clip-text text-transparent">
            Impact Areas
            </span>
          </Typography>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our comprehensive approach addresses multiple dimensions of justice and legal empowerment.
          </p>
         
        </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {impactAreas.map((area, index) => (
            <div key={index} className="group">
              <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`h-32 bg-gradient-to-br ${area.color} p-6 flex items-center justify-center text-white`}>
                  <div className="text-center">
                    <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                      {area.icon}
                    </div>
                    <Typography variant="h4" className="text-white font-bold">
                      {area.title}
                    </Typography>
                  </div>
                </div>
                <div className="p-8">
                  <ul className="space-y-3">
                    {area.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <Typography variant="bodySmall" className="text-muted-foreground">
                          {point}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </Section>
  );
};