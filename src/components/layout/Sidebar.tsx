import React, { useState, useRef, useEffect } from 'react';
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

  const desktopNavContainerRef = useRef<HTMLDivElement | null>(null);
  const desktopActiveItemRef = useRef<HTMLAnchorElement | null>(null);
  const mobileNavContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileActiveItemRef = useRef<HTMLAnchorElement | null>(null);

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

  // Exact route matching ensures only one navigation item is ever active at a time
  const isItemActive = (targetPath: string) => {
    const currentPath = location.pathname;
    if (targetPath === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/';
    }
    if (targetPath === '/profile/edit') {
      return currentPath === '/profile/edit' || currentPath === '/settings';
    }
    return currentPath === targetPath;
  };

  // Automatically scroll active item into view when navigating
  useEffect(() => {
    if (desktopActiveItemRef.current) {
      desktopActiveItemRef.current.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
    if (mobileActiveItemRef.current) {
      mobileActiveItemRef.current.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [location.pathname]);

  const renderNavigationContent = (isMobile = false) => {
    const collapsed = isMobile ? false : isCollapsed;
    const layoutIdPrefix = isMobile ? 'mobile-' : 'desktop-';

    return (
      <div
        className={cn(
          'flex flex-col h-full overflow-hidden select-none font-sans',
          isMobile ? 'w-full' : (collapsed ? 'w-[68px]' : 'w-64')
        )}
      >
        {/* 1. Fixed Sidebar Header (desktop collapse toggle) */}
        {!isMobile && (
          <div className="flex-shrink-0 flex items-center justify-between px-3 h-11 border-b border-[rgba(167,139,250,0.18)] bg-[#080514]/90">
            {!collapsed && (
              <span className="text-[10px] font-mono tracking-widest text-[#C4B5FD] uppercase font-semibold">
                NAVIGATION
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30] transition-colors ml-auto focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6]"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
          </div>
        )}

        {/* 2. Independently Scrollable Navigation Body */}
        <div
          ref={isMobile ? mobileNavContainerRef : desktopNavContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-2.5 py-3 space-y-4 sidebar-scroll focus:outline-none"
          tabIndex={-1}
        >
          {navigationSections.map((section, idx) => (
            <div key={section.id} className="space-y-1">
              {idx > 0 && <div className="h-px bg-[rgba(167,139,250,0.14)] my-2.5 mx-1" />}
              {!collapsed && (
                <div className="px-2 pt-1 pb-1">
                  <span className="text-[10px] font-mono font-semibold tracking-wider text-[#C4B5FD]/90 uppercase">
                    {section.title}
                  </span>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = isItemActive(item.path);

                  const navLinkElement = (
                    <Link
                      key={item.path}
                      ref={
                        isActive
                          ? (isMobile ? mobileActiveItemRef : desktopActiveItemRef)
                          : undefined
                      }
                      to={item.path}
                      onClick={onClose}
                      className={cn(
                        // Identical dimensions & box-sizing for all navigation rows
                        'relative flex items-center h-10 w-full rounded-xl text-xs font-medium box-border transition-colors duration-150 group outline-none',
                        'focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/70 focus-visible:ring-offset-1 focus-visible:ring-offset-[#080514]',
                        collapsed ? 'justify-center px-0' : 'justify-between px-3',
                        isActive
                          ? 'text-[#F8F7FF] font-semibold'
                          : 'text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30]/70'
                      )}
                    >
                      {/* Active decorative background pill (animated via layoutId) */}
                      {isActive && (
                        <motion.div
                          layoutId={`${layoutIdPrefix}activeSidebarHighlight`}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="absolute inset-0 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 shadow-[0_0_15px_rgba(139,92,246,0.22)] pointer-events-none"
                        />
                      )}

                      {/* Active left indicator pill (vertically centered and aligned to left edge) */}
                      {isActive && (
                        <motion.div
                          layoutId={`${layoutIdPrefix}activeSidebarIndicator`}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-[#8B5CF6] via-[#A855F7] to-[#D946EF] shadow-[0_0_10px_#A855F7] pointer-events-none z-10"
                        />
                      )}

                      {/* Icon + Label */}
                      <div className={cn('flex items-center gap-3 relative z-10 min-w-0', collapsed && 'justify-center')}>
                        <item.icon
                          className={cn(
                            'h-4 w-4 transition-all duration-200 flex-shrink-0',
                            isActive
                              ? 'text-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                              : 'text-[#B8ACD9] group-hover:text-[#F8F7FF] group-hover:scale-105'
                          )}
                        />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {/* Notification / Numeric Badge */}
                      {!collapsed && item.badge && (
                        <span className="relative z-10 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#D946EF] px-1 text-[10px] font-mono font-bold text-[#080514] shadow-[0_0_8px_rgba(217,70,239,0.5)] flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );

                  if (collapsed) {
                    return (
                      <Tooltip key={item.path}>
                        <TooltipTrigger className="block w-full text-left">{navLinkElement}</TooltipTrigger>
                        <TooltipContent side="right" className="bg-[#160E30] text-[#F8F7FF] border border-[rgba(167,139,250,0.25)] font-mono text-xs">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return navLinkElement;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* 3. Fixed Footer User Profile Mini-Card (never overlaps navigation content) */}
        {user && (
          <div className="flex-shrink-0 relative z-10 p-2.5 border-t border-[rgba(167,139,250,0.20)] bg-[#080514]/95 backdrop-blur-md">
            <Link
              to={`/profile/${profile?.username || 'me'}`}
              onClick={onClose}
              className={cn(
                'flex items-center gap-2.5 rounded-xl p-2 transition-colors duration-150 bg-[#160E30]/70 hover:bg-[#1E1442] border border-[rgba(167,139,250,0.18)] hover:border-[#8B5CF6]/50 group shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#8B5CF6]',
                collapsed && 'justify-center p-1.5'
              )}
            >
              <Avatar
                src={profile?.avatar_url}
                name={profile?.full_name || user.email}
                size="sm"
                status={profile?.availability_status}
              />

              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[#F8F7FF] group-hover:text-[#A855F7] transition-colors">
                    {profile?.full_name || 'Developer'}
                  </p>
                  <p className="truncate text-[10px] text-[#B8ACD9] font-mono">
                    @{profile?.username || 'anonymous'}
                  </p>
                </div>
              )}

              {!collapsed && (
                <ChevronRight className="h-3.5 w-3.5 text-[#B8ACD9] group-hover:text-[#A855F7] transition-colors flex-shrink-0" />
              )}
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar: docked vertically below fixed header (top-14) with independent inner scroll */}
      <aside
        className={cn(
          'hidden md:block h-[calc(100dvh-3.5rem)] sticky top-14 border-r border-[rgba(167,139,250,0.20)] bg-[#080514]/90 backdrop-blur-xl text-[#B8ACD9] transition-all duration-300 z-30 overflow-hidden flex-shrink-0',
          isCollapsed ? 'w-[68px]' : 'w-64'
        )}
      >
        {renderNavigationContent(false)}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-[#080514] border-r border-[rgba(167,139,250,0.20)] h-full overflow-hidden shadow-2xl">
            {renderNavigationContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
