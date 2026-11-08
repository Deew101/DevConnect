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
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  GitBranch,
  Github,
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
      id: 'workspace',
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Discover Developers', path: '/developers', icon: Users },
        { label: 'GitHub Developers', path: '/developers?tab=github', icon: Github },
        { label: 'Explore Projects', path: '/projects', icon: Compass },
        { label: 'Open Source Repos', path: '/repositories', icon: GitBranch },
        { label: 'Collaborative Teams', path: '/teams', icon: Users2 },
        { label: 'My Projects', path: '/projects?filter=my-projects', icon: FolderGit2 },
      ],
    },
    {
      id: 'communication',
      title: 'COMMUNICATION',
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
      id: 'preferences',
      title: 'PREFERENCES',
      items: [
        { label: 'Settings & Skills', path: '/profile/edit', icon: Settings },
      ],
    },
  ];

  const content = (
    <aside
      className={cn(
        'h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col justify-between border-r border-[#273249] bg-[#090C13] p-3 text-[#929DB2] transition-all duration-300 select-none z-30 font-sans',
        isCollapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      <div className="space-y-5 overflow-y-auto pr-1 no-scrollbar">
        {/* Collapse Toggle Header (desktop only) */}
        <div className="hidden lg:flex items-center justify-between px-2 pt-1 pb-1 border-b border-[#273249]/60">
          {!isCollapsed && (
            <span className="text-[10px] font-mono tracking-widest text-[#929DB2] uppercase font-semibold">
              NAVIGATION
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-[#929DB2] hover:text-[#F4F6FC] hover:bg-[#151F30] transition-colors ml-auto"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {navigationSections.map((section, idx) => (
          <div key={section.id} className="space-y-1">
            {idx > 0 && <div className="h-px bg-[#273249]/50 my-2 mx-2" />}
            {!isCollapsed && (
              <div className="px-2.5 pt-2 pb-1">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-[#6D95FF]/90 uppercase">
                  {section.title}
                </span>
              </div>
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
                        'flex items-center rounded-lg text-xs font-medium transition-all group relative',
                        isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2',
                        isActive
                          ? 'bg-[#151F30] text-[#F4F6FC] border border-[#273249] shadow-sm font-semibold'
                          : 'text-[#929DB2] hover:text-[#F4F6FC] hover:bg-[#151F30]/50'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <item.icon
                            className={cn(
                              'h-4 w-4 transition-colors flex-shrink-0',
                              isActive ? 'text-[#6D95FF]' : 'text-[#929DB2] group-hover:text-[#F4F6FC]'
                            )}
                          />
                          {!isCollapsed && <span>{item.label}</span>}
                        </div>

                        {!isCollapsed && item.badge && (
                          <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#6D95FF] px-1 text-[10px] font-mono font-bold text-[#090C13]">
                            {item.badge}
                          </span>
                        )}

                        {isActive && (
                          <motion.div
                            layoutId="activeSidebarIndicator"
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r-full bg-[#6D95FF]"
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
                      <TooltipContent side="right" className="bg-[#151F30] text-[#F4F6FC] border border-[#273249] font-mono text-xs">
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
              'flex items-center gap-2.5 rounded-xl p-2 transition-all hover:bg-[#151F30] border border-transparent hover:border-[#273249] group',
              isCollapsed && 'justify-center p-1.5'
            )}
          >
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name || user.email}
              size="sm"
              status={profile?.availability_status}
            />

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#F4F6FC] group-hover:text-[#6D95FF] transition-colors">
                  {profile?.full_name || 'Developer'}
                </p>
                <p className="truncate text-[10px] text-[#929DB2] font-mono">
                  @{profile?.username || 'anonymous'}
                </p>
              </div>
            )}

            {!isCollapsed && (
              <ChevronRight className="h-3.5 w-3.5 text-[#929DB2] group-hover:text-[#6D95FF] transition-colors flex-shrink-0" />
            )}
          </NavLink>
        </div>
      )}
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">{content}</div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-[#090C13] border-r border-[#273249]">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
