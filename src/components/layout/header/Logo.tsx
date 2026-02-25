import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div className="flex-shrink-0">
      <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
        <img
          src="/lsf-logo.png"
          alt="LSF Logo"
          className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
        />
        <div className="hidden sm:block">
          <div className="text-[10px] md:text-xs text-neutral-gray leading-tight">
            Empowering Justice Since 2011
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Logo;