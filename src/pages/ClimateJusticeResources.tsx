
import { Leaf } from 'lucide-react';
import ResourceCategory from './ResourceCategory';

const ClimateJusticeResources = () => {
  const breadcrumbItems = [
    { name: "Resources", href: "/resources" },
    { name: "Climate Justice" }
  ];

  return (
    <ResourceCategory
      category="Climate Justice"
      title="Climate Justice Resources"
      description="Publications on environmental rights, climate adaptation strategies, and community resilience building in the face of climate change."
      icon={<Leaf className="h-8 w-8" />}
      breadcrumbItems={breadcrumbItems}
    />
  );
};

export default ClimateJusticeResources;
