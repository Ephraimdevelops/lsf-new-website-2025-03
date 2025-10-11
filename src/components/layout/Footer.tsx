
import ModernNewsletterSection from './footer/ModernNewsletterSection';
import ModernFooterLinks from './footer/ModernFooterLinks';
import ModernFooterBottom from './footer/ModernFooterBottom';

const Footer = () => {
  return (
    <footer className="relative bg-neutral-dark text-white overflow-hidden">
      {/* Brand Pattern Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/lovable-uploads/20fb51ec-eb2b-49e9-9b3e-f6fb1ad52532.png')`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      <ModernNewsletterSection />
      <ModernFooterLinks />
      <ModernFooterBottom />
    </footer>
  );
};

export default Footer;
