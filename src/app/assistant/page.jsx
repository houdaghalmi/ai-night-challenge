'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';
import { useTheme } from '@/lib/useTheme';
import { translations } from '@/lib/translations';
import { themes } from '@/lib/themes';
import Navbar from '@/components/Navbar';

export default function AssistantPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { language, isLoaded } = useLanguage();
  const { theme, isLoaded: themeLoaded } = useTheme();

  const t = translations[language];
  const themeColors = themes[theme];

  // Initialize with welcome message when language is loaded
  useEffect(() => {
    if (isLoaded) {
      setMessages([
        { text: t.assistant?.welcome || 'Hello! 👋 How can I help you with your Tunisia travel plans?', isBot: true }
      ]);
    }
  }, [isLoaded, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, isBot: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.response || t.assistant?.errorServer || 'Server error', isBot: true }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { text: t.assistant?.errorConnection || 'Unable to connect to assistant', isBot: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !themeLoaded) return null;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: themeColors.bg.primary }}>
      <Navbar />
      
      {/* Main Chat Area - constrained height to allow internal scrolling */}
      <div className="flex-1 pt-20 flex flex-col max-w-5xl mx-auto w-full h-full relative">
        
        {/* Sticky Header */}
        <div 
          className="sticky top-0 z-10 px-6 py-4 border-b flex items-center gap-4 backdrop-blur-md bg-opacity-90" 
          style={{ borderColor: themeColors.accent.border, backgroundColor: `${themeColors.bg.primary}E6` }}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
            <img 
              src="assests/avatar-robot.png" 
              alt="Tourisia Guide" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-serif font-semibold" style={{ color: themeColors.text.primary }}>
              {t.assistant?.title || 'Tourisia Guide'}
            </h1>
            <p className="flex items-center text-sm" style={{ color: themeColors.text.secondary }}>
              <span className="w-2 h-2 rounded-full animate-pulse mr-2" style={{ backgroundColor: '#4ade80' }}></span>
              {t.assistant?.online || 'Online'}
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              
              {/* Avatar - Only for Bot */}
              {msg.isBot && (
                <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm mt-1">
                  <img 
                    src="assests/avatar-robot.png" 
                    alt="Bot" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className="max-w-[80%] md:max-w-[70%] px-5 py-3.5 text-[15px] leading-relaxed"
                style={{
                  backgroundColor: msg.isBot ? themeColors.bg.secondary : themeColors.accent.gold,
                  color: msg.isBot ? themeColors.text.primary : 'white',
                  borderRadius: msg.isBot ? '0 1.25rem 1.25rem 1.25rem' : '1rem 1rem 1rem 1rem',
                  border: msg.isBot ? `1px solid ${themeColors.accent.border}` : 'none',
                  boxShadow: msg.isBot ? '0 1px 2px rgba(0,0,0,0.05)' : '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm mt-1">
                <img 
                  src="assests/avatar-robot.png" 
                  alt="Bot" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="px-5 py-4 flex items-center gap-2"
                style={{
                  backgroundColor: themeColors.bg.secondary,
                  borderRadius: '0 1.25rem 1.25rem 1.25rem',
                  border: `1px solid ${themeColors.accent.border}`,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]" style={{ backgroundColor: themeColors.accent.gold }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]" style={{ backgroundColor: themeColors.accent.gold }}></div>
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: themeColors.accent.gold }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-black/5 to-transparent">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.assistant?.placeholder || 'Ask your question...'}
              className="w-full rounded-full pl-6 pr-14 py-4 text-[15px] focus:outline-none transition-all shadow-md"
              style={{
                backgroundColor: themeColors.bg.secondary,
                color: themeColors.text.primary,
                border: `1px solid ${themeColors.accent.border}`,
              }}
              onFocus={(e) => (e.target.style.boxShadow = `0 4px 15px ${themeColors.accent.gold}22`)}
              onBlur={(e) => (e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)')}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square rounded-full flex items-center justify-center transition-all"
              style={{
                backgroundColor: themeColors.accent.gold,
                color: 'white',
                opacity: isLoading || !input.trim() ? 0.4 : 1,
                cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isLoading && input.trim()) e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                if (!isLoading && input.trim()) e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Send className="w-4 h-4 ml-1" />
            </button>
          </form>
          <div className="text-center mt-3 text-xs opacity-60" style={{ color: themeColors.text.secondary }}>
            {t.assistant?.disclaimer || 'Tourisia Guide can make mistakes. Consider verifying important travel info.'}
          </div>
        </div>
      </div>
    </div>
  );
}