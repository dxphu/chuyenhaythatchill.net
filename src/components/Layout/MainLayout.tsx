import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { cn } from '../../lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-app pb-[64px] md:pb-0">
      <Header />
      <Sidebar />
      <main 
        className={cn(
          "pt-[48px] min-h-screen transition-all duration-300",
          "ml-0 md:ml-[64px] lg:ml-[220px]" 
        )}
      >
        <div className="p-3 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};
