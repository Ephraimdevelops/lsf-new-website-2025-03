import { MessageCircle, ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Container from '@/components/shared/Container';
import Typography from '@/components/shared/Typography';

const HakiYanguChatbot = () => {
    return (
        <section className="py-10 bg-green-50 relative overflow-hidden">
            {/* WhatsApp Pattern Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg')",
                    backgroundSize: "60px",
                    backgroundRepeat: "repeat",
                    opacity: 0.03
                }}
            />

            <Container>
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
                    <div className="grid lg:grid-cols-2">

                        {/* Left: Content */}
                        <div className="p-10 lg:p-14 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 font-bold text-sm uppercase tracking-wider mb-6 self-start">
                                <MessageCircle className="h-4 w-4" />
                                <span>New: WhatsApp Assistant</span>
                            </div>

                            <Typography variant="h2" className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                                Legal Help, Right on <span className="text-[#25D366]">WhatsApp</span>.
                            </Typography>

                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                No need to download an app. Chat directly with our Haki Yangu AI Assistant on WhatsApp to get instant legal guidance, find paralegals, or report issues.
                            </p>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <Clock className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="font-medium text-gray-700">Available 24/7 for instant answers</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <Shield className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="font-medium text-gray-700">100% Private & Anonymous</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="font-medium text-gray-700">Works on all phones with WhatsApp</span>
                                </div>
                            </div>

                            <a
                                href="https://wa.me/255XXXXXXXXX"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="self-start"
                            >
                                <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-8 py-6 rounded-full text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-3">
                                    <MessageCircle className="w-6 h-6" />
                                    Start WhatsApp Chat
                                    <ArrowRight className="w-5 h-5 opacity-80" />
                                </Button>
                            </a>
                            <p className="text-sm text-gray-400 mt-4">
                                *Standard data rates apply.
                            </p>
                        </div>

                        {/* Right: Visual Mockup */}
                        <div className="bg-[#25D366]/5 relative min-h-[400px] flex items-end justify-center px-10 pt-10 lg:pl-10 lg:pr-20 overflow-hidden">
                            {/* Phone Frame */}
                            <div className="relative w-[300px] border-[12px] border-gray-900 rounded-[3rem] bg-white shadow-2xl z-10 -mb-16 transform transition-transform hover:-translate-y-4 duration-500">
                                <div className="bg-gray-100 h-full w-full overflow-hidden rounded-[2.2rem]">
                                    {/* Chat Header */}
                                    <div className="bg-[#075E54] p-4 flex items-center gap-3 text-white">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Haki Yangu AI</p>
                                            <p className="text-[10px] opacity-80">blue tick verified</p>
                                        </div>
                                    </div>

                                    {/* Chat Area */}
                                    <div className="p-4 space-y-4 bg-[#E5DDD5] h-[400px]">
                                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] self-start text-xs text-gray-800">
                                            Habari! I am the Haki Yangu Assistant. How can I help you today? 🤖
                                        </div>
                                        <div className="bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[85%] ml-auto text-xs text-gray-800">
                                            Naweza kuripoti mgogoro wa ardhi hapa?
                                        </div>
                                        <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%] self-start text-xs text-gray-800">
                                            Ndio! Unaweza kuripoti. Tafadhali niambie uko mkoa gani?
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-10 right-10 w-24 h-24 bg-[#25D366] rounded-full blur-3xl opacity-20 animate-pulse" />
                            <div className="absolute bottom-10 left-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-20" />
                        </div>

                    </div>
                </div>
            </Container>
        </section>
    );
};

export default HakiYanguChatbot;
