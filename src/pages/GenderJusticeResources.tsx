
import { Users } from 'lucide-react';
import ResourceCategory from './ResourceCategory';

const GenderJusticeResources = () => {
  return (
    <ResourceCategory
      category="Gender Justice"
      title="Gender Justice Resources"
      description="Resources focusing on women's rights, gender-based violence prevention, and gender equality initiatives in Tanzania."
      icon={<Users className="h-8 w-8" />}
    />
  );
};

export default GenderJusticeResources;
