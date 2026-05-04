import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, BookOpen, PenTool, User } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

export const BottomNavigation: React.FC = () => {
  const { profile } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-border-neutral-light flex items-center justify-around px-2 z-50 md:hidden safe-bottom">
      <NavLink 
        to="/" 
        className={({ isActive }) => cn(
          "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
          isActive ? "text-brand" : "text-text-secondary"
        )}
      >
        <Home size={22} />
        <span className="text-[10px] font-bold">Trang chủ</span>
      </NavLink>

      <NavLink 
        to="/search" 
        className={({ isActive }) => cn(
          "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
          isActive ? "text-brand" : "text-text-secondary"
        )}
      >
        <Search size={22} />
        <span className="text-[10px] font-bold">Tìm kiếm</span>
      </NavLink>

      {profile?.role === 'writer' ? (
        <NavLink 
          to="/writer" 
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
            isActive ? "text-brand" : "text-text-secondary"
          )}
        >
          <PenTool size={22} />
          <span className="text-[10px] font-bold">Sáng tác</span>
        </NavLink>
      ) : (
        <NavLink 
          to="/library" 
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
            isActive ? "text-brand" : "text-text-secondary"
          )}
        >
          <BookOpen size={22} />
          <span className="text-[10px] font-bold">Thư viện</span>
        </NavLink>
      )}

      <NavLink 
        to="/profile" 
        className={({ isActive }) => cn(
          "flex flex-col items-center justify-center gap-1 w-full h-full transition-all",
          isActive ? "text-brand" : "text-text-secondary"
        )}
      >
        <User size={22} />
        <span className="text-[10px] font-bold">Cá nhân</span>
      </NavLink>
    </nav>
  );
};
