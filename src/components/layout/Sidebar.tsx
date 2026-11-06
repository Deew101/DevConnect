import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  MessageSquare,
  Bell,
  UserCheck,
  Sparkles,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Discover Developers', path: '/developers', icon: Users },
    { label: 'Projects & Workspaces', path: '/projects', icon: FolderGit2 },
    { label: 'Messages', path: '/messages', icon: MessageSquare },
    {
      label: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'My Profile', path: `/profile/${profile?.username || 'me'}`, icon: UserCheck },
  ];

  const content = (
    <aside className="w-64 h-[calc(100vh-4rem)] sticky top-16 flex flex-col justify-between border-r border-slate-800/80 bg-[#070b13] p-4 text-slate-300">
      <div className="space-y-6">
        {/* Quick Action Button */}
        <NavLink to="/projects/new" onClick={onClose}>
          <div className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-all shadow-sm">
            <PlusCircle className="h-4 w-4" /> Create Project
          </div>
        </NavLink>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                  isActive
                    ? 'bg-slate-800/90 text-white border border-slate-700/80 shadow-sm shadow-cyan-950/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      )}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Pro / AI Teammate Matching Banner */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/20">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs mb-1">
            <Sparkles className="h-3.5 w-3.5" /> AI Teammate Matching
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Matches candidates against tech stack, seniority and availability scores.
          </p>
        </div>

        <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Supabase RLS Active
          </span>
          <span className="font-mono text-[10px]">v1.0.0</span>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block">{content}</div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex flex-col w-64 max-w-xs bg-[#070b13] z-10">{content}</div>
        </div>
      )}
    </>
  );
};
