
import { Link } from 'react-router-dom';
import { ArrowRight, FileText } from 'lucide-react';
import Card from './Card';

interface CategoryCardProps {
  title: string;
  description: string;
  imageUrl: string;
  resourceCount: number;
  linkTo: string;
  icon?: React.ReactNode;
}

const CategoryCard = ({ 
  title, 
  description, 
  imageUrl, 
  resourceCount, 
  linkTo,
  icon = <FileText className="h-5 w-5" />
}: CategoryCardProps) => {
  return (
    <Link to={linkTo} className="group block">
      <Card variant="elevated" hover className="h-full overflow-hidden">
        <div className="relative h-40 overflow-hidden -m-8 mb-0">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        <div className="pt-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-neutral-gray mb-4 line-clamp-2">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-primary">
              {icon}
              <span className="text-sm font-medium ml-2">{resourceCount} resources</span>
            </div>
            <div className="flex items-center text-primary group-hover:underline">
              <span className="text-sm font-medium">Browse</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;
