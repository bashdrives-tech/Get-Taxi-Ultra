import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Minus, Send, Sparkles, HelpCircle, Phone, ArrowUpRight, Compass } from 'lucide-react';
import { ChatMessage } from '../types';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Vanakkam! I am your **Get Taxi Kovai AI Tour Guide**. 🚖✨\n\nThinking of a trip from Coimbatore to **Ooty**, **Munnar**, **Kodaikanal**, **Valparai**, or the holy **Adiyogi Shiva**? I can help you plan your sightseeing spots, suggest the best times to visit, or map out an itinerary!\n\n* Fares are calculated dynamically in our calculator above. Let me know where you'd like to explore!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMinimize = () => {
    setIsOpen(false);
  };

  const handleCloseAndReset = () => {
    setMessages([
      {
        role: 'model',
        text: "Vanakkam! I am your **Get Taxi Kovai AI Tour Guide**. 🚖✨\n\nThinking of a trip from Coimbatore to **Ooty**, **Munnar**, **Kodaikanal**, **Valparai**, or the holy **Adiyogi Shiva**? I can help you plan your sightseeing spots, suggest the best times to visit, or map out an itinerary!\n\n* Fares are calculated dynamically in our calculator above. Let me know where you'd like to explore!"
      }
    ]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => {
      window.removeEventListener('open-ai-chat', handleOpenChat);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      // Keep only last 6 messages as history to prevent token blowout
      const chatHistory = messages.slice(-6);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatHistory
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: "I apologize, my tea gardens are currently covered in mountain mist! 🏔️\n\nPlease feel free to use our instant fare calculator on this page or call our helpdesk directly at **9043743777** for immediate assistance."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  // Function to format markdown bold and bullets beautifully
  const formatText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let formattedLine = line;

      // Handle bullets
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('*');
      if (isBullet) {
        formattedLine = line.trim().replace(/^[•*]\s*/, '');
      }

      // Handle bold text (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(formattedLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(formattedLine.substring(lastIndex, match.index));
        }
        parts.push(<strong key={match.index} className="font-bold text-slate-900">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }

      if (lastIndex < formattedLine.length) {
        parts.push(formattedLine.substring(lastIndex));
      }

      if (isBullet) {
        return (
          <li key={idx} className="ml-4 list-disc pl-1 text-[11px] text-gray-600 leading-relaxed mb-1">
            {parts.length > 0 ? parts : formattedLine}
          </li>
        );
      }

      return (
        <p key={idx} className="text-xs text-gray-600 leading-relaxed mb-2 last:mb-0">
          {parts.length > 0 ? parts : formattedLine}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-40 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-80 sm:w-96 h-[500px] flex flex-col mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-950 p-4 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500 to-teal-500 opacity-20 rounded-full blur-xl"></div>
              
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-slate-950 font-bold shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                    Kovai AI Assistant <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-ping"></span>
                  </h4>
                  <p className="text-[10px] text-gray-400">Ask sightseeing, routes & advice</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={handleMinimize}
                  title="Minimize (keep chat)"
                  className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCloseAndReset}
                  title="Close & Clear Chat"
                  className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-sm ${
                      msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-gray-100'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <p className="text-xs">{msg.text}</p>
                    ) : (
                      <div className="space-y-0.5">{formatText(msg.text)}</div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-800 rounded-2xl rounded-tl-none border border-gray-100 px-3.5 py-3 shadow-sm flex items-center gap-1.5 text-xs">
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-200"></div>
                    <span className="text-gray-400 ml-1 font-medium">Planning itinerary...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Suggesters Panel (Only if input is empty) */}
            {input === '' && !isLoading && (
              <div className="p-2 bg-slate-100/60 border-t border-gray-100 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                <button
                  onClick={() => selectSuggestedPrompt("Suggest a 2-day Ooty trip plan.")}
                  className="bg-white hover:bg-slate-50 text-[10px] text-gray-600 font-bold px-2.5 py-1.5 rounded-full border border-gray-100 shrink-0 shadow-sm cursor-pointer flex items-center gap-1"
                >
                  🌲 Ooty 2d Guide
                </button>
                <button
                  onClick={() => selectSuggestedPrompt("What is Munnar's best season?")}
                  className="bg-white hover:bg-slate-50 text-[10px] text-gray-600 font-bold px-2.5 py-1.5 rounded-full border border-gray-100 shrink-0 shadow-sm cursor-pointer flex items-center gap-1"
                >
                  🍃 Munnar Season
                </button>
                <button
                  onClick={() => selectSuggestedPrompt("Adiyogi evening light show details")}
                  className="bg-white hover:bg-slate-50 text-[10px] text-gray-600 font-bold px-2.5 py-1.5 rounded-full border border-gray-100 shrink-0 shadow-sm cursor-pointer flex items-center gap-1"
                >
                  🙏 Adiyogi Show
                </button>
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-gray-100 bg-white flex gap-2 shrink-0 items-center"
            >
              <input
                type="text"
                placeholder="Ask sightseeing, routes, or trip tips..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-gray-800 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-slate-900 text-white p-2.5 rounded-full hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-slate-950 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-slate-850 cursor-pointer border border-white/10 relative"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6 text-yellow-400" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-white">
              AI
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}
