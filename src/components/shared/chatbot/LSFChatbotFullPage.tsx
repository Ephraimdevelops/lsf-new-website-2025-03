import React from 'react';
import LSFPersonalAssistant from './LSFChatbot';

const LSFChatbotFullPage = () => {
  // Render the chatbot always open, without the popup button
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">LSF AI Legal Assistant</h1>
      <div className="bg-white rounded-xl shadow-lg p-4 min-h-[600px] flex flex-col">
        <LSFPersonalAssistant forceOpen fullPage />
      </div>
    </div>
  );
};

export default LSFChatbotFullPage;
