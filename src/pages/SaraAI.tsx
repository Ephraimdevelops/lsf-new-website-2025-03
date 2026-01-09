import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from "sonner";
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from 'react-router-dom';
import {
  ArrowUp, Bot, RotateCcw, Home, Phone,
  Scale, Users, Heart, Sparkles, BookOpen, ThumbsUp, ThumbsDown
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

  // Admin check: Convex role OR email bypass (for dev when Clerk session fails)
  const ADMIN_EMAILS = ['designable2022@gmail.com', 'ephraba@gmail.com', 'admin@lsftz.org'];
  const isAdmin = convexUser?.role === 'admin' ||
    (user?.primaryEmailAddress?.emailAddress && ADMIN_EMAILS.includes(user.primaryEmailAddress.emailAddress));

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
    document.title = 'SARA AI - Legal Assistant | LSF';
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestedPrompts = [
    { icon: <Scale className="h-5 w-5" />, text: 'What are my land rights as a woman?', color: 'text-blue-600 bg-blue-50' },
    { icon: <Users className="h-5 w-5" />, text: 'Help me find a paralegal near me', color: 'text-green-600 bg-green-50' },
    { icon: <Heart className="h-5 w-5" />, text: 'I need help with domestic violence', color: 'text-red-600 bg-red-50' },
    { icon: <Sparkles className="h-5 w-5" />, text: 'Explain inheritance laws in Tanzania', color: 'text-purple-600 bg-purple-50' }
  ];

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setInputText('');
    setIsTyping(true);

    try {
      // We rely on the Action to save the User message to the DB
      // which will then auto-update via useQuery.
      // However, to prevent a "flash" of empty state, we could optimistically add it,
      // but for V1 let's trust the quick DB write.

      const responseText = await askSara({
        message: text.trim(),
        history: messages.slice(-10).map(m => ({
          role: m.sender,
          content: m.text
        }))
      });

      // We also verify if responseText was saved by checking if we need to do anything manually.
      // The action saves it, so we do nothing!

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
            <img src="/sara-avatar-v2.png" alt="SARA" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meet SARA</h1>
          <p className="text-gray-600 mb-2">Your Smart Legal Assistant</p>
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
                <img src="/sara-avatar-v2.png" alt="SARA" className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110" />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <h1 className="font-heading font-bold text-gray-900 text-lg flex items-center gap-2">
                SARA <span className="bg-gradient-to-r from-primary/10 to-purple-500/10 text-primary text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-bold border border-primary/10">AI Beta</span>
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
              <UserButton afterSignOutUrl="/sara" appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border-2 border-white shadow-sm hover:scale-105 transition-transform"
                }
              }} />
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
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 mx-auto mb-6 shadow-xl">
                  <img src="/sara-avatar-v2.png" alt="SARA" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Habari {user?.firstName || ''}! 👋
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  I'm SARA, your smart legal assistant. I've been trained on LSF's legal database to give you accurate, Tanzania-specific advice.
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
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border ${msg.sender === 'user' ? 'border-primary/20' : 'border-gray-200'}`}>
                        {msg.sender === 'user'
                          ? user?.imageUrl ? <img src={user.imageUrl} alt="User" /> : <span className="text-xs font-bold">{user?.firstName?.[0]}</span>
                          : <img src="/sara-avatar-v2.png" alt="SARA" />
                        }
                      </div>

                      <div className={`rounded-2xl px-5 py-3.5 shadow-sm text-[15px] leading-relaxed ${msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-sm prose-invert' // Inverse prose color for dark background
                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                        }`}>
                        <div className="prose prose-sm max-w-none break-words leading-relaxed">
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
                                              <div key={i} className="my-4 bg-blue-50 border border-blue-100 rounded-xl p-4 not-prose hover:shadow-md transition-all">
                                                <div className="flex items-start gap-3">
                                                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                                                    ⚖️
                                                  </div>
                                                  <div>
                                                    <h4 className="font-bold text-gray-900">{data.name}</h4>
                                                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                                                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                      Verified Paralegal
                                                    </div>
                                                    <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                                                      <span>📍 {data.region}</span>
                                                      <span>•</span>
                                                      <span>📞 {data.phone}</span>
                                                    </p>
                                                    <button className="mt-3 w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                                      Connect Now
                                                    </button>
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

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                    <img src="/sara-avatar-v2.png" alt="SARA" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <div className="flex gap-1.5">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white/90 backdrop-blur-xl p-6 pb-8 sticky bottom-0 z-20">
          <div className="max-w-3xl mx-auto">
            <div className={`relative bg-white rounded-3xl border-2 transition-all duration-300 shadow-sm ${isTyping ? 'border-primary/30 shadow-md ring-4 ring-primary/5' : 'border-gray-100 hover:border-gray-300'}`}>
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask SARA anything about Tanzanian law..."
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
                Check important info. SARA can make mistakes.
              </p>
            </div>
          </div>
        </div>
      </main >
    </div >
  );
};

export default SaraAIPage;
