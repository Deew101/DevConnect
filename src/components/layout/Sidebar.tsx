import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  Users2,
  MessageSquare,
  Bell,
  Bookmark,
  Settings,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const { profile, user } = useAuth();
  const { unreadCount } = useNotifications();

  const navigationSections = [
    {
      title: 'PLATFORM',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Discover Developers', path: '/developers', icon: Users },
        { label: 'Projects', path: '/projects', icon: FolderGit2 },
        { label: 'My Teams', path: '/projects?filter=my-teams', icon: Users2 },
      ],
    },
    {
      title: 'COLLABORATION',
      items: [
        { label: 'Messages', path: '/messages', icon: MessageSquare },
        {
          label: 'Notifications',
          path: '/notifications',
          icon: Bell,
          badge: unreadCount > 0 ? unreadCount : undefined,
        },
        { label: 'Saved Projects', path: '/projects?filter=saved', icon: Bookmark },
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        { label: 'Settings & Skills', path: '/profile/edit', icon: Settings },
      ],
    },
  ];

  const content = (
    <aside className="w-60 h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col justify-between border-r border-white/[0.08] bg-[#07090e] p-3 text-slate-300 select-none">
      <div className="space-y-5 overflow-y-auto pr-1">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <span className="px-2.5 text-[10px] font-mono font-bold tracking-wider text-slate-500">
              {section.title}
            </span>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group',
                      isActive
                        ? 'bg-white/[0.08] text-white shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5">
                        <item.icon
                          className={cn(
                            'h-4 w-4 transition-colors',
                            isActive ? 'text-sky-400' : 'text-slate-500 group-hover:text-slate-300'
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-sky-500 text-[9px] font-bold text-slate-950 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* AI Matchmaker promo badge */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-sky-950/30 via-[#0d121c] to-indigo-950/30 border border-sky-500/20 text-xs">
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold text-[11px] mb-1">
            <Sparkles className="h-3 w-3" /> AI Teammate Matching
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Matches project tech stacks against developer candidate profiles in real-time.
          </p>
        </div>
      </div>

      {/* User profile mini footer */}
      {user && (
        <div className="pt-3 border-t border-white/[0.08]">
          <NavLink
            to={`/profile/${profile?.username || 'me'}`}
            onClick={onClose}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-colors group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                src={profile?.avatar_url}
                name={profile?.full_name || user.email}
                size="sm"
                status={profile?.availability_status}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate group-hover:text-sky-300 transition-colors">
                  {profile?.full_name || 'Developer'}
                </p>
                <p className="text-[10px] text-slate-500 font-mono truncate">
                  @{profile?.username || 'user'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
          </NavLink>
        </div>
      )}
    </aside>
  );

  return (
    <>
      <div className="hidden md:block">{content}</div>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex flex-col w-60 max-w-xs bg-[#07090e] z-10 border-r border-white/[0.08]">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
