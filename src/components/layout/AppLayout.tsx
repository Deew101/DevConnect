import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { SupabaseConfigBanner } from '@/components/common/SupabaseConfigBanner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { GalaxyBackground } from '@/components/galaxy';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Initialize Lenis smooth scroll on long-form views
  useSmoothScroll();

  return (
    <GalaxyBackground>
      <div className="min-h-screen flex flex-col font-sans selection:bg-[#8B5CF6]/30 selection:text-[#F8F7FF]">
        <SupabaseConfigBanner />
        <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

        <div className="flex-1 flex max-w-full overflow-hidden">
          <Sidebar
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />

          <main className="flex-1 overflow-y-auto min-h-[calc(100vh-3.5rem)] p-4 sm:p-6 lg:p-8 relative">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </GalaxyBackground>
  );
};
