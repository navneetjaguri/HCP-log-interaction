'use client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateField } from '@/store/interactionSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle, 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  FileText, 
  Package, 
  Smile, 
  Target, 
  ClipboardCheck,
  Zap,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export default function InteractionForm() {
  const form = useSelector((state: RootState) => state.interaction);
  const dispatch = useDispatch();
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleChange = (field: string, value: any) => {
    dispatch(updateField({ field, value }));
  };

  // Effect to show a "Sync" indicator when AI updates the form
  useEffect(() => {
    setLastUpdated(new Date().toLocaleTimeString());
    const timer = setTimeout(() => setLastUpdated(null), 3000);
    return () => clearTimeout(timer);
  }, [form]);

  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-4 mt-2">
      <div className="p-1.5 bg-blue-50 rounded-lg">
        <Icon size={18} className="text-blue-600" />
      </div>
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
    </div>
  );

  return (
    <div className="relative glass-card p-8 rounded-3xl shadow-2xl border border-white/40 space-y-8 overflow-hidden max-w-4xl mx-auto">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 rounded-full -mr-32 -mt-32 blur-3xl -z-10"></div>
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Interaction Metrics</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time HCP logging dashboard</p>
        </div>
        <AnimatePresence>
          {lastUpdated && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100"
            >
              <Zap size={14} className="fill-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Synced at {lastUpdated}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-8">
        {/* Core Info */}
        <section>
          <SectionHeader icon={UserCircle} title="Primary Contact" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-600 ml-1 uppercase">HCP Name</label>
              <input 
                type="text" 
                value={form.hcp_name} 
                onChange={(e) => handleChange('hcp_name', e.target.value)}
                className="w-full p-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm placeholder:text-gray-300"
                placeholder="Dr. Name..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-600 ml-1 uppercase">Interaction Type</label>
              <select 
                value={form.interaction_type} 
                onChange={(e) => handleChange('interaction_type', e.target.value)}
                className="w-full p-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
              >
                <option value="Meeting">Meeting</option>
                <option value="Call">Call</option>
                <option value="Email">Email</option>
              </select>
            </div>
          </div>
        </section>

        {/* Schedule */}
        <section>
          <SectionHeader icon={Calendar} title="Timing & Logistics" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-600 ml-1 uppercase">Date</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="text" 
                  value={form.date} 
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full p-3 pl-10 bg-white border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                  placeholder="Today, May 11..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-600 ml-1 uppercase">Time</label>
              <div className="relative">
                <Clock size={14} className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="text" 
                  value={form.time} 
                  onChange={(e) => handleChange('time', e.target.value)}
                  className="w-full p-3 pl-10 bg-white border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                  placeholder="2:00 PM..."
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-600 ml-1 uppercase">Attendees</label>
              <div className="relative">
                <Users size={14} className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="text" 
                  value={form.attendees} 
                  onChange={(e) => handleChange('attendees', e.target.value)}
                  className="w-full p-3 pl-10 bg-white border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                  placeholder="Separate with commas..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Narrative */}
        <section>
          <SectionHeader icon={MessageSquare} title="The Conversation" />
          <div className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-600 ml-1 uppercase">Topics Discussed</label>
              <textarea 
                value={form.topics_discussed} 
                onChange={(e) => handleChange('topics_discussed', e.target.value)}
                className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm h-32 resize-none"
                placeholder="What was the core of the discussion?"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 ml-1 uppercase inline-flex items-center gap-1.5">
                  <FileText size={12} /> Materials Shared
                </label>
                <input 
                  type="text" 
                  value={form.materials_shared} 
                  onChange={(e) => handleChange('materials_shared', e.target.value)}
                  className="w-full p-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 ml-1 uppercase inline-flex items-center gap-1.5">
                  <Package size={12} /> Samples
                </label>
                <input 
                  type="text" 
                  value={form.samples_distributed} 
                  onChange={(e) => handleChange('samples_distributed', e.target.value)}
                  className="w-full p-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Sentiment & Close */}
        <section>
          <SectionHeader icon={Smile} title="Outcome & Sentiment" />
          <div className="p-6 bg-blue-50/30 rounded-2xl border border-blue-100/50 space-y-6">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block text-center">HCP Sentiment Analysis</label>
              <div className="flex justify-center gap-8">
                {['Positive', 'Neutral', 'Negative'].map((s) => (
                  <motion.label 
                    key={s} 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all border ${
                      form.sentiment === s 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                        : 'bg-white text-gray-500 border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="sentiment" 
                      value={s} 
                      checked={form.sentiment === s}
                      onChange={(e) => handleChange('sentiment', e.target.value)}
                      className="hidden"
                    />
                    <span className="text-xs font-black uppercase">{s}</span>
                  </motion.label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 ml-1 uppercase inline-flex items-center gap-1.5">
                  <Target size={12} /> Key Outcomes
                </label>
                <textarea 
                  value={form.outcomes} 
                  onChange={(e) => handleChange('outcomes', e.target.value)}
                  className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm h-24 resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 ml-1 uppercase inline-flex items-center gap-1.5">
                  <ClipboardCheck size={12} /> Next Steps
                </label>
                <textarea 
                  value={form.follow_up_actions} 
                  onChange={(e) => handleChange('follow_up_actions', e.target.value)}
                  className="w-full p-4 bg-white border border-gray-100 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-gray-700 shadow-sm h-24 resize-none"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Save Actions */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              if (!form.hcp_name || !form.date) {
                toast.error('HCP Name and Date are required');
                return;
              }
              // Here we'd typically make a POST request to save the interaction
              toast.success(`Interaction with ${form.hcp_name} saved successfully!`);
              // Optional: reset form
            }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Save size={18} /> Save Interaction
          </button>
        </div>
      </div>
    </div>
  );
}
