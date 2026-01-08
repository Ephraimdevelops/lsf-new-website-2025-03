import { useState, useRef } from 'react';
import { useQuery } from 'convex/react';
import { Link } from 'react-router-dom';
import { api } from '../../convex/_generated/api';
import Layout from '../components/layout/Layout';
import Container from '../components/shared/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  MapPin, Search, ArrowRight, Smartphone, Download, Phone,
  MessageCircle, BadgeCheck, Users, Send, Bot, Sparkles,
  ChevronRight, ExternalLink, Globe, Scale, Heart, Shield
} from 'lucide-react';
import { Id } from '../../convex/_generated/dataModel';

// Define Paralegal type
type Paralegal = {
  _id: Id<"paralegal_applications">;
  fullName: string;
  email: string;
  phone: string;
  region: string;
  district: string;
  ward?: string;
  specializations?: string[];
  photoUrl?: string;
  isVerified?: boolean;
  languages?: string[];
};

const LegalHelp = () => {
  const [searchDistrict, setSearchDistrict] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Habari! I\'m Sara, your AI legal assistant. How can I help you today?' }
  ]);

  // Fetch approved paralegals
  const paralegals = useQuery(api.paralegals.listApprovedParalegals, {}) as Paralegal[] | undefined;

  // Enhanced placeholder data with contact info
  const displayParalegals: Paralegal[] = paralegals && paralegals.length > 0 ? paralegals.slice(0, 6) : [
    { _id: '1' as Id<"paralegal_applications">, fullName: 'Juma Mkwawa', email: 'juma@lsf.or.tz', phone: '+255 712 345 678', region: 'Iringa', district: 'Iringa Urban', ward: 'Gangilonga', specializations: ['Land Rights', 'Mediation'], languages: ['Swahili', 'English'], isVerified: true, photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop' },
    { _id: '2' as Id<"paralegal_applications">, fullName: 'Amina Salum', email: 'amina@lsf.or.tz', phone: '+255 754 987 654', region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Mwenge', specializations: ['Family Law', 'GBV Support'], languages: ['Swahili', 'English'], isVerified: true, photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop' },
    { _id: '3' as Id<"paralegal_applications">, fullName: 'John Kijazi', email: 'john@lsf.or.tz', phone: '+255 768 111 222', region: 'Arusha', district: 'Arumeru', ward: 'Usa River', specializations: ['Employment', 'Contracts'], languages: ['Swahili', 'English', 'Maasai'], isVerified: true, photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
    { _id: '4' as Id<"paralegal_applications">, fullName: 'Neema Mushi', email: 'neema@lsf.or.tz', phone: '+255 789 333 444', region: 'Kilimanjaro', district: 'Moshi', ward: 'Majengo', specializations: ['Inheritance', 'Child Rights'], languages: ['Swahili', 'Chagga'], isVerified: true, photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
    { _id: '5' as Id<"paralegal_applications">, fullName: 'Hassan Omari', email: 'hassan@lsf.or.tz', phone: '+255 655 555 666', region: 'Mwanza', district: 'Nyamagana', ward: 'Igogo', specializations: ['Land Rights', 'Civil Disputes'], languages: ['Swahili'], isVerified: true, photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop' },
    { _id: '6' as Id<"paralegal_applications">, fullName: 'Grace Mwakasege', email: 'grace@lsf.or.tz', phone: '+255 677 888 999', region: 'Dodoma', district: 'Dodoma Urban', ward: 'Kikuyu', specializations: ['Women\'s Rights', 'Property'], languages: ['Swahili', 'English'], isVerified: true, photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop' },
  ];

  // Filter paralegals based on search
  const filteredParalegals = displayParalegals.filter(p => {
    if (!searchDistrict.trim()) return true;
    const searchLower = searchDistrict.toLowerCase();
    return (
      p.region.toLowerCase().includes(searchLower) ||
      p.district.toLowerCase().includes(searchLower) ||
      (p.ward && p.ward.toLowerCase().includes(searchLower)) ||
      p.fullName.toLowerCase().includes(searchLower)
    );
  });

  // Ref for scrolling to results
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);

    // Simulated AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Thank you for your question. Based on Tanzanian law, I can provide guidance on this matter. For specific legal action, I recommend connecting with one of our verified paralegals above.'
      }]);
    }, 1000);

    setChatInput('');
  };

  const getWhatsAppLink = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\s+/g, '').replace('+', '');
    return `https://wa.me/${cleanPhone}?text=Habari ${name}, I found you through LSF and need legal assistance.`;
  };

  const getPhoneLink = (phone: string) => `tel:${phone.replace(/\s+/g, '')}`;

  return (
    <Layout>
      {/* HERO - Premium Gradient with Floating Elements */}
      <div className="relative min-h-[90vh] bg-gradient-to-br from-primary via-primary to-blue-900 overflow-hidden flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-orange/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-teal/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full" />
          {/* Grid Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <Container className="relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 mb-8">
              <Sparkles className="h-4 w-4 text-secondary-orange animate-pulse" />
              <span className="text-sm font-medium">Tanzania's Largest Legal Aid Network</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
              Access Justice.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-orange via-yellow-400 to-secondary-teal">
                Anytime. Anywhere.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
              Connect with 4,000+ verified community paralegals or get instant answers from Sara, our AI legal assistant.
            </p>

            {/* Search Bar - Premium Style */}
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-secondary-orange via-secondary-teal to-primary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                <div className="relative flex gap-2 bg-white rounded-2xl p-2 shadow-2xl">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Enter your district or region..."
                      className="h-14 pl-12 pr-4 text-lg bg-transparent border-none focus:ring-0 text-gray-900"
                      value={searchDistrict}
                      onChange={(e) => setSearchDistrict(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    className="h-14 px-8 text-lg rounded-xl bg-primary hover:bg-primary/90"
                  >
                    <Search className="mr-2 h-5 w-5" />
                    Find Help
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mt-6 text-white/60 text-sm">
                <span className="flex items-center gap-2">
                  <Badge className="bg-green-500/20 text-green-400 border-none">4,000+</Badge>
                  Paralegals
                </span>
                <span className="flex items-center gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-none">31</Badge>
                  Regions
                </span>
                <span className="flex items-center gap-2">
                  <Badge className="bg-orange-500/20 text-orange-400 border-none">24/7</Badge>
                  AI Support
                </span>
              </div>
            </div>
          </div>
        </Container>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* PARALEGAL PROFILES SECTION - Premium Cards */}
      <section ref={resultsRef} className="py-24 bg-gray-50 relative overflow-hidden scroll-mt-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary-teal to-secondary-orange" />

        <Container>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
                <Users className="h-4 w-4" />
                Verified Professionals
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Meet Our Paralegals
              </h2>
              <p className="text-xl text-gray-600 max-w-xl">
                {searchDistrict ? (
                  <>Showing results for "<strong>{searchDistrict}</strong>" ({filteredParalegals.length} found)</>
                ) : (
                  'Real people, ready to help. Connect directly via WhatsApp or phone call.'
                )}
              </p>
            </div>
            <Link to="/paralegal-directory">
              <Button variant="outline" size="lg" className="gap-2 group">
                View All
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredParalegals.length > 0 ? filteredParalegals.map((paralegal) => (
              <Card key={paralegal._id} className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-3xl">
                {/* Card Header with Image */}
                <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary-teal/10">
                  {paralegal.photoUrl ? (
                    <img
                      src={paralegal.photoUrl}
                      alt={paralegal.fullName}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-gray-200">{paralegal.fullName.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Verified Badge */}
                  {paralegal.isVerified && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verified
                    </div>
                  )}

                  {/* Name & Location Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold truncate">{paralegal.fullName}</h3>
                    <p className="text-white/80 text-sm flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {paralegal.ward && `${paralegal.ward}, `}{paralegal.district}
                    </p>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Location Details */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Globe className="h-4 w-4" />
                    <span>{paralegal.region} Region</span>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {paralegal.specializations?.map((spec, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Languages */}
                  <p className="text-xs text-gray-400 mb-6">
                    Speaks: {paralegal.languages?.join(', ') || 'Swahili'}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <a
                      href={getWhatsAppLink(paralegal.phone, paralegal.fullName.split(' ')[0])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 gap-2">
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp
                      </Button>
                    </a>
                    <a href={getPhoneLink(paralegal.phone)}>
                      <Button variant="outline" className="h-12 w-12 rounded-xl p-0 border-2">
                        <Phone className="h-5 w-5" />
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No paralegals found</h3>
                <p className="text-gray-500 mb-6">Try searching for a different region or district</p>
                <Button onClick={() => setSearchDistrict('')} variant="outline">
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* SARA AI SECTION - Interactive Chat */}
      <section className="py-24 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        </div>

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Info */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                <Bot className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">AI-Powered Legal Assistant</span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Sara</span>
              </h2>

              <p className="text-xl text-gray-400 leading-relaxed">
                Get instant answers to your legal questions. Sara is trained on Tanzanian law and available 24/7 in both Swahili and English.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Sparkles className="h-5 w-5" />, label: 'Instant Answers' },
                  { icon: <Globe className="h-5 w-5" />, label: 'Swahili & English' },
                  { icon: <Shield className="h-5 w-5" />, label: 'Private & Secure' },
                  { icon: <Scale className="h-5 w-5" />, label: 'Tanzania Law' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="text-cyan-400">{item.icon}</div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Interactive Chat */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl" />
              <div className="relative bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
                {/* Chat Header */}
                <div className="flex items-center gap-4 p-6 border-b border-gray-800 bg-gray-900/50">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-cyan-500/30">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Sara AI</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Online now
                    </p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="h-80 overflow-y-auto p-6 space-y-4">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-200 rounded-bl-none'
                        }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Ask about your legal rights..."
                      className="flex-1 h-12 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-cyan-500"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 p-0"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* BECOME A PARALEGAL - Premium CTA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(249,115,22,0.1),transparent_50%)]" />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium mb-6">
              <Heart className="h-4 w-4" />
              Make a Difference
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Become a Community Paralegal
            </h2>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Join our network of 4,000+ changemakers. We provide training, certification, and ongoing support.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/paralegal-signup">
                <Button size="lg" className="h-16 px-10 text-lg rounded-2xl bg-secondary-orange hover:bg-secondary-orange/90 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all">
                  Apply Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/paralegal-login">
                <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-2xl border-2">
                  Paralegal Login
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* HAKI YANGU - Minimal Footer Strip */}
      <div className="bg-secondary-teal text-white py-5">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5" />
              <span className="font-medium">Get the Haki Yangu App</span>
            </div>
            <div className="flex gap-3">
              <a href="#" className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                <span className="text-sm">App Store</span>
              </a>
              <a href="#" className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors">
                <Download className="h-4 w-4" />
                <span className="text-sm">Play Store</span>
              </a>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default LegalHelp;
