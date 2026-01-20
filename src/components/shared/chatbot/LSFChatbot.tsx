import React, { useEffect, useMemo, useRef, useState } from "react";
import { Send, X, Phone, Mail, Clock, Heart, MessageCircle, Volume2, VolumeX, Scale, User, WifiOff, Shield, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../../convex/_generated/api";

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
    : "Welcome! I'm SARA from LSF. I'm here to help you understand your rights and connect you with suitable support. Let's start—what do you need today?");
}

// ==========================================
// LIABILITY DISCLAIMER MODAL COMPONENT
// ==========================================
interface DisclaimerModalProps {
  language: "swahili" | "english";
  onAccept: () => void;
  onDecline: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ language, onAccept, onDecline }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4 rounded-2xl"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <Shield className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">
              {language === "swahili" ? "Onyo Muhimu" : "Important Disclaimer"}
            </h3>
            <p className="text-sm text-gray-500">
              {language === "swahili" ? "Tafadhali soma kwa makini" : "Please read carefully"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              {language === "swahili"
                ? "SARA ni msaidizi wa AI na SIO wakili. Majibu yake ni kwa habari tu na hayapaswi kuchukuliwa kama ushauri wa kisheria."
                : "SARA is an AI assistant and NOT a lawyer. Her responses are for informational purposes only and should not be taken as legal advice."}
            </p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {language === "swahili"
              ? "Kwa ushauri wa kisheria rasmi, tafadhali wasiliana na paralegal au wakili aliyesajiliwa."
              : "For official legal advice, please contact a registered paralegal or lawyer."}
          </p>
        </div>

        {/* Checkbox Agreement */}
        <div className="flex items-start gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
          <Scale className="w-5 h-5 text-[var(--brand)] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            {language === "swahili"
              ? "Kwa kubofya 'Nakubali', ninakubali kwamba naelewa SARA ni AI na nitawasiliana na mtaalamu kwa ushauri wa kisheria."
              : "By clicking 'I Agree', I acknowledge that I understand SARA is an AI and I will consult a professional for legal advice."}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            {language === "swahili" ? "Sitaki" : "Decline"}
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-4 py-3 bg-[var(--brand)] text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
          >
            {language === "swahili" ? "Nakubali" : "I Agree"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ==========================================
// MAIN CHATBOT COMPONENT
// ==========================================

const LSFPersonalAssistant: React.FC<LSFPersonalAssistantProps> = ({
  forceOpen = false,
  fullPage = false,
  env,
  initialThreadId = null,
  language = "swahili",
}) => {
  const webhookUrl = getWebhookUrl(env);

  // Use the proper online status hook
  const isOnline = useOnlineStatus();

  // Liability disclaimer state
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState<boolean>(() => {
    // Check if already accepted in this session
    return sessionStorage.getItem('sara_disclaimer_accepted') === 'true';
  });

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



  // SYSTEM KILL SWITCH CHECK
  const systemStatus = useQuery(api.ops.getSystemStatus);
  const isMaintenance = systemStatus?.isMaintenance || false;

  // =====================================================
  // ANALYTICS: Session tracking and AI classification
  // =====================================================
  const logEvent = useMutation(api.analytics.logEvent);
  const classifyChat = useAction(api.analytics.classifyChat);
  const hasLoggedSession = useRef(false);
  const userMessageCount = useRef(0);
  const conversationTranscript = useRef<string[]>([]);

  const trackSessionStart = () => {
    if (!hasLoggedSession.current) {
      hasLoggedSession.current = true;
      logEvent({
        type: "sara_session_start",
        resourceId: threadId || `session-${Date.now()}`,
        resourceType: "sara_chat",
      });
    }
  };

  const triggerClassification = async () => {
    if (conversationTranscript.current.length >= 3) {
      try {
        const transcript = conversationTranscript.current.join("\n");
        await classifyChat({
          userId: "anonymous", // Will be replaced with actual user ID if authenticated
          transcript,
        });
        console.log("[ANALYTICS] Chat classified successfully");
      } catch (err) {
        console.error("[ANALYTICS] Classification failed:", err);
      }
    }
  };

  // Trigger classification when chat closes or unmounts
  useEffect(() => {
    return () => {
      // Trigger classification on component unmount (chat close)
      if (userMessageCount.current >= 3) {
        triggerClassification();
      }
    };
  }, []);
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current && hasAcceptedDisclaimer) {
      inputRef.current.focus();
    }
  }, [isOpen, hasAcceptedDisclaimer]);

  useEffect(() => {
    if (inputText.trim() !== "" || messages.some(m => m.sender === "user" && m.id.startsWith("u-"))) {
      setShowQuickActions(false);
    }
  }, [inputText, messages]);

  const handleAcceptDisclaimer = () => {
    sessionStorage.setItem('sara_disclaimer_accepted', 'true');
    setHasAcceptedDisclaimer(true);
  };

  const handleDeclineDisclaimer = () => {
    setIsOpen(false);
  };

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGIcCz2b3u+/cSEEKIHN7tWFNwgZaLvt559NEAxQp+PwtmIcBjiR2O/NeSsFJHfH8N+PPwhUorHo7aJVFApGn+DywGIcCz2b3e6/cSAEKYDN7tWFNwkZZ7zs56BODwxPqeHttmMcBjiS2O/NeSsFJHfH8N+PPg=="
    );
    audio.volume = 0.25;
    audio.play().catch(() => { });
  };

  const sendMessageToAPI = async (messageText: string) => {
    // Check if online
    if (!isOnline) {
      setMessages(prev => [
        ...prev,
        {
          id: `offline-${Date.now()}`,
          text: language === "swahili"
            ? "Samahani, huna muunganisho wa intaneti. Tafadhali jaribu tena baadaye."
            : "Sorry, you are offline. Please try again later.",
          sender: "assistant",
          timestamp: new Date()
        },
      ]);
      return;
    }

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
      playNotificationSound();
    } catch {
      setMessages(prev => [
        ...prev,
        { id: `err-${Date.now()}`, text: language === "swahili" ? "Samahani, kumetokea hitilafu ya kiufundi. Tafadhali jaribu tena." : "Sorry, a technical error occurred. Please try again.", sender: "assistant", timestamp: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!isOnline) return;
    if (!hasAcceptedDisclaimer) return;

    const trimmed = inputText.trim();
    if (!trimmed) return;

    // =====================================================
    // ANALYTICS: Track first message as session start
    // =====================================================
    trackSessionStart();
    userMessageCount.current++;
    conversationTranscript.current.push(`User: ${trimmed}`);

    // Trigger classification after 5 user messages (background)
    if (userMessageCount.current === 5) {
      triggerClassification();
    }
    // =====================================================

    setMessages(prev => [...prev, { id: `u-${Date.now()}`, text: trimmed, sender: "user", timestamp: new Date() }]);
    setInputText("");
    setShowQuickActions(false);
    sendMessageToAPI(trimmed);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleQuickAction = (text: string) => {
    if (!isOnline || !hasAcceptedDisclaimer) return;
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
            className="bg-white w-full max-w-[36rem] h-[46rem] flex flex-col shadow-xl rounded-2xl border border-gray-100 overflow-hidden relative"
          >
            {/* MAINTENANCE MODE OVERLAY */}
            {isMaintenance && (
              <div className="absolute inset-0 z-[60] bg-white flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === "swahili" ? "Mfumo Unafanyiwa Maboresho" : "System Maintenance"}
                </h2>
                <p className="text-gray-600 max-w-sm mb-6">
                  {language === "swahili"
                    ? "SARA imezimwa kwa muda kwa ajili ya maboresho. Tafadhali jaribu tena baadaye au piga simu kituo cha msaada."
                    : "SARA is currently offline for scheduled maintenance. Please try again later or contact our support hotline."}
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {language === "swahili" ? "Funga" : "Close"}
                </button>
              </div>
            )}

            {/* DISCLAIMER MODAL - Shows first */}
            <AnimatePresence>
              {!hasAcceptedDisclaimer && (
                <DisclaimerModal
                  language={language}
                  onAccept={handleAcceptDisclaimer}
                  onDecline={handleDeclineDisclaimer}
                />
              )}
            </AnimatePresence>

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

            {/* Enhanced Offline Indicator */}
            <AnimatePresence>
              {!isOnline && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-yellow-500 text-black px-4 py-3 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <WifiOff className="w-5 h-5" />
                  <span>
                    {language === "swahili"
                      ? "Mtandao haupo - SARA hawezi kujibu"
                      : "You are offline - SARA cannot respond"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

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
                    className={`max-w-[75%] px-4 py-3 rounded-xl shadow-sm ${msg.sender === "user"
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
              {showQuickActions && hasAcceptedDisclaimer && (
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
                      disabled={!isOnline}
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-white hover:bg-gray-100 shadow-sm border border-gray-200 transition-colors ${!isOnline ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
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
                placeholder={
                  !hasAcceptedDisclaimer
                    ? (language === "swahili" ? "Tafadhali kubali onyo kwanza..." : "Please accept disclaimer first...")
                    : !isOnline
                      ? (language === "swahili" ? "Mtandao haupo..." : "You are offline...")
                      : (language === "swahili" ? "Andika swali lako hapa..." : "Type your question here...")
                }
                disabled={!hasAcceptedDisclaimer || !isOnline}
                className={`flex-1 border border-gray-200 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400 ${(!hasAcceptedDisclaimer || !isOnline) ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
              />
              <motion.button
                onClick={handleSend}
                whileHover={{ scale: isOnline && hasAcceptedDisclaimer ? 1.02 : 1 }}
                whileTap={{ scale: isOnline && hasAcceptedDisclaimer ? 0.98 : 1 }}
                disabled={!isOnline || !hasAcceptedDisclaimer}
                className={`px-4 py-3 rounded-xl shadow-sm ${isOnline && hasAcceptedDisclaimer
                  ? 'bg-[var(--brand)] text-white hover:shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {!isOnline ? <WifiOff className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LSFPersonalAssistant;