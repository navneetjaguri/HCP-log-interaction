'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  Bell,
  Search,
  ChevronRight,
  MessageSquare,
  FileText,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

function SidebarItem({ icon: Icon, label, active = false, href = "#" }: { icon: any, label: string, active?: boolean, href?: string }) {
  return (
    <Link href={href}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
      }`}>
        <Icon size={20} />
        <span className="font-semibold text-sm">{label}</span>
        {active && <ChevronRight size={14} className="ml-auto" />}
      </div>
    </Link>
  );
}

interface Interaction {
  id: number;
  hcp_name: string;
  interaction_type: string;
  date: string;
  sentiment: string;
  topics_discussed: string;
  follow_up_actions: string;
}

export default function HCPDatabasePage() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/interactions');
        setInteractions(response.data);
      } catch (error) {
        toast.error('Failed to load interactions from the database');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInteractions();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 p-6 flex flex-col bg-white">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="text-white" size={18} />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gray-900">MedSync</span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={Users} label="HCP Database" href="/hcp-database" active />
          <SidebarItem icon={MessageSquare} label="Interactions" href="/" />
          <SidebarItem icon={Settings} label="Preferences" />
        </nav>

        <div className="pt-6 border-t border-gray-100 space-y-2">
          <SidebarItem icon={HelpCircle} label="Support" />
          <SidebarItem icon={LogOut} label="Sign Out" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full w-96">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search HCP Database (Ctrl+K)" 
              className="bg-transparent border-none outline-none text-xs w-full text-gray-600" 
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-100"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900 leading-none">Alex Rivera</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Sales Representative</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold">
                AR
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="p-8 overflow-y-auto flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">HCP Database</h1>
              <p className="text-sm text-gray-500 mt-1">Historical log of all Healthcare Professional interactions</p>
            </div>
            
            {/* Table Container */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50/50 text-gray-500 uppercase text-[10px] font-bold tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4">HCP Name</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Sentiment</th>
                      <th className="px-6 py-4 w-1/3">Topics Discussed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            Loading database...
                          </div>
                        </td>
                      </tr>
                    ) : interactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle size={24} className="mb-2 text-gray-300" />
                            No interactions logged yet.
                          </div>
                        </td>
                      </tr>
                    ) : (
                      interactions.map((interaction) => (
                        <tr key={interaction.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {interaction.hcp_name}
                          </td>
                          <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {interaction.date || 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                              {interaction.interaction_type}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              interaction.sentiment === 'Positive' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : interaction.sentiment === 'Negative'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-orange-50 text-orange-700 border-orange-200'
                            }`}>
                              {interaction.sentiment}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-xs truncate max-w-xs">
                            <div className="flex items-center gap-2">
                              <FileText size={14} className="text-gray-400 shrink-0" />
                              <span className="truncate">{interaction.topics_discussed || 'No topics logged'}</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
