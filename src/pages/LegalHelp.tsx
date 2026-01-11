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
import HakiYanguChatbot from '@/components/haki-yangu/HakiYanguChatbot';
import SaraAISection from '@/components/legal-help/SaraAISection';
import HakiYanguAppSection from '@/components/legal-help/HakiYanguAppSection';

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
      {/* HERO - Simplified & Accessible (Brand Aligned) */}
      <div className="relative min-h-[85vh] bg-primary flex flex-col items-center justify-center overflow-hidden py-20 pb-0">
        {/* Brand Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img src="/pattern-bg.png" alt="" className="w-full h-full object-cover" />
        </div>

        {/* Gradient Overlay for Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/90 pointer-events-none" />

        <Container className="relative z-10 w-full max-w-4xl px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
              Pata Msaada wa Kisheria.
              <span className="block text-secondary-orange mt-2">Haraka na Uhakika.</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-medium">
              Find verified paralegals in your district or chat with Sara AI for instant legal guidance.
            </p>
          </div>

          {/* SEARCH COMPONENT - High Contrast & Simple */}
          <div className="bg-white rounded-t-3xl p-4 md:p-6 shadow-2xl mx-auto relative z-20 translate-y-2">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Location Input */}
              <div className="flex-1">
                <label className="block text-gray-900 font-bold text-sm uppercase tracking-wide mb-2 pl-1">
                  Unatafuta wapi? (Location)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                  <Input
                    placeholder="Mkoa au Wilaya (Region/District)"
                    className="h-16 pl-14 text-lg bg-gray-50 border-2 border-gray-100 focus:border-primary rounded-xl text-gray-900 placeholder:text-gray-500"
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                  />
                </div>
              </div>

              {/* Topic Input */}
              <div className="flex-1">
                <label className="block text-gray-900 font-bold text-sm uppercase tracking-wide mb-2 pl-1">
                  Shida ni nini? (Issue)
                </label>
                <div className="relative">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
                  <Input
                    placeholder="Weka tatizo (mf. Ardhi, Mirathi)"
                    className="h-16 pl-14 text-lg bg-gray-50 border-2 border-gray-100 focus:border-primary rounded-xl text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="md:pt-8 w-full md:w-auto">
                <Button
                  onClick={handleSearch}
                  className="w-full md:w-auto h-16 px-10 text-xl font-bold rounded-xl bg-secondary-orange hover:bg-orange-600 text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <Search className="h-6 w-6" />
                  <span className="md:hidden">TAFUTA</span>
                  <span className="hidden md:inline">TAFUTA</span>
                </Button>
              </div>
            </div>

            {/* Quick Tags - Simple Pills Inside Card for Connection */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
              <span className="text-gray-500 font-medium text-sm">Common Topics:</span>
              {['Ardhi (Land)', 'Mirathi (Inheritance)', 'Ndoa (Marriage)', 'Ajira (Labor)'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-bold hover:bg-primary hover:text-white transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* PARALEGAL DIRECTORY SECTION */}
      <section ref={resultsRef} className="py-24 bg-gray-50 relative pt-32">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-3">
                <Users className="h-4 w-4" />
                <span>Verified Directory</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Find a Paralegal Near You</h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Browse our directory of {paralegals?.length || '4,000+'} verified community paralegals across 168 districts. They are trained, certified, and ready to assist with your legal needs.
              </p>
            </div>

            {/* Filter/Sort Controls could go here */}
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2 rounded-xl border-gray-200">
                <Globe className="h-4 w-4" />
                All Regions
              </Button>
              <Button variant="outline" className="gap-2 rounded-xl border-gray-200">
                <Bot className="h-4 w-4" />
                Specialization
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredParalegals.length > 0 ? filteredParalegals.map((paralegal) => (
              <Card key={paralegal._id} className="group bg-white border-0 shadow-sm hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden ring-1 ring-gray-100">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden ring-4 ring-white shadow-lg">
                        {paralegal.photoUrl ? (
                          <img
                            src={paralegal.photoUrl || "/lovable-uploads/placeholder.svg"}
                            alt={paralegal.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary text-2xl font-bold">
                            {paralegal.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      {paralegal.isVerified && (
                        <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-sm">
                          <BadgeCheck className="h-5 w-5 text-blue-500 fill-blue-500/10" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{paralegal.fullName}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        {paralegal.ward ? `${paralegal.ward}, ` : ''}{paralegal.district}
                      </div>
                      <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-none">
                        Community Paralegal
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3 text-sm">
                      <Scale className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider font-medium mb-1">Specializes In</span>
                        <div className="flex flex-wrap gap-1.5">
                          {paralegal.specializations?.slice(0, 3).map((spec, i) => (
                            <span key={i} className="inline-block px-2 py-0.5 bg-gray-100 rounded text-gray-700 text-xs font-medium">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                      <div>
                        <span className="text-gray-500 block text-xs uppercase tracking-wider font-medium">Languages</span>
                        <span className="text-gray-900 font-medium">{paralegal.languages?.join(', ') || 'Swahili'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={getWhatsAppLink(paralegal.phone, paralegal.fullName.split(' ')[0])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-medium shadow-green-500/20 shadow-lg">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        WhatsApp
                      </Button>
                    </a>
                    <a href={getPhoneLink(paralegal.phone)} className="flex-1">
                      <Button variant="outline" className="w-full border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Now
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No paralegals found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search terms or location.</p>
                <Button onClick={() => setSearchDistrict('')} variant="outline" className="rounded-xl">
                  Clear Search Filters
                </Button>
              </div>
            )}
          </div>

        </Container>
      </section>

      {/* 1. SARA AI */}
      <SaraAISection />

      {/* 2. HAKI YANGU APP */}
      <HakiYanguAppSection />

      {/* 3. WHATSAPP BOT */}
      <HakiYanguChatbot />


      <section className="py-20 bg-primary overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <img src="/pattern-bg.png" className="w-full h-full object-cover" alt="" />
        </div>
        <Container className="relative z-10 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Are you a Legal Professional?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
            Join the LSF network to access training, resources, and connect with clients who need your expertise.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/paralegal-signup">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold rounded-full px-8">
                Join as Paralegal
              </Button>
            </Link>
            <Link to="/paralegal-login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8">
                Portal Login
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </Layout>
  );
};

export default LegalHelp;
