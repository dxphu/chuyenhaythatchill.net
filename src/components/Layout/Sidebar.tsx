import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  PenTool, 
  History, 
  Bookmark, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight,
  Layout
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { profile } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Trang chủ', path: '/' },
    { icon: TrendingUp, label: 'Thịnh hành', path: '/trending' },
    { icon: BookOpen, label: 'Tủ sách', path: '/library' },
    { icon: History, label: 'Lịch sử đọc', path: '/history' },
    { icon: Bookmark, label: 'Theo dõi', path: '/following' },
  ];

  const writerItems = [
    { icon: Layout, label: 'Dashboard', path: '/writer/dashboard' },
    { icon: PenTool, label: 'Sáng tác', path: '/writer/stories' },
  ];

  return (
    <aside 
      className={cn(
        "fixed left-0 top-[48px] bottom-0 bg-white border-r border-border-neutral-light transition-all duration-300 z-40 flex flex-col",
        collapsed ? "w-[64px]" : "w-[220px]"
      )}
    >
      <nav className="flex-1 py-4 overflow-y-auto">
        <p className={cn("px-4 mb-2 text-[11px] font-semibold text-text-hint uppercase", collapsed && "text-center px-0")}>
          {collapsed ? '...' : 'Khám phá'}
        </p>
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-misa transition-all",
                  isActive 
                    ? "bg-brand-light text-brand" 
                    : "text-text-primary hover:bg-brand-light hover:text-brand"
                )}
              >
                <item.icon size={20} className={cn(!collapsed && "min-w-[20px]")} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {profile?.role === 'writer' && (
          <>
            <p className={cn("px-4 mt-6 mb-2 text-[11px] font-semibold text-text-hint uppercase", collapsed && "text-center px-0")}>
              {collapsed ? '...' : 'Tác giả'}
            </p>
            <ul className="space-y-1 px-2">
              {writerItems.map((item) => (
                <li key={item.path}>
                  <NavLink 
                    to={item.path}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-misa transition-all",
                      isActive 
                        ? "bg-brand-light text-brand" 
                        : "text-text-primary hover:bg-brand-light hover:text-brand"
                    )}
                  >
                    <item.icon size={20} className={cn(!collapsed && "min-w-[20px]")} />
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* Collapse Toggle Button - Following MISA style */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "h-[40px] flex items-center justify-center bg-[#FAFAFA] border-t border-border-neutral-light hover:bg-brand-light transition-colors relative",
          collapsed ? "w-full" : "w-full"
        )}
      >
        <div className={cn(
          "flex items-center gap-1",
          collapsed ? "justify-center" : "absolute right-2"
        )}>
           {!collapsed && <span className="text-[12px] text-text-secondary mr-2 transition-opacity">THU GỌN</span>}
           {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </div>
      </button>
    </aside>
  );
};
