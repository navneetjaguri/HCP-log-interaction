'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateForm } from '@/store/interactionSlice';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Loader2, 
  BrainCircuit,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function AIChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { 
      role: 'ai', 
      content: "Hello! I'm Aura, your AI Sales Assistant. I can help you log interactions, search for HCPs, or retrieve history. How can I help you today?" 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const formData = useSelector((state: RootState) => state.interaction);
  const dispatch = useDispatch();

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/chat', {
        message: input,
        session_id: 'default-session',
        current_form_data: formData
      });

      const { response, updated_form_data } = res.data;
      
      setMessages(prev => [...prev, { role: 'ai', content: response }]);
      if (updated_form_data && Object.keys(updated_form_data).length > 0) {
        dispatch(updateForm(updated_form_data));
        toast.success('Form automatically synced by Aura');
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'I apologize, but I encountered a connection issue. Please ensure the backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] bg-white/40 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl overflow-hidden sticky top-24">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-between text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <BrainCircuit size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-wide uppercase">Aura AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-blue-100 font-medium">Assistant Active</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'ai', content: "Chat reset. How can I assist you?" }])}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          title="Reset Chat"
        >
          <RefreshCw size={16} />
        </button>
      </div>
      
      {/* Messages */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`p-1.5 rounded-full ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {msg.role === 'user' ? <User size={16} className="text-blue-600" /> : <Bot size={16} className="text-gray-600" />}
              </div>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-gray-400 text-[12px] italic pl-10"
          >
            <Loader2 size={14} className="animate-spin" />
            Aura is analyzing...
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100">
        <div className="relative group">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
            className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-sm shadow-sm group-hover:border-gray-300"
            placeholder="Search HCP, log session, or edit history..."
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-gray-400">
          <div className="flex items-center gap-1">
            <Sparkles size={10} className="text-yellow-500" />
            <span>AI Form Sync Active</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          <span>Automatic Logging</span>
        </div>
      </div>
    </div>
  );
}
