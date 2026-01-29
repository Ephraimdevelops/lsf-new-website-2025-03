
import Typography from '@/components/shared/Typography';
import Container from '@/components/shared/Container';

const AboutPartnersSection = () => {
    const partners = [
        { name: 'DANIDA', logo: '/lovable-uploads/Danish amabssador.png' },
        { name: 'European Union', logo: '/lovable-uploads/Funded by European Union.png' },
        { name: 'FCDO', logo: '/lovable-uploads/FCDO_logo.png' },
        { name: 'The World Bank', logo: '/lovable-uploads/WorldBank_logo.jpg' },
        { name: 'WINGS', logo: '/lovable-uploads/WINGS_logo.png' },
        { name: 'ENABEL', logo: '/lovable-uploads/Enabel.png' },
    ];

    return (
        <section className="py-20 bg-neutral-50 border-t border-neutral-100">
            <Container>
                <div className="text-center mb-16">
                    <Typography variant="h2" className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                        Our Strategic <span className="text-primary">Partners</span>
                    </Typography>
                    <div className="h-1 w-24 bg-primary mx-auto rounded-full mb-6"></div>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Collaborating with global leaders to drive legal empowerment and sustainable development.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center opacity-80 hover:opacity-100 transition-opacity duration-500">
                    {partners.map((partner, index) => (
                        <div key={index} className="w-full h-24 flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all grayscale hover:grayscale-0">
                            <img
                                src={partner.logo}
                                alt={`${partner.name} logo`}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                    // Fallback if image not found
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=' + partner.name;
                                }}
                            />
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default AboutPartnersSection;
