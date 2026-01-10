import { Heart } from 'lucide-react';
import ResourceCategory from './ResourceCategory';

const GenderJusticeResources = () => {
  return (
    <ResourceCategory
      category="Gender Justice"
      title="Gender Justice Resources"
      description="Resources focusing on women's rights, gender-based violence prevention, and gender equality initiatives in Tanzania."
      icon={<Heart className="h-6 w-6" />}
      accentColor="secondary-orange"
    />
  );
};

export default GenderJusticeResources;
