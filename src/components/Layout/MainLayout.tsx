import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '../../lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background-app">
      <Header />
      <Sidebar />
      <main 
        className={cn(
          "pt-[48px] min-h-screen transition-all duration-300",
          "ml-[64px] md:ml-[220px]" // Initial assumption, actual width will depend on Sidebar state if shared state was used
          // However, for simplicity here, I'll use a standard desktop layout or separate the state management
        )}
      >
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
