import React, { useEffect, useMemo, useRef, useState } from "react";
import { Send, X, Phone, Mail, Clock, Heart, MessageCircle, Volume2, VolumeX, Scale, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const designTokens = {
  colors: {
    primary: {
      50: "#fdf2f8",
      100: "#fce7f3",
      500: "#931E5C",
      600: "#7A184C",
      700: "#6B1542",
      900: "#4C0F2E",
    },
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      600: "#4B5563",
      700: "#374151",
    },
    success: "#22C55E",
    danger: "#DC2626",
    accent: "#F59E0B",
  }
};

type Message = {
  id: string;
  text: string;
  sender: "user" | "assistant" | "system";
  timestamp: Date;
};

interface LSFPersonalAssistantProps {
  forceOpen?: boolean;
  fullPage?: boolean;
  env?: "test" | "production";
  initialThreadId?: string | null;
  language?: "swahili" | "english";
}

function getWebhookUrl(env?: "test" | "production") {
  return env === "production"
    ? "https://lsfsaraai.app.n8n.cloud/webhook/webhook"
    : "https://lsfsaraai.app.n8n.cloud/webhook-test/webhook";
}

function pickAssistantText(data: any, language: "swahili" | "english"): string {
  if (!data) return "";
  const candidates = [data.output, data.response, data.message, data.text, data.reply, typeof data === "string" ? data : null].filter(Boolean);
  let text = candidates[0] ?? "";
  if (typeof text === "object") {
    try {
      if (text.message_content) return String(text.message_content);
      text = JSON.stringify(text);
    } catch {
      text = language === "swahili" 
        ? "Niko hapa kukusaidia. Tafadhali toa maelezo zaidi." 
        : "I'm here to help. Please provide more details.";
    }
  }
  if (typeof text === "string") {
    text = text.trim().replace(/^"+|"+$/g, "").replace(/^`{3}[\s\S]*?\n|`{3}$/g, "");
  }
  return text || (language === "swahili"
    ? "Karibu sana! Mimi ni SARA kutoka LSF. Nipo hapa kukusaidia kuelewa haki zako na kukuunganisha na msaada unaokufaa. Tuanzie—unahitaji nini leo?"
    : "Welcome! I’m SARA from LSF. I’m here to help you understand your rights and connect you with suitable support. Let’s start—what do you need today?");
}

