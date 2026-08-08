import React, { useState, useRef, useEffect } from 'react';

export default function ChatPanel({ chatMessages = [], onSendMessage, chatLoading = false, chatError = null }) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, chatLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim() && !chatLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChipClick = (suggestion) => {
    if (!chatLoading) {
      onSendMessage(suggestion);
    }
  };

  return (
    <div className="sticky top-[88px] flex flex-col h-[calc(100vh-120px)] bg-surface-container-lowest rounded-xl border border-outline-variant shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="p-md border-b border-outline-variant bg-surface flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          </div>
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface leading-tight">
              Modify Your Plan
            </h3>
            <span className="text-label-md font-label-md text-secondary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-secondary"></span> Planner AI Active
            </span>
          </div>
        </div>
        <button className="text-outline hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>

      {/* Inline Error Banner */}
      {chatError && (
        <div className="p-xs px-md bg-error-container text-on-error-container text-code-sm flex items-center justify-between border-b border-error/20">
          <span>⚠️ {chatError}</span>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-md flex flex-col gap-md custom-scrollbar bg-[#f8fafc]/50 relative">
        {/* Ambient background element */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ 
            backgroundImage: 'radial-gradient(circle at 50% 50%, #4f46e5 1px, transparent 1px)', 
            backgroundSize: '20px 20px' 
          }}
        ></div>

        {chatMessages.map((msg, index) => {
          if (msg.role === 'system_action') {
            return (
              <div key={msg.id || index} className="mx-auto my-xs max-w-[90%] w-full relative z-10">
                <div className="bg-[#f0fdf4] border border-[#86efac] rounded-lg p-xs px-sm flex items-center justify-center gap-2 shadow-sm">
                  <span className="material-symbols-outlined text-[#166534] text-[16px]">check_circle</span>
                  <span className="text-[#166534] font-label-md text-label-md">{msg.text}</span>
                </div>
              </div>
            );
          }

          const isUser = msg.role === 'user';

          return (
            <div 
              key={msg.id || index} 
              className={`flex gap-sm max-w-[85%] relative z-10 ${isUser ? 'self-end' : ''}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[14px] text-on-surface-variant">smart_toy</span>
                </div>
              )}

              <div 
                className={`p-3 text-body-md shadow-sm ${
                  isUser 
                    ? 'bg-primary text-on-primary rounded-2xl rounded-tr-none' 
                    : 'bg-surface border border-outline-variant text-on-surface rounded-2xl rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {chatLoading && (
          <div className="flex gap-sm max-w-[85%] relative z-10">
            <div className="w-6 h-6 rounded-full bg-surface-variant flex items-center justify-center shrink-0 mt-1">
              <span className="material-symbols-outlined text-[14px] text-primary animate-spin">sync</span>
            </div>
            <div className="bg-surface border border-outline-variant p-3 rounded-2xl rounded-tl-none text-body-md text-on-surface-variant italic">
              AI is updating your plan...
            </div>
          </div>
        )}

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 pl-8 relative z-10 mt-auto pt-2">
          {["Update Timeline", "Find new venue", "Generate Menu"].map((chip, i) => (
            <button
              key={i}
              onClick={() => handleChipClick(chip)}
              disabled={chatLoading}
              className="bg-surface-container-low border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary px-3 py-1.5 rounded-full font-label-md text-label-md transition-colors text-[11px] cursor-pointer disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Area */}
      <div className="p-md bg-surface border-t border-outline-variant z-10">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to modify the plan..."
            rows="1"
            disabled={chatLoading}
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl pl-4 pr-12 py-3 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none custom-scrollbar shadow-sm disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={chatLoading}
            className="absolute right-2 p-2 rounded-lg text-primary hover:bg-primary-container/50 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {chatLoading ? 'sync' : 'send'}
            </span>
          </button>
        </form>
        <div className="mt-2 text-center">
          <span className="text-[10px] text-outline font-label-md">
            AI can make mistakes. Verify important details.
          </span>
        </div>
      </div>
    </div>
  );
}
