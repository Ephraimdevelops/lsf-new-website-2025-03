
import { Leaf } from 'lucide-react';
import ResourceCategory from './ResourceCategory';

const ClimateJusticeResources = () => {
  return (
    <ResourceCategory
      category="Climate Justice"
      title="Climate Justice Resources"
      description="Publications on environmental rights, climate adaptation strategies, and community resilience building in the face of climate change."
      icon={<Leaf className="h-8 w-8" />}
    />
  );
};

export default ClimateJusticeResources;
