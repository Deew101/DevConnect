import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { SupabaseConfigBanner } from '@/components/common/SupabaseConfigBanner';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

export const AppLayout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <SupabaseConfigBanner />
      <Navbar onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

      <div className="flex-1 flex max-w-full overflow-hidden">
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
