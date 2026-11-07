import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { SupabaseConfigBanner } from '@/components/common/SupabaseConfigBanner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Initialize Lenis smooth scroll on long-form views
  useSmoothScroll();

  return (
    <div className="min-h-screen bg-[#090C13] text-[#F4F6FC] flex flex-col font-sans selection:bg-[#6D95FF]/30 selection:text-[#F4F6FC]">
      <SupabaseConfigBanner />
      <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

      <div className="flex-1 flex max-w-full overflow-hidden">
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8 bg-[#090C13]">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
