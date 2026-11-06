import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Compass,
  FolderGit2,
  Users2,
  MessageSquare,
  Bell,
  Bookmark,
  Settings,
  Sparkles,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { Avatar } from '@/components/ui/Avatar';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const { profile, user } = useAuth();
  const { unreadCount } = useNotifications();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationSections = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Discover Developers', path: '/developers', icon: Users },
        { label: 'Explore Projects', path: '/projects', icon: Compass },
        { label: 'My Projects', path: '/projects?filter=my-projects', icon: FolderGit2 },
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
        { label: 'Settings', path: '/profile/edit', icon: Settings },
      ],
    },
  ];

  const content = (
    <aside
      className={cn(
        'h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col justify-between border-r border-[#273249] bg-[#090C13] p-3 text-[#929DB2] transition-all duration-300 select-none z-30',
        isCollapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      <div className="space-y-5 overflow-y-auto pr-1 no-scrollbar">
        {/* Collapse Toggle Header (desktop only) */}
        <div className="hidden lg:flex items-center justify-between px-2 pt-1 pb-1">
          {!isCollapsed && (
            <span className="text-[10px] font-mono tracking-wider text-[#929DB2]/80 uppercase font-semibold">
              DevConnect Ecosystem
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-[#929DB2] hover:text-[#F1F5FC] hover:bg-[#141C2B] transition-colors ml-auto"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <span className="px-2.5 text-[10px] font-mono font-bold tracking-wider text-[#929DB2]/60">
                {section.title}
              </span>
            )}
            <div className="space-y-0.5 pt-0.5">
              {section.items.map((item) => {
                const navLink = (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-xl text-xs font-medium transition-all group relative',
                        isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2',
                        isActive
                          ? 'bg-[#141C2B] text-[#F1F5FC] border border-[#273249] shadow-sm font-semibold'
                          : 'text-[#929DB2] hover:text-[#F1F5FC] hover:bg-[#141C2B]/50'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={cn(
                              'h-4 w-4 transition-colors flex-shrink-0',
                              isActive ? 'text-[#648BFF]' : 'text-[#929DB2] group-hover:text-[#F1F5FC]'
                            )}
                          />
                          {!isCollapsed && <span>{item.label}</span>}
                        </div>

                        {!isCollapsed && item.badge !== undefined && (
                          <span className="flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#648BFF] text-[9px] font-bold text-white font-mono shadow-sm">
                            {item.badge}
                          </span>
                        )}

                        {isCollapsed && item.badge !== undefined && (
                          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#648BFF] ring-2 ring-[#090C13]" />
                        )}

                        {isActive && (
                          <motion.div
                            layoutId="activeSidebarIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-[#648BFF]"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.path}>
                      <TooltipTrigger className="block w-full text-left">{navLink}</TooltipTrigger>
                      <TooltipContent side="right" className="bg-[#141C2B] text-[#F1F5FC] border border-[#273249]">
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return navLink;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer User Profile mini-card */}
      {user && (
        <div className="pt-3 border-t border-[#273249]">
          <NavLink
            to={`/profile/${profile?.username || 'me'}`}
            onClick={onClose}
            className={cn(
              'flex items-center rounded-xl bg-[#0E1420] border border-[#273249] hover:border-[#648BFF]/40 transition-all group',
              isCollapsed ? 'justify-center p-2' : 'gap-3 p-2.5'
            )}
          >
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name || user.email}
              size="sm"
              status={profile?.availability_status}
              className="flex-shrink-0"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-[#F1F5FC] group-hover:text-[#648BFF] transition-colors truncate">
                  {profile?.full_name || 'Developer'}
                </p>
                <p className="text-[10px] text-[#929DB2] font-mono truncate">
                  @{profile?.username || 'user'}
                </p>
              </div>
            )}
            {!isCollapsed && <ChevronRight className="h-3.5 w-3.5 text-[#929DB2] group-hover:text-[#F1F5FC] transition-colors" />}
          </NavLink>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block flex-shrink-0">{content}</div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-[#090C13]/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#090C13] shadow-2xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
