import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Send, User, X, Phone, Mail, Clock, Heart,
  MessageCircle, Volume2, VolumeX, Scale
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const designTokens = {
  colors: {
    primary: {
      50:  "#fdf2f8",
      100: "#fce7f3",
      500: "#931E5C",
      600: "#7A184C",
      700: "#6B1542",
      900: "#4C0F2E",
    },
    gray: {
      50:  "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      600: "#4B5563",
      700: "#374151",
    },
    success: "#22C55E",
    danger:  "#DC2626",
    accent:  "#F59E0B",
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
}

function getWebhookUrl(env?: "test" | "production") {
  const nodeEnv = process.env.NODE_ENV;
  const effectiveEnv = env ?? (nodeEnv === "production" ? "production" : "test");
  if (effectiveEnv === "production") {
    return "https://lsfsaraai.app.n8n.cloud/webhook/webhook";
  }
  return "https://lsfsaraai.app.n8n.cloud/webhook-test/webhook";
}

function pickAssistantText(data: any): string {
  if (!data) return "";
  const candidates = [
    data.output,
    data.response,
    data.message,
    data.text,
    data.reply,
    typeof data === "string" ? data : null,
  ].filter(Boolean);
  let text = candidates[0] ?? "";
  if (typeof text === "object") {
    try {
      if (text.message_content) return String(text.message_content);
      text = JSON.stringify(text);
    } catch {
      text = "I'm here to help. Could you share a bit more?";
    }
  }
  if (typeof text === "string") {
    text = text.trim().replace(/^"+|"+$/g, "").replace(/^`{3}[\s\S]*?\n|`{3}$/g, "");
  }
  return text || "I’m here to help. Could you share a bit more about your situation?";
}

const LSFPersonalAssistant: React.FC<LSFPersonalAssistantProps> = ({
  forceOpen = false,
  fullPage = false,
  env,
  initialThreadId = null,
}) => {
  const webhookUrl = getWebhookUrl(env);

  const [isOpen, setIsOpen] = useState(forceOpen);
  const [threadId, setThreadId] = useState<string | null>(initialThreadId);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      text:
        "Karibu sana! Mimi ni SARA kutoka LSF. Nipo hapa kukusaidia kuelewa haki zako na kukuunganisha na msaada unaokufaa. Tuanzie hapa—ni kipi unahitaji leo?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickActions = useMemo(
    () => [
      { text: "Nahitaji msaada wa kisheria", icon: <Scale className="w-4 h-4" /> },
      { text: "Kuripoti tatizo la sheria", icon: <Mail className="w-4 h-4" /> },
      { text: "Unganisha na paralegal wa karibu", icon: <Phone className="w-4 h-4" /> },
      { text: "Msaada wa dharura (GBV/usalama)", icon: <Heart className="w-4 h-4" /> },
      { text: "Angalia hali ya kesi yangu", icon: <Clock className="w-4 h-4" /> },
      { text: "Panga ushauri/kikao", icon: <User className="w-4 h-4" /> },
    ],
    []
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
      const body: Record<string, any> = {
        message: messageText,
        timestamp: new Date().toISOString(),
      };
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

      const clean = pickAssistantText(data);
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        text: clean,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsOnline(true);
      playNotificationSound();
    } catch (e) {
      setIsOnline(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          text: "Samahani, kumetokea hitilafu ya kiufundi. Tafadhali jaribu tena.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    sendMessageToAPI(trimmed);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (text: string) => {
    const userMsg: Message = {
      id: `qa-${Date.now()}`,
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    sendMessageToAPI(text);
  };

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={fullPage ? "w-full" : "fixed bottom-4 right-4 z-50 font-sans"}
      style={{
        "--brand": designTokens.colors.primary[500],
        "--brand-600": designTokens.colors.primary[600],
        "--brand-700": designTokens.colors.primary[700],
        "--brand-900": designTokens.colors.primary[900],
        "--accent": designTokens.colors.accent,
      } as React.CSSProperties}
    >
      <AnimatePresence>
        {(fullPage || isOpen) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25 }}
            className="bg-white w-[28rem] h-[36rem] flex flex-col shadow-2xl rounded-2xl border border-gray-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[var(--brand)] text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src="/lovable-uploads/3.png"
                  alt="Sara"
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <div>
                  <h2 className="font-semibold text-lg">Sara</h2>
                  <p className="text-xs opacity-90">{isOnline ? "Online" : "Offline"}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSoundEnabled((s) => !s)}
                  className="hover:opacity-80"
                >
                  {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                {!fullPage && (
                  <button onClick={() => setIsOpen(false)} className="hover:opacity-80">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] text-base shadow-sm leading-relaxed ${{
                      user: "bg-[var(--brand)] text-white rounded-br-none",
                      assistant: "bg-white text-gray-800 rounded-bl-none border",
                      system: "bg-gray-100 text-gray-600 italic",
                    }[m.sender]}`}
                  >
                    <p>{m.text}</p>
                    <span className="block text-[10px] mt-1 opacity-70 text-right">
                      {formatTime(m.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2 px-4 py-3 border-t bg-white">
              {quickActions.map((qa) => (
                <button
                  key={qa.text}
                  onClick={() => handleQuickAction(qa.text)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  {qa.icon}
                  <span>{qa.text}</span>
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-white flex items-center space-x-2">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Andika ujumbe…"
                className="flex-1 px-4 py-2 text-base border rounded-full focus:outline-none focus:ring"
              />
              <button
                onClick={handleSend}
                className="bg-[var(--brand)] text-white p-3 rounded-full hover:bg-[var(--brand-700)] transition"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!fullPage && !isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setIsOpen(true)}
          className="bg-[var(--brand)] text-white p-4 rounded-full shadow-xl hover:bg-[var(--brand-700)]"
        >
          <MessageCircle className="w-7 h-7" />
        </motion.button>
      )}
    </div>
  );
};

export default LSFPersonalAssistant;