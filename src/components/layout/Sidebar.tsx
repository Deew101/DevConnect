import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const navigationSections = [
    {
      id: 'workspace',
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Discover Developers', path: '/developers', icon: Users },
        { label: 'GitHub Developers', path: '/github-developers', icon: Github },
        { label: 'Explore Projects', path: '/projects', icon: Compass },
        { label: 'Open Source Repos', path: '/repositories', icon: GitBranch },
        { label: 'Collaborative Teams', path: '/teams', icon: Users2 },
        { label: 'My Projects', path: '/my-projects', icon: FolderGit2 },
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
        { label: 'Saved Projects', path: '/saved-projects', icon: Bookmark },
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

  // Exact route matching ensures only one navigation item is ever highlighted at a time
  const isItemActive = (targetPath: string) => {
    const currentPath = location.pathname;
    if (targetPath === '/projects') {
      return currentPath === '/projects';
    }
    if (targetPath === '/developers') {
      return currentPath === '/developers';
    }
    if (targetPath === '/github-developers') {
      return currentPath === '/github-developers';
    }
    if (targetPath === '/repositories') {
      return currentPath === '/repositories';
    }
    if (targetPath === '/my-projects') {
      return currentPath === '/my-projects';
    }
    if (targetPath === '/saved-projects') {
      return currentPath === '/saved-projects';
    }
    return currentPath === targetPath;
  };

  const content = (
    <aside
      className={cn(
        'h-[calc(100vh-3.5rem)] sticky top-14 flex flex-col justify-between border-r border-[rgba(167,139,250,0.20)] bg-[#080514]/85 backdrop-blur-xl p-3 text-[#B8ACD9] transition-all duration-300 select-none z-30 font-sans',
        isCollapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      <div className="space-y-5 overflow-y-auto pr-1 no-scrollbar">
        {/* Collapse Toggle Header (desktop only) */}
        <div className="hidden lg:flex items-center justify-between px-2 pt-1 pb-1 border-b border-[rgba(167,139,250,0.20)]">
          {!isCollapsed && (
            <span className="text-[10px] font-mono tracking-widest text-[#C4B5FD] uppercase font-semibold">
              NAVIGATION
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30] transition-colors ml-auto"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        {navigationSections.map((section, idx) => (
          <div key={section.id} className="space-y-1">
            {idx > 0 && <div className="h-px bg-[rgba(167,139,250,0.15)] my-2.5 mx-2" />}
            {!isCollapsed && (
              <div className="px-2.5 pt-2 pb-1">
                <span className="text-[10px] font-mono font-semibold tracking-wider text-[#C4B5FD] uppercase">
                  {section.title}
                </span>
              </div>
            )}
            <div className="space-y-0.5 pt-0.5">
              {section.items.map((item) => {
                const isActive = isItemActive(item.path);
                const navLink = (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      'flex items-center rounded-xl text-xs font-medium transition-all duration-200 group relative',
                      'hover:translate-x-1.5',
                      isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2',
                      isActive
                        ? 'bg-[#8B5CF6]/15 text-[#F8F7FF] border border-[#8B5CF6]/40 shadow-[0_0_15px_rgba(139,92,246,0.2)] font-semibold'
                        : 'text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30]/70'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          'h-4 w-4 transition-all duration-200 flex-shrink-0',
                          isActive
                            ? 'text-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                            : 'text-[#B8ACD9] group-hover:text-[#F8F7FF] group-hover:scale-110'
                        )}
                      />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#D946EF] px-1 text-[10px] font-mono font-bold text-[#080514] shadow-[0_0_8px_rgba(217,70,239,0.5)]">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <motion.div
                        layoutId="activeSidebarIndicator"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-[#8B5CF6] via-[#A855F7] to-[#D946EF] shadow-[0_0_10px_#A855F7]"
                      />
                    )}
                  </Link>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.path}>
                      <TooltipTrigger className="block w-full text-left">{navLink}</TooltipTrigger>
                      <TooltipContent side="right" className="bg-[#160E30] text-[#F8F7FF] border border-[rgba(167,139,250,0.25)] font-mono text-xs">
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
        <div className="pt-3 border-t border-[rgba(167,139,250,0.20)]">
          <Link
            to={`/profile/${profile?.username || 'me'}`}
            onClick={onClose}
            className={cn(
              'flex items-center gap-2.5 rounded-xl p-2 transition-all hover:translate-x-1 duration-200 bg-[#160E30]/60 hover:bg-[#1E1442] border border-[rgba(167,139,250,0.15)] hover:border-[#8B5CF6]/40 group shadow-sm',
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
                <p className="truncate text-xs font-semibold text-[#F8F7FF] group-hover:text-[#A855F7] transition-colors">
                  {profile?.full_name || 'Developer'}
                </p>
                <p className="truncate text-[10px] text-[#B8ACD9] font-mono">
                  @{profile?.username || 'anonymous'}
                </p>
              </div>
            )}

            {!isCollapsed && (
              <ChevronRight className="h-3.5 w-3.5 text-[#B8ACD9] group-hover:text-[#A855F7] transition-colors flex-shrink-0" />
            )}
          </Link>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-[#080514] border-r border-[rgba(167,139,250,0.20)]">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
