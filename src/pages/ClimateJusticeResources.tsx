import { Leaf } from 'lucide-react';
import ResourceCategory from './ResourceCategory';

const ClimateJusticeResources = () => {
  return (
    <ResourceCategory
      category="Climate Justice"
      title="Climate Justice Resources"
      description="Legal tools, guides, and resources for protecting environmental rights and advancing climate justice in Tanzania."
      icon={<Leaf className="h-6 w-6" />}
      accentColor="secondary-teal"
    />
  );
};

export default ClimateJusticeResources;
