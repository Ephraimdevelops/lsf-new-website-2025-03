
import { Users } from 'lucide-react';
import ResourceCategory from './ResourceCategory';

const GenderJusticeResources = () => {
  const breadcrumbItems = [
    { name: "Resources", href: "/resources" },
    { name: "Gender Justice" }
  ];

  return (
    <ResourceCategory
      category="Gender Justice"
      title="Gender Justice Resources"
      description="Resources focusing on women's rights, gender-based violence prevention, and gender equality initiatives in Tanzania."
      icon={<Users className="h-8 w-8" />}
      breadcrumbItems={breadcrumbItems}
    />
  );
};

export default GenderJusticeResources;
