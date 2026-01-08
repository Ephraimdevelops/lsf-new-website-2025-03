import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Container from '@/components/shared/Container';

const ModernCallToAction = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail('');
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <section className="relative py-16 md:py-20 overflow-hidden shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)]">
            {/* Brand Pattern Background */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('/lovable-uploads/brand-pattern.png')",
                    backgroundSize: '300px',
                    backgroundRepeat: 'repeat',
                }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-primary/95" />



            <Container className="relative z-10">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">

                    {/* Left: Contact CTA */}
                    <div className="text-white text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                            Ready to Take Action?
                        </h2>
                        <p className="text-white/80 text-base md:text-lg mb-6 md:mb-8 leading-relaxed">
                            Whether you need legal help, want to partner with us, or support our mission — we're here to help.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                            <Link to="/contact">
                                <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-white/90 text-primary font-bold px-6 md:px-8 py-4 md:py-5 h-auto rounded-full text-sm md:text-base shadow-lg transition-all hover:-translate-y-1">
                                    Contact Us
                                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                </Button>
                            </Link>
                            <Link to="/legal-help">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary font-bold px-6 md:px-8 py-4 md:py-5 h-auto rounded-full text-sm md:text-base transition-all">
                                    Get Legal Help
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Newsletter - Branded */}
                    <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
                        {/* Brand Pattern Background for Newsletter */}
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: "url('/lovable-uploads/brand-pattern.png')",
                                backgroundSize: '200px',
                                backgroundRepeat: 'repeat',
                            }}
                        />
                        <div className="absolute inset-0 bg-black/70" />

                        <div className="relative z-10 p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-white font-bold text-lg md:text-xl">Stay Updated</h3>
                            </div>

                            <p className="text-white/70 mb-5 md:mb-6 text-sm md:text-base">
                                Subscribe to our newsletter for the latest updates on legal aid, resources, and impact stories.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full px-5 h-11 md:h-12 flex-1 focus:border-primary"
                                />
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-white font-bold px-5 md:px-6 h-11 md:h-12 rounded-full text-sm md:text-base"
                                >
                                    {submitted ? 'Subscribed!' : 'Subscribe'}
                                    <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>
            </Container>


        </section>
    );
};

export default ModernCallToAction;
