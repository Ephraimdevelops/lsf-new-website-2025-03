import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className="flex-shrink-0">
      <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
        <img 
          src="/lovable-uploads/b797c986-5b8f-48f5-968c-0b8313971893.png" 
          alt="LSF Logo"
          className="h-10 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
        />
        <div className="hidden sm:block">
          <div className="text-xs md:text-sm font-bold text-primary transition-colors duration-200 group-hover:text-primary-dark leading-tight">
            Legal Services Facility
          </div>
          <div className="text-[10px] md:text-xs text-neutral-gray leading-tight">
            Empowering Justice Since 2011
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Logo;