
import NewsletterSection from './footer/NewsletterSection';
import FooterLinks from './footer/FooterLinks';
import FooterBottom from './footer/FooterBottom';

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
      
      <NewsletterSection />
      <FooterLinks />
      <FooterBottom />
    </footer>
  );
};

export default Footer;
