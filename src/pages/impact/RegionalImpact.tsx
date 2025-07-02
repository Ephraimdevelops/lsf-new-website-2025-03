import Section from '../../components/shared/Section';
import ResponsiveContainer from '../../components/shared/ResponsiveContainer';
import Typography from '../../components/shared/Typography';

const regionalData = [
  { region: 'Dar es Salaam', paralegals: '245', reached: '15,400+' },
  { region: 'Morogoro', paralegals: '115', reached: '6,300+' },
  { region: 'Mwanza', paralegals: '132', reached: '8,200+' },
  { region: 'Dodoma', paralegals: '98', reached: '5,800+' },
  { region: 'Arusha', paralegals: '87', reached: '4,900+' },
  { region: 'Mbeya', paralegals: '76', reached: '4,200+' },
  { region: 'Zanzibar', paralegals: '65', reached: '3,800+' },
  { region: 'Kilimanjaro', paralegals: '82', reached: '4,600+' }
];

export const RegionalImpact = () => {
  return (
    <Section variant="secondary" padding="xl">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <Typography variant="h2" className="mb-4">
            Nationwide Reach
          </Typography>
          <Typography variant="body" className="text-muted-foreground max-w-3xl mx-auto">
            LSF's impact spans all 31 regions of Tanzania, creating justice pathways in every community.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regionalData.map((item, index) => (
            <div key={index} className="bg-card rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <Typography variant="h4" className="mb-3 text-primary">
                {item.region}
              </Typography>
              <div className="space-y-2">
                <div>
                  <Typography variant="bodySmall" className="text-muted-foreground">
                    Paralegals:
                  </Typography>
                  <Typography variant="h4" className="font-bold">
                    {item.paralegals}
                  </Typography>
                </div>
                <div>
                  <Typography variant="bodySmall" className="text-muted-foreground">
                    People Reached:
                  </Typography>
                  <Typography variant="h4" className="font-bold text-secondary-teal">
                    {item.reached}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </Section>
  );
};