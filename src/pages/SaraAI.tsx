import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from "sonner";
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from 'react-router-dom';
import {
  ArrowUp, Bot, RotateCcw, Home, Phone,
  Scale, Users, Heart, Sparkles, BookOpen, ThumbsUp, ThumbsDown, LogOut, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

const SaraAIPage = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const askSara = useAction(api.sara_actions.ask);
  const clearHistory = useMutation(api.sara_chat.clearHistory);
  const history = useQuery(api.sara_chat.getMessages);
  const convexUser = useQuery(api.users.current);
  const submitFeedback = useMutation(api.sara_chat.submitFeedback);

  // Admin check: server-side Convex role only
  const isAdmin = convexUser?.role === 'admin';

  // Use history from DB, fallback to empty array
  // We can add a local "optimistic" message if needed, but let's try pure DB sync first for simplicity
  const messages = history ? history.map(msg => ({
    id: msg._id,
    text: msg.content,
    sender: msg.role as 'user' | 'assistant',
    timestamp: new Date(msg.timestamp)
  })) : [];

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.title = 'Saada - LSF Legal Assistant';
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestedPrompts = [
    { icon: <Scale className="h-5 w-5" />, text: 'What are my land rights as a woman?', color: 'text-blue-600 bg-blue-50' },
    { icon: <Users className="h-5 w-5" />, text: 'Help me find a paralegal near me', color: 'text-green-600 bg-green-50' },
    { icon: <Heart className="h-5 w-5" />, text: 'I need help with domestic violence', color: 'text-red-600 bg-red-50' },
    { icon: <Sparkles className="h-5 w-5" />, text: 'Explain inheritance laws in Tanzania', color: 'text-purple-600 bg-purple-50' }
  ];

  const sendMessageMutation = useMutation(api.sara_chat.sendMessage);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    if (!isSignedIn) {
      toast.error("Please sign in to chat with Saada.");
      return;
    }

    setInputText('');
    setIsTyping(true);

    try {
      // 1. Instantly save user message to DB
      await sendMessageMutation({ content: text.trim() });

      // 2. Trigger AI Action (Background)
      // We don't need to await the result for UI updates, but we await to catch errors
      await askSara({
        message: text.trim(),
        history: messages.slice(-10).map(m => ({
          role: m.sender,
          content: m.text
        })),
        source: "web",
      });

    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const resetChat = async () => {
    if (confirm("Are you sure you want to clear your chat history?")) {
      await clearHistory();
    }
  };

  // Not signed in
  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url('/lovable-uploads/brand-pattern.png')",
            backgroundSize: '100px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="relative bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-6">
            <img src="/sara-avatar-v2.png" alt="Saada" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meet Saada</h1>
          <p className="text-gray-600 mb-2">Your Official Legal Assistant</p>
          <p className="text-sm text-gray-500 mb-8">
            Expert legal guidance on Tanzanian law. Trained on LSF knowledge base.
          </p>

          <SignInButton mode="modal">
            <button className="w-full bg-primary text-white font-bold py-4 px-8 rounded-full text-lg hover:bg-primary/90 transition-colors mb-4">
              Sign In to Chat
            </button>
          </SignInButton>

          <Link to="/" className="text-primary hover:underline text-sm">
            ← Back to LSF Website
          </Link>
        </div>
      </div>
    );
  }

  // Signed in
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      {/* Modern Header */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-xl sticky top-0 z-20 shadow-sm transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                <img src="/sara-avatar-v2.png" alt="Saada" className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110" />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <h1 className="font-heading font-bold text-gray-900 text-lg flex items-center gap-2">
                Saada <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border border-primary/10">LSF Assistant</span>
              </h1>
              <div className="flex items-center gap-1.5 opacity-60">
                <p className="text-xs font-medium text-gray-500">Online & Ready to help</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link to="/sara/train" className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 hover:text-primary bg-gray-50 hover:bg-primary/5 rounded-full transition-all border border-transparent hover:border-primary/10">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Train</span>
              </Link>
            )}

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            {messages.length > 0 && (
              <button
                onClick={resetChat}
                className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                title="Start New Chat"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            )}

            <Link to="/" className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all duration-300" title="Back Home">
              <Home className="h-5 w-5" />
            </Link>

            <div className="ml-2">
              {/* Custom Avatar using Convex data for consistency */}
              <div className="relative group">
                <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-primary/50">
                  {convexUser?.imageUrl || user?.imageUrl ? (
                    <img src={convexUser?.imageUrl || user?.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                      {user?.firstName?.[0] || 'U'}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-8">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto mb-6 flex justify-center w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img src="/sara-avatar-v2.png" alt="Saada" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Karibu {user?.firstName || ''}! 👋
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Naitwa Saada. Nimeboreshwa zaidi ili kukusaidia kuelewa sheria za Tanzania kwa lugha rahisi na kupata msaada wa kisheria.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(prompt.text)}
                      className={`flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all text-left group ${prompt.color}`}
                    >
                      <div className="shrink-0">{prompt.icon}</div>
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">{prompt.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border ${msg.sender === 'user' ? 'border-primary/20 bg-gray-100' : 'border-transparent'}`}>
                        {msg.sender === 'user'
                          ? (convexUser?.imageUrl || user?.imageUrl) ? <img src={convexUser?.imageUrl || user?.imageUrl} alt="User" className="w-full h-full object-cover" /> : <span className="text-xs font-bold">{user?.firstName?.[0]}</span>
                          : <img src="/sara-avatar-v2.png" alt="Saada" className="w-full h-full object-cover" />
                        }
                      </div>

                      <div className={`rounded-2xl px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-sm prose-invert' // Inverse prose color for dark background
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                        }`}>
                        <div className="prose prose-sm max-w-none break-words leading-relaxed">
                          {!msg.text && msg.sender === 'assistant' ? (
                            <div className="flex items-center gap-1.5 h-6 text-gray-400">
                              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse"></span>
                              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse delay-150"></span>
                              <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse delay-300"></span>
                            </div>
                          ) : (
                            <ReactMarkdown
                              components={{

                                p: ({ node, children }) => {
                                  // Check if children is a string and contains our marker
                                  if (typeof children === 'string' && children.includes('::PARALEGAL_CARD:')) {
                                    try {
                                      const parts = children.split(/(::PARALEGAL_CARD:.*?::)/g);
                                      return (
                                        <span>
                                          {parts.map((part, i) => {
                                            if (part.startsWith('::PARALEGAL_CARD:')) {
                                              const jsonStr = part.replace('::PARALEGAL_CARD:', '').replace('::', '');
                                              const data = JSON.parse(jsonStr);
                                              return (
                                                <div key={i} className="my-4 bg-white border border-primary/20 rounded-xl p-4 not-prose hover:shadow-md transition-all relative overflow-hidden group">
                                                  <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
                                                  <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl shrink-0">
                                                      ⚖️
                                                    </div>
                                                    <div>
                                                      <h4 className="font-bold text-gray-900 leading-snug">{data.name}</h4>
                                                      <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                        Verified LSF Partner
                                                      </div>
                                                      <div className="mt-3 space-y-1">
                                                        <p className="text-sm text-gray-700 flex items-center gap-2">
                                                          <span className="text-gray-400 text-xs">📍</span> {data.district}, {data.region}
                                                        </p>
                                                        <p className="text-sm text-gray-700 flex items-center gap-2">
                                                          <span className="text-gray-400 text-xs">📞</span> {data.phone}
                                                        </p>
                                                      </div>
                                                      <a href={`tel:${data.phone}`} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-white bg-primary px-3 py-1.5 rounded-full hover:bg-primary-dark transition-colors">
                                                        <Phone className="w-3 h-3" /> Call Now
                                                      </a>
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            }
                                            return part;
                                          })}
                                        </span>
                                      );
                                    } catch (e) {
                                      return <p>{children}</p>;
                                    }
                                  }
                                  return <p>{children}</p>;
                                }
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          )}
                        </div>

                        {/* Feedback buttons for assistant messages */}
                        {msg.sender === 'assistant' && (
                          <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                            <button
                              onClick={() => submitFeedback({ messageId: msg.id as any, rating: 'positive' })}
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Helpful"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => submitFeedback({ messageId: msg.id as any, rating: 'negative' })}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Not helpful"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {
                isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border-transparent">
                      <img src="/sara-avatar-v2.png" alt="Saada" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                      <div className="flex gap-1.5">
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      </div>
                    </div>
                  </motion.div>
                )
              }
              <div ref={messagesEndRef} />
            </div >
          </div >
        </div >

        <div className="border-t border-gray-100 bg-white/90 backdrop-blur-xl p-6 pb-8 sticky bottom-0 z-20">
          <div className="max-w-3xl mx-auto">
            <div className={`relative bg-white rounded-3xl border-2 transition-all duration-300 shadow-sm ${isTyping ? 'border-primary/30 shadow-md ring-4 ring-primary/5' : 'border-gray-100 hover:border-gray-300'}`}>
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Saada anything about Tanzanian law..."
                rows={1}
                className="w-full bg-transparent px-6 py-4 pr-16 resize-none focus:outline-none text-gray-900 placeholder-gray-400 font-medium min-h-[64px] max-h-[200px] rounded-3xl"
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isTyping}
                className={`absolute right-2 bottom-2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${inputText.trim() && !isTyping
                  ? 'bg-gradient-to-tr from-primary to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform scale-100'
                  : 'bg-gray-100 text-gray-300 scale-95 cursor-not-allowed'
                  }`}
              >
                {isTyping ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <ArrowUp className="h-6 w-6" />
                )}
              </button>
            </div>

            <div className="flex justify-center items-center gap-4 mt-3">
              <p className="text-[10px] text-gray-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-purple-400" />
                Powered by LSF Intelligence
              </p>
              <span className="text-gray-300 text-[10px]">•</span>
              <p className="text-[10px] text-gray-400">
                Check important info. Saada can make mistakes.
              </p>
            </div>
          </div>
        </div>
      </main >
    </div >
  );
};

export default SaraAIPage;
