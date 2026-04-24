'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import InteractionForm from '@/components/interaction/InteractionForm';
import AIChat from '@/components/interaction/AIChat';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';

function SidebarItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'
    }`}>
      <Icon size={20} />
      <span className="font-semibold text-sm">{label}</span>
      {active && <ChevronRight size={14} className="ml-auto" />}
    </div>
  );
}

function LogInteractionPage() {
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
          <SidebarItem icon={LayoutDashboard} label="Dashboard" />
          <SidebarItem icon={Users} label="HCP Database" />
          <SidebarItem icon={LayoutDashboard} label="Interactions" active />
          <SidebarItem icon={Settings} label="Preferences" />
        </nav>

        <div className="pt-6 border-t border-gray-100 space-y-2">
          <SidebarItem icon={HelpCircle} label="Support" />
          <SidebarItem icon={LogOut} label="Sign Out" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-full w-96">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Quick search (Ctrl+K)" 
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
        <div className="p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Log Interaction</h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <span>Dashboard</span>
                <ChevronRight size={14} />
                <span className="text-blue-600 font-medium">New Entry</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <InteractionForm />
              </div>
              <div className="lg:col-span-4 sticky top-24">
                <AIChat />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <LogInteractionPage />
    </Provider>
  );
}
