import React from 'react';
import { Search, Bell, Settings, HelpCircle, Grid, MoreHorizontal, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { profile } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-[48px] bg-white border-b border-border-neutral-light flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-3">
        <button className="p-1 hover:bg-brand-light rounded transition-colors bg-brand text-white">
          <Grid size={18} />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white font-bold">C</div>
          <span className="font-semibold text-[16px] text-text-primary hidden sm:block">Chill Mỗi Ngày</span>
        </Link>
      </div>

      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-hint group-focus-within:text-brand transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Tìm kiếm truyện, tác giả..." 
            className="w-full h-8 pl-10 pr-4 bg-background-app border border-transparent rounded-misa focus:bg-white focus:border-brand outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="p-2 text-text-secondary hover:text-brand transition-colors rounded-misa">
          <Search className="md:hidden" size={20} />
        </button>
        <button className="p-2 text-text-secondary hover:text-brand transition-colors rounded-misa">
          <Bell size={20} />
        </button>
        <button className="p-2 text-text-secondary hover:text-brand transition-colors rounded-misa">
          <HelpCircle size={20} />
        </button>
        <button className="p-2 text-text-secondary hover:text-brand transition-colors rounded-misa">
          <Settings size={20} />
        </button>
        <button className="p-2 text-text-secondary hover:text-brand transition-colors rounded-misa">
          <MoreHorizontal size={20} />
        </button>
        
        <div className="ml-2 w-8 h-8 rounded-full bg-border-neutral overflow-hidden cursor-pointer hover:ring-2 ring-brand transition-all">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-text-hint">
              <User size={18} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
