import { Bot, ArrowRight, Sparkles, Scale, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';
import { Link } from 'react-router-dom';
import { useCopy } from '@/i18n/useCopy';

const SaraAISection = () => {
    const c = useCopy();
    return (
        <section className="py-10 bg-primary/5 relative overflow-hidden">
            <Container>
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-primary/10">
                    <div className="grid lg:grid-cols-2">

                        {/* Left: Content */}
                        <div className="p-10 lg:p-14 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm uppercase tracking-wider mb-6 self-start">
                                <Sparkles className="h-4 w-4" />
                                <span>{c("AI Legal Assistant")}</span>
                            </div>

                            <Typography variant="h2" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                                {c("Understand your rights with")} <span className="text-primary">{c("Haki Yangu AI")}</span>.
                            </Typography>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                {c("Ask about your rights and possible next steps. AI answers can be wrong.")}
                            </p>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="font-medium text-gray-700">{c("Ask online")}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Scale className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="font-medium text-gray-700">{c("Understand your rights")}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <BookOpen className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="font-medium text-gray-700">{c("Kiswahili & English")}</span>
                                </div>
                            </div>

                            <Link to="/sara-ai" className="self-start">
                                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-3">
                                    <Bot className="w-6 h-6" />
                                    {c("Chat with Haki Yangu AI")}
                                    <ArrowRight className="w-5 h-5 opacity-80" />
                                </Button>
                            </Link>
                        </div>

                        {/* Right: Visual Mockup */}
                        <div className="bg-primary/5 relative min-h-[400px] flex items-end justify-center px-10 pt-10 lg:pl-10 lg:pr-20 overflow-hidden">
                            {/* Browser Frame */}
                            <div className="relative w-full max-w-sm border-t-[12px] border-x-[12px] border-b-0 border-gray-900 rounded-t-[2rem] bg-white shadow-2xl z-10 -mb-2 transform transition-transform hover:-translate-y-4 duration-500">
                                <div className="bg-gray-50 h-full w-full overflow-hidden rounded-t-[1.5rem] border-b border-gray-200">
                                    {/* Header */}
                                    <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden border border-primary/20">
                                            <img src="/sara-avatar-v2.png" alt="Haki Yangu AI" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-2 w-24 bg-gray-200 rounded-full mb-1"></div>
                                            <div className="h-1.5 w-16 bg-gray-100 rounded-full"></div>
                                        </div>
                                    </div>
                                    {/* Chat */}
                                    <div className="p-4 space-y-4 h-[300px]">
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden shrink-0 border border-primary/20">
                                                <img src="/sara-avatar-v2.png" alt="Haki Yangu AI" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-xs text-gray-600 max-w-[85%]">
                                                {c("Hello! What would you like help with?")}
                                            </div>
                                        </div>
                                        <div className="flex gap-3 flex-row-reverse">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
                                            <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-xs max-w-[85%]">
                                                {c("How can I protect my land?")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute top-10 right-10 w-24 h-24 bg-primary rounded-full blur-3xl opacity-20 animate-pulse" />
                        </div>

                    </div>
                </div>
            </Container>
        </section>
    );
};

export default SaraAISection;
