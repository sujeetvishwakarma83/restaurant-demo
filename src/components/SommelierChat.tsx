import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wine, Send, ShieldAlert, Sparkles, User, GraduationCap, ChevronRight } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const CHIP_PROMPTS = [
  "Pairings for Wagyu A5?",
  "What is Le Velouté de Truffe?",
  "Can you critique my tasting selections?",
  "Tell me about the location."
];

export const SommelierChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Bonsoir, Monsieur/Madame. Welcome to L'Éclat Gastronomy. I am your Head Sommelier and Maître D'. Please, allow me to advise you on our world-class wine cellars, walk you through Chef Vance's culinary architecture, or critique your bespoke dinner course alignments. How may I honor your table tonight?"
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      // Map message history to gemini format
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await fetch('/api/sommelier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: textToSend, history })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Pardonnez-moi, Monsieur/Madame. An elegant silence has captured our wine vaults. Rest assured, our Château Mouton Rothschild '89 pair beautifully with any rich meat course." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="sommelier-chat-view" className="relative min-h-[500px] py-16 select-none">
      <div className="w-full max-w-4xl mx-auto px-6">
        
        {/* Salon Desk Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-gold-400 font-mono text-xs uppercase tracking-[0.35em] block mb-2">Concierge Conversationnel</span>
          <h2 className="text-white font-serif text-2xl md:text-4xl font-normal italic tracking-tight">AI Sommelier & Maître D’</h2>
        </div>

        {/* Chat Console Structure */}
        <div className="glass-card border border-gold-500/10 flex flex-col h-[520px] bg-neutral-950/80 luxury-shadow relative overflow-hidden">
          
          {/* Status Header */}
          <div className="px-5 py-4 border-b border-neutral-900 bg-neutral-950 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center p-2 bg-neutral-900 border border-gold-500/10 rounded-none text-gold-400">
                <Wine className="w-4 h-4 animate-pulse fill-gold-500/10" />
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-neutral-950" />
              </div>
              <div>
                <h4 className="text-xs text-white uppercase tracking-widest font-mono font-medium">Monsieur Larousse</h4>
                <p className="text-[10px] text-neutral-500 font-mono">Maître D' des Salons L'Éclat</p>
              </div>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 bg-neutral-900 px-3 py-1.5 uppercase">
              <Sparkles className="w-3 h-3 text-gold-400" />
              Gemini Powered Grounding
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex max-w-[85%] flex-col ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
              >
                <div 
                  className={`p-4 font-sans text-xs md:text-sm leading-relaxed rounded-none border ${
                    msg.role === 'user'
                      ? 'bg-gold-500/5 text-neutral-200 border-gold-500/20'
                      : 'bg-neutral-900 text-neutral-200 border-neutral-850'
                  }`}
                  style={{
                    backgroundColor: msg.role === 'user' ? 'rgba(212, 175, 55, 0.05)' : 'rgba(239, 234, 227, 0.9)'
                  }}
                >
                  <p className="whitespace-pre-line font-normal tracking-wide">{msg.text}</p>
                </div>
                <span className="text-[9px] text-neutral-500 font-mono uppercase mt-1 px-1 tracking-widest">
                  {msg.role === 'user' ? 'Table Guest' : 'Maitre Larousse'}
                </span>
              </motion.div>
            ))}

            {loading && (
              <div className="flex max-w-[80%] mr-auto items-start flex-col">
                <div className="bg-neutral-950 p-4 border border-neutral-900 flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest pl-1">
                    Larousse is selecting cellars...
                  </span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Floating prompt chips */}
          <div className="px-5 py-3 border-t border-neutral-900 bg-neutral-950/60 flex flex-wrap gap-2 items-center z-10 shrink-0">
            <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest shrink-0">Inquire:</span>
            {CHIP_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                id={`btn-chip-${prompt.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => sendMessage(prompt)}
                className="px-3 py-1 bg-neutral-900 hover:bg-neutral-850 hover:border-gold-500/30 text-[10px] text-neutral-300 border border-neutral-800 transition-all font-mono select-none cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Action Input */}
          <form 
            id="sommelier-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(inputValue);
            }} 
            className="p-3 border-t border-neutral-900 bg-neutral-950 flex gap-2 z-10 shrink-0"
          >
            <input
              id="input-sommelier-chat"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Inquire of vintages, ingredients, culinary arts..."
              className="flex-1 bg-neutral-900 border border-neutral-850 focus:border-gold-500 text-xs px-4 py-3 placeholder:text-neutral-600 focus:outline-none font-sans font-normal text-neutral-100"
              disabled={loading}
            />
            <button
              id="btn-send-chat"
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="px-5 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-neutral-100 font-bold transition-all disabled:opacity-45 flex items-center justify-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
