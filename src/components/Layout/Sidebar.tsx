import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, 
  Search,
  BookOpen,
  ChevronLeft, 
  ChevronRight,
  PenTool
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Story } from '../../types';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchRecent = async () => {
      const { data } = await supabase.from('stories').select('*').limit(5).order('created_at', { ascending: false });
      if (data) setRecentStories(data);
    };
    fetchRecent();
  }, []);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-[48px] bottom-0 bg-white border-r border-border-neutral-light transition-all duration-300 z-40 flex flex-col",
        collapsed ? "w-[64px]" : "w-[240px]"
      )}
    >
      <div className="flex-1 py-4 overflow-y-auto no-scrollbar">
        {/* Navigation Section */}
        <div className="px-2 space-y-1">
          <NavLink 
            to="/"
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-misa transition-all",
              isActive 
                ? "bg-brand-light text-brand" 
                : "text-text-primary hover:bg-brand-light hover:text-brand"
            )}
          >
            <Home size={20} className="shrink-0" />
            {!collapsed && <span className="font-semibold">Trang chủ</span>}
          </NavLink>
          
          <div className="md:hidden">
            <div className="flex items-center gap-3 px-3 py-2 text-text-primary">
              <Search size={20} className="shrink-0" />
              {!collapsed && <input type="text" placeholder="Tìm kiếm..." className="bg-transparent outline-none w-full text-[13px]" />}
            </div>
          </div>
        </div>

        {/* Stories List Section */}
        {!collapsed && (
          <div className="mt-8 px-4">
            <p className="text-[11px] font-bold text-text-hint uppercase tracking-wider mb-4">Truyện mới cập nhật</p>
            <div className="space-y-4">
              {recentStories.length > 0 ? recentStories.map((story) => (
                <Link key={story.id} to={`/story/${story.id}`} className="flex gap-3 group">
                   <div className="w-10 h-14 bg-border-neutral rounded shrink-0 overflow-hidden shadow-sm">
                      <img src={story.cover_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="font-medium text-[12px] text-text-primary line-clamp-2 leading-tight group-hover:text-brand transition-colors">
                        {story.title}
                      </p>
                      <span className="text-[10px] text-text-hint">{story.category}</span>
                   </div>
                </Link>
              )) : (
                // Mock for initial view
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                     <div className="w-10 h-14 bg-border-neutral-light rounded shrink-0" />
                     <div className="flex-1 space-y-2 py-1">
                        <div className="h-2 bg-border-neutral-light rounded w-full" />
                        <div className="h-2 bg-border-neutral-light rounded w-1/2" />
                     </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Admin Section */}
        {profile?.role === 'writer' && !collapsed && (
          <div className="mt-auto pt-8 px-4">
            <Link 
              to="/writer/dashboard" 
              className="flex items-center gap-2 p-3 bg-brand text-white rounded-misa font-bold hover:opacity-90 transition-all shadow-md shadow-brand/20"
            >
              <PenTool size={18} />
              <span>Quản lý sáng tác</span>
            </Link>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="h-[48px] flex items-center justify-center bg-[#FAFAFA] border-t border-border-neutral-light hover:bg-brand-light transition-colors"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </aside>
  );
};
