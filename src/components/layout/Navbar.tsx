import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Bell,
  MessageSquare,
  Search,
  LogOut,
  User,
  Settings,
  Menu,
  Sun,
  Moon,
  Plus,
  Command,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/DropdownMenu';
import { formatTimeAgo } from '@/lib/utils';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const { user, profile, signOut } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/developers?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(167,139,250,0.20)] bg-[#080514]/90 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3 min-w-0 sm:min-w-[180px]">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30] transition-colors flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#8B5CF6] via-[#A855F7] to-[#D946EF] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30 group-hover:scale-105 transition-transform border border-white/20 flex-shrink-0">
              <Layers className="h-4 w-4 text-[#080514]" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-[#F8F7FF] select-none">
              Dev<span className="text-[#A855F7]">Connect</span>
            </span>
          </Link>
        </div>

        {/* Center: Command Bar / Search Input */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-lg mx-6">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#B8ACD9]" />
            <input
              type="text"
              placeholder="Search engineers, projects, stacks (Press ⌘K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-12 rounded-lg bg-[#100A24] border border-[rgba(167,139,250,0.20)] text-xs text-[#F8F7FF] placeholder:text-[#B8ACD9]/60 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]/40 transition-all font-sans"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-0.5 text-[10px] font-mono text-[#B8ACD9] bg-[#160E30] px-1.5 py-0.5 rounded border border-[rgba(167,139,250,0.20)]">
              <Command className="h-2.5 w-2.5" /> K
            </div>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Quick Create Project Pill */}
          <Link to="/projects/new" className="hidden sm:block">
            <Button variant="secondary" size="sm" className="h-7 text-xs gap-1.5 font-medium border-[rgba(167,139,250,0.20)] bg-[#160E30] hover:bg-[#1E1442] hover:border-[#8B5CF6]/40 text-[#F8F7FF] transition-all">
              <Plus className="h-3.5 w-3.5 text-[#A855F7]" /> Launch Workspace
            </Button>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30] transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user && (
            <>
              {/* Messages Shortcut */}
              <Link
                to="/messages"
                className="p-1.5 rounded-lg text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30] transition-colors relative"
                title="Messages"
              >
                <MessageSquare className="h-4 w-4" />
              </Link>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 rounded-lg text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#160E30] transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#D946EF] text-[9px] font-bold text-[#080514] ring-2 ring-[#080514]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[rgba(167,139,250,0.25)] bg-[#160E30] shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
                    <div className="flex items-center justify-between p-3.5 border-b border-[rgba(167,139,250,0.20)]">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-[#F8F7FF] text-xs">Activity Stream</span>
                        {unreadCount > 0 && (
                          <Badge variant="cyan" className="text-[10px] py-0 px-1.5 bg-[#8B5CF6]/20 text-[#C4B5FD] border-[#8B5CF6]/40 font-mono">
                            {unreadCount} new
                          </Badge>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-[#A855F7] hover:text-[#D946EF] font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-[rgba(167,139,250,0.15)]">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#B8ACD9]">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              setShowNotifications(false);
                            }}
                            className={`p-3 hover:bg-[#1E1442] cursor-pointer transition-colors flex items-start gap-2.5 ${
                              !notif.is_read ? 'bg-[#8B5CF6]/10' : ''
                            }`}
                          >
                            <Avatar
                              src={notif.sender?.avatar_url}
                              name={notif.sender?.full_name || 'System'}
                              size="sm"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <p className="font-semibold text-[#F8F7FF] truncate">{notif.title}</p>
                              <p className="text-[#B8ACD9] line-clamp-2 text-[11px] mt-0.5">{notif.content}</p>
                              <span className="text-[10px] text-[#B8ACD9]/80 font-mono mt-1 block">
                                {formatTimeAgo(notif.created_at)}
                              </span>
                            </div>
                            {!notif.is_read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#D946EF] flex-shrink-0 mt-1" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2 border-t border-[rgba(167,139,250,0.20)] bg-[#100A24] text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-[#A855F7] hover:text-[#C4B5FD] font-medium"
                      >
                        View all notification history
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Dropdown with Radix UI */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#8B5CF6]/40 transition-all outline-none">
                    <Avatar
                      src={profile?.avatar_url}
                      name={profile?.full_name || user?.email}
                      size="sm"
                      status={profile?.availability_status}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5 bg-[#160E30] border-[rgba(167,139,250,0.20)] shadow-2xl rounded-2xl">
                  <DropdownMenuLabel className="p-2">
                    <p className="text-xs font-bold text-[#F8F7FF] truncate">
                      {profile?.full_name || 'Developer'}
                    </p>
                    <p className="text-[11px] text-[#A855F7] font-mono truncate">
                      @{profile?.username || 'user'}
                    </p>
                    <p className="text-[10px] text-[#B8ACD9] truncate mt-0.5">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[rgba(167,139,250,0.15)]" />
                  <DropdownMenuItem onClick={() => navigate(`/profile/${profile?.username || 'me'}`)}>
                    <User className="h-3.5 w-3.5 text-[#A855F7]" /> Public Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile/edit')}>
                    <Settings className="h-3.5 w-3.5 text-[#B8ACD9]" /> Settings & Skills
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[rgba(167,139,250,0.15)]" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-rose-400 focus:bg-rose-500/10 focus:text-rose-300"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!user && (
            <div className="flex items-center gap-2">
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?tab=register">
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
