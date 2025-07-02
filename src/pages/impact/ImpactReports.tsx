import Section from '../../components/shared/Section';
import ResponsiveContainer from '../../components/shared/ResponsiveContainer';
import Typography from '../../components/shared/Typography';
import { Button } from '../../components/ui/button';
import { Download } from 'lucide-react';

const reports = [
  {
    title: 'Annual Impact Report 2024',
    description: 'Comprehensive overview of LSF achievements and impact across Tanzania',
    type: 'PDF',
    pages: '64 pages'
  },
  {
    title: 'Gender Justice Research Brief',
    description: 'Analysis of gender-responsive legal aid and its impact on women\'s rights',
    type: 'PDF',
    pages: '24 pages'
  },
  {
    title: 'Digital Legal Aid Study',
    description: 'Evaluation of technology integration in community-based legal services',
    type: 'PDF',
    pages: '32 pages'
  },
  {
    title: 'Community Paralegals Handbook',
    description: 'Training resource for community-based legal service providers',
    type: 'PDF',
    pages: '48 pages'
  }
];

export const ImpactReports = () => {
  return (
    <Section variant="default" padding="xl">
      <ResponsiveContainer>
        <div className="text-center mb-16">
          <Typography variant="h2" className="mb-4">
            Reports & Publications
          </Typography>
          <Typography variant="body" className="text-muted-foreground max-w-3xl mx-auto">
            Download our comprehensive reports and research briefs to explore our impact in detail.
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reports.map((report, index) => (
            <div key={index} className="bg-card rounded-xl border border-border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <Typography variant="h4" className="mb-3">
                    {report.title}
                  </Typography>
                  <Typography variant="body" className="text-muted-foreground mb-4">
                    {report.description}
                  </Typography>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="bg-muted px-3 py-1 rounded-full">{report.type}</span>
                    <span>{report.pages}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </Section>
  );
};