import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Minimize, X, Phone, Mail, Clock, Heart, MessageCircle, Volume2, VolumeX, Scale } from 'lucide-react';

interface LSFPersonalAssistantProps {
  forceOpen?: boolean;
  fullPage?: boolean;
}

const LSFPersonalAssistant = ({ forceOpen = false, fullPage = false }: LSFPersonalAssistantProps) => {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [threadId, setThreadId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi there! I'm your personal legal support assistant from LSF. I'm here to listen, understand your situation, and guide you toward the help you need. What's on your mind today?",
      sender: 'assistant',
      timestamp: new Date(),
      typing: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { text: "I need legal advice", icon: <Scale className="w-4 h-4" /> },
    { text: "Report a legal issue", icon: <Mail className="w-4 h-4" /> },
    { text: "Connect with a lawyer", icon: <Phone className="w-4 h-4" /> },
    { text: "Emergency legal help", icon: <Heart className="w-4 h-4" /> },
    { text: "Check my case status", icon: <Clock className="w-4 h-4" /> },
    { text: "Schedule consultation", icon: <User className="w-4 h-4" /> }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const playNotificationSound = () => {
    if (soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvGIcCz2b3u+/cSEEKIHN7tWFNwgZaLvt559NEAxQp+PwtmIcBjiR2O/NeSsFJHfH8N+PPwhUorHo7aJVFApGn+DywGIcCz2b3e6/cSAEKYDN7tWFNwkZZ7zs56BODwxPqeHttmMcBjiS2O/NeSsFJHfH8N+PPg==');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const sendMessageToAPI = async (messageText) => {
    setIsTyping(true);
    try {
      const requestBody: any = {
        message: messageText,
        timestamp: new Date().toISOString()
      };
      if (threadId) {
        requestBody.threadId = threadId;
      }
      const response = await fetch('https://lsfai.app.n8n.cloud/webhook-test/43fc1f39-c9ef-4313-afce-c266d0cd81b5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      if (data.threadId && !threadId) {
        setThreadId(data.threadId);
      }
      const assistantMessage = {
        id: Date.now().toString(),
        text: data.output || data.response || data.message || "I understand you're reaching out for help. Let me connect you with the right resources. Could you tell me a bit more about your situation?",
        sender: 'assistant',
        timestamp: new Date(),
        typing: false
      };
      setMessages(prev => [...prev, assistantMessage]);
      playNotificationSound();
    } catch (error) {
      const errorMessage = {
        id: Date.now().toString(),
        text: "I'm having some technical difficulties right now, but I'm still here for you. Please try reaching out again, or you can contact our office directly. Your concerns are important to us.",
        sender: 'assistant',
        timestamp: new Date(),
        typing: false
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsOnline(false);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        sender: 'user',
        timestamp: new Date(),
        typing: false
      };
      
      setMessages(prev => [...prev, newMessage]);
      const messageToSend = inputText;
      setInputText('');
      sendMessageToAPI(messageToSend);
    }
  };

  const handleQuickAction = (actionText) => {
    const newMessage = {
      id: Date.now().toString(),
      text: actionText,
      sender: 'user',
      timestamp: new Date(),
      typing: false
    };
    
    setMessages(prev => [...prev, newMessage]);
    sendMessageToAPI(actionText);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={fullPage ? "w-full" : "fixed bottom-4 right-4 z-50 font-sans"}>
      {/* Chat Window */}
      {(isOpen || forceOpen) && (
        <div className={fullPage
          ? "w-full max-w-2xl mx-auto h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          : "mb-4 w-96 h-[650px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        }>
          {/* Header */}
          <div className="bg-gradient-to-r from-red-900 to-red-800 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Sarah Williams</h3>
                <div className="flex items-center space-x-1 text-sm text-white/90">
                  <div className={`w-2 h-2 ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'} rounded-full`}></div>
                  <span>{isOnline ? 'Available to help' : 'Reconnecting...'}</span>
                </div>
                <p className="text-xs text-white/70">Legal Support Specialist</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title={soundEnabled ? "Mute notifications" : "Enable notifications"}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                  }`}>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <span className="font-bold text-xs">S</span>}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{formatTime(message.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center">
                    <span className="font-bold text-xs">S</span>
                  </div>
                  <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">Sarah is typing</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-red-800 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-red-800 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-red-800 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 bg-white border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-3 font-medium">How can I help you today?</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.slice(0, 4).map((action) => (
                  <button
                    key={action.text}
                    onClick={() => handleQuickAction(action.text)}
                    className="flex items-center space-x-2 px-3 py-2 text-xs bg-red-50 text-red-800 rounded-lg hover:bg-red-100 transition-colors border border-red-200 font-medium"
                  >
                    {action.icon}
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Share what's on your mind..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent transition-all"
                  disabled={!isOnline}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputText.trim() || !isOnline}
                className="p-3 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-xl hover:from-red-800 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button (hide in fullPage/forceOpen mode) */}
      {!forceOpen && !fullPage && (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 h-16 bg-gradient-to-r from-red-900 to-red-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group relative"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <>
                <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
              </>
            )}
          </button>

          {/* Personal Assistant Info */}
          {!isOpen && (
            <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-lg p-4 w-72 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="text-sm">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Sarah Williams</div>
                    <div className="text-xs text-gray-600">Legal Support Specialist</div>
                  </div>
                </div>
                <div className="text-gray-600 mb-3 text-xs leading-relaxed">
                  "I'm here to listen and guide you through your legal concerns with care and understanding."
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4 text-red-800" />
                    <span>Available 24/7</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4 text-red-800" />
                    <span>Emergency: +255-XXX-XXXX</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Heart className="w-4 h-4 text-red-800" />
                    <span>Confidential & Supportive</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LSFPersonalAssistant;