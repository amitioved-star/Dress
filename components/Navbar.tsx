
import React from 'react';
import { LayoutDashboard, Calendar, ShoppingBag, Home, BarChart3 } from 'lucide-react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'home', label: 'בית', icon: Home },
    { id: 'catalog', label: 'קטלוג', icon: ShoppingBag },
    { id: 'calendar', label: 'יומן', icon: Calendar },
    { id: 'dashboard', label: 'דוחות', icon: BarChart3 },
    { id: 'admin', label: 'ניהול', icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0 h-16 px-4">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 space-x-reverse">
          <span className="text-xl font-bold bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">GlamourRent</span>
        </div>
        
        <div className="flex w-full md:w-auto justify-around md:justify-end items-center md:gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-1 rounded-full transition-all ${
                currentView === item.id 
                ? 'text-rose-600 bg-rose-50 md:bg-transparent md:font-semibold' 
                : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] md:text-sm">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
