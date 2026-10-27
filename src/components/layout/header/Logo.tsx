import { useCopy } from "@/i18n/useCopy";
import { Link } from 'react-router-dom';

const Logo = () => {
  const c = useCopy();
  return (
    <div className="flex-shrink-0">
      <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
        <img
          src="/lsf-logo.png"
          alt="LSF Logo"
          className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
        />
        <div className="hidden 2xl:block">
          <div className="text-[10px] md:text-xs text-neutral-gray leading-tight">{c("Empowering Justice Since 2011")}</div>
        </div>
      </Link>
    </div>
  );
};

export default Logo;