import React from 'react';
import { Search, Bell, Settings, HelpCircle, Grid, MoreHorizontal, User, PenTool, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { profile, signOut } = useAuth();

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
        <button className="p-2 text-text-secondary hover:text-brand transition-colors rounded-misa md:hidden">
          <Search size={20} />
        </button>
        <button className="p-2 text-text-secondary hover:text-brand transition-colors rounded-misa hidden sm:block">
          <Bell size={20} />
        </button>
        
        {profile ? (
          <div className="flex items-center gap-3">
            {profile.role === 'writer' && (
              <Link 
                to="/writer/dashboard" 
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-brand text-white rounded-misa font-semibold hover:opacity-90 transition-all"
              >
                <PenTool size={16} />
                <span>Viết truyện</span>
              </Link>
            )}
            
            <div className="relative group ml-2">
              <div className="w-8 h-8 rounded-full bg-border-neutral overflow-hidden cursor-pointer hover:ring-2 ring-brand transition-all">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white bg-brand/80">
                    <User size={18} />
                  </div>
                )}
              </div>
              
              {/* Simple Dropdown on Hover */}
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="w-48 bg-white border border-border-neutral-light rounded-misa shadow-lg py-1 overflow-hidden">
                  <div className="px-4 py-2 border-b border-border-neutral-light">
                    <p className="font-bold text-text-primary truncate">{profile.full_name || 'Người dùng'}</p>
                    <p className="text-[11px] text-text-hint truncate">{profile.username}</p>
                  </div>
                  {profile.role === 'writer' && (
                    <Link to="/writer/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-brand-light text-text-primary transition-colors">
                      <Grid size={16} />
                      <span>Quản lý truyện</span>
                    </Link>
                  )}
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-danger/10 text-danger transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-[12px] text-text-hint italic">
            Chế độ người đọc
          </div>
        )}
      </div>
    </header>
  );
};
