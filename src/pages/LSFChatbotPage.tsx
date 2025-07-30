import React from 'react';
import LSFPersonalAssistant from '@/components/shared/chatbot/LSFChatbot';

const LSFChatbotPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-secondary-teal/10">
      <div className="w-full max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">SARA AI Legal Assistant</h1>
        <div className="bg-white rounded-xl shadow-lg p-4 min-h-[600px] flex flex-col">
          <LSFPersonalAssistant fullPage />
        </div>
      </div>
    </div>
  );
};

export default LSFChatbotPage;
