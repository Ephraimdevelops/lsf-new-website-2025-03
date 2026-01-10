import { Scale } from 'lucide-react';
import ResourceCategory from './ResourceCategory';

const LegalEmpowermentResources = () => {
  return (
    <ResourceCategory
      category="Legal Empowerment"
      title="Legal Empowerment Resources"
      description="Comprehensive collection of reports, guides, and tools on legal aid, paralegal programs, and access to justice initiatives across Tanzania."
      icon={<Scale className="h-6 w-6" />}
      accentColor="primary"
    />
  );
};

export default LegalEmpowermentResources;