const LSFPersonalAssistant: React.FC<LSFPersonalAssistantProps> = ({
  forceOpen = false,
  fullPage = false,
  env,
  initialThreadId = null,
  language = "swahili",
}) => {
  const webhookUrl = getWebhookUrl(env);

  const [isOpen, setIsOpen] = useState(forceOpen);
  const [threadId, setThreadId] = useState<string | null>(initialThreadId);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      text: pickAssistantText(null, language),
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const quickActions = useMemo(() => [
    { text: language === "swahili" ? "Nahitaji msaada wa kisheria" : "I need legal assistance", icon: <Scale className="w-4 h-4" /> },
    { text: language === "swahili" ? "Kuripoti tatizo la sheria" : "Report a legal issue", icon: <Mail className="w-4 h-4" /> },
    { text: language === "swahili" ? "Unganisha na paralegal wa karibu" : "Connect with a nearby paralegal", icon: <Phone className="w-4 h-4" /> },
    { text: language === "swahili" ? "Msaada wa dharura (GBV/usalama)" : "Emergency help (GBV/safety)", icon: <Heart className="w-4 h-4" /> },
    { text: language === "swahili" ? "Angalia hali ya kesi yangu" : "Check my case status", icon: <Clock className="w-4 h-4" /> },
    { text: language === "swahili" ? "Panga ushauri/kikao" : "Schedule advice/session", icon: <User className="w-4 h-4" /> },
  ], [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (inputText.trim() !== "" || messages.some(m => m.sender === "user" && m.id.startsWith("u-"))) {
      setShowQuickActions(false);
    }
  }, [inputText, messages]);

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGIcCz2b3u+/cSEEKIHN7tWFNwgZaLvt559NEAxQp+PwtmIcBjiR2O/NeSsFJHfH8N+PPwhUorHo7aJVFApGn+DywGIcCz2b3e6/cSAEKYDN7tWFNwkZZ7zs56BODwxPqeHttmMcBjiS2O/NeSsFJHfH8N+PPg=="
    );
    audio.volume = 0.25;
    audio.play().catch(() => {});
  };

  const sendMessageToAPI = async (messageText: string) => {
    setIsTyping(true);
    try {
      const body: Record<string, any> = { message: messageText, timestamp: new Date().toISOString(), language };
      if (threadId) body.threadId = threadId;

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      let data: any = null;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) data = await res.json();
      else data = { message: await res.text() };

      if (data.threadId && !threadId) setThreadId(String(data.threadId));

      const assistantMsg: Message = { id: `a-${Date.now()}`, text: pickAssistantText(data, language), sender: "assistant", timestamp: new Date() };
      setMessages(prev => [...prev, assistantMsg]);
      setIsOnline(true);
      playNotificationSound();
    } catch {
      setIsOnline(false);
      setMessages(prev => [
        ...prev,
        { id: `err-${Date.now()}`, text: language === "swahili" ? "Samahani, kumetokea hitilafu ya kiufundi. Tafadhali jaribu tena." : "Sorry, a technical error occurred. Please try again.", sender: "assistant", timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, text: trimmed, sender: "user", timestamp: new Date() }]);
    setInputText("");
    setShowQuickActions(false);
    sendMessageToAPI(trimmed);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleQuickAction = (text: string) => {
    setMessages(prev => [...prev, { id: `qa-${Date.now()}`, text, sender: "user", timestamp: new Date() }]);
    setShowQuickActions(false);
    sendMessageToAPI(text);
  };

  const formatTime = (date: Date) => new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={fullPage ? "w-full h-full" : "fixed bottom-6 right-6 z-50 font-sans"} style={{
      "--brand": designTokens.colors.primary[500],
      "--brand-600": designTokens.colors.primary[600],
      "--brand-700": designTokens.colors.primary[700],
      "--brand-900": designTokens.colors.primary[900],
      "--accent": designTokens.colors.accent,
    } as React.CSSProperties}>
      <AnimatePresence>
        {!fullPage && !isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            className="bg-white text-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl flex items-center gap-3 border border-gray-200"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <MessageCircle className="w-6 h-6 text-[var(--brand)]" />
            <span className="text-lg font-medium">Chat with SARA</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(fullPage || isOpen) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white w-full max-w-[36rem] h-[46rem] flex flex-col shadow-xl rounded-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header with Clean Design */}
            <div className="bg-white text-gray-800 px-6 py-4 flex justify-between items-center rounded-t-2xl border-b border-gray-100">
              <h2 className="font-semibold text-xl tracking-wide">Chat with SARA - LSF Assistant</h2>
              <div className="flex items-center gap-4">
                <button onClick={() => setSoundEnabled(!soundEnabled)} className="hover:opacity-80 transition-opacity">
                  {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-600" /> : <VolumeX className="w-5 h-5 text-gray-600" />}
                </button>
                {!fullPage && (
                  <button onClick={() => setIsOpen(false)} className="hover:opacity-80 transition-opacity">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Offline Indicator */}
            {!isOnline && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-danger/10 text-danger px-4 py-2 text-sm text-center"
              >
                {language === "swahili" ? "Offline - Angalia muunganisho wako wa intaneti." : "Offline - Check your internet connection."}
              </motion.div>
            )}

            {/* Messages with Cleaner Layout */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 30 : -30, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`flex items-start ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-xl shadow-sm ${
                      msg.sender === "user"
                        ? "bg-gray-200 text-gray-800"
                        : "bg-white text-gray-900 border border-gray-100"
                    }`}
                  >
                    <div className="text-base leading-relaxed">{msg.text}</div>
                    <div className="text-xs opacity-60 mt-1 text-right">{formatTime(msg.timestamp)}</div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  className="flex justify-start items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white px-4 py-2 rounded-xl shadow-sm flex gap-1">
                    <motion.span
                      initial={{ y: 0 }}
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                      className="w-2 h-2 bg-gray-300 rounded-full"
                    />
                    <motion.span
                      initial={{ y: 0 }}
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      className="w-2 h-2 bg-gray-300 rounded-full"
                    />
                    <motion.span
                      initial={{ y: 0 }}
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                      className="w-2 h-2 bg-gray-300 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions with Conditional Display */}
            <AnimatePresence>
              {showQuickActions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="px-6 py-3 border-t border-gray-100 flex flex-wrap gap-2 bg-gray-50"
                >
                  {quickActions.map((qa, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleQuickAction(qa.text)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white hover:bg-gray-100 shadow-sm border border-gray-200 transition-colors"
                    >
                      {qa.icon} {qa.text}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area with Enhanced Design */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3 bg-white rounded-b-2xl">
              <input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === "swahili" ? "Andika swali lako hapa..." : "Type your question here..."}
                className="flex-1 border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
              />
              <motion.button
                onClick={handleSend}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[var(--brand)] text-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LSFPersonalAssistant;