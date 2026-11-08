import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { SupabaseConfigBanner } from '@/components/common/SupabaseConfigBanner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { GalaxyBackground } from '@/components/galaxy';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Initialize Lenis smooth scroll on long-form views
  useSmoothScroll();

  return (
    <GalaxyBackground>
      <div className="min-h-screen flex flex-col font-sans selection:bg-[#8B5CF6]/30 selection:text-[#F8F7FF]">
        <SupabaseConfigBanner />
        <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

        <div className="flex-1 flex max-w-full min-w-0">
          <Sidebar
            isOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
          />

          <main className="flex-1 min-w-0 min-h-[calc(100vh-3.5rem)] px-4 sm:px-6 lg:px-8 py-6 relative">
            <div className="max-w-7xl mx-auto w-full">
              <ErrorBoundary>
                <motion.div
                  key={location.pathname}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 22, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <Outlet />
                </motion.div>
              </ErrorBoundary>
            </div>
          </main>
        </div>
      </div>
    </GalaxyBackground>
  );
};
