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
    <header className="sticky top-0 z-40 w-full border-b border-[#273249] bg-[#090C13]/95 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle & Editorial Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg text-[#929DB2] hover:text-[#F4F6FC] hover:bg-[#151F30] transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#6D95FF] to-[#9D83FF] flex items-center justify-center shadow-lg shadow-[#6D95FF]/20 group-hover:scale-105 transition-transform border border-white/20">
              <Layers className="h-4 w-4 text-[#090C13]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-lg tracking-tight text-[#F4F6FC]">
                Dev<span className="text-[#6D95FF]">Connect</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono tracking-wider text-[#929DB2] border border-[#273249] px-2 py-0.5 rounded bg-[#101725] uppercase font-medium">
                EDITION 2026
              </span>
              <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full bg-amber-500/10 uppercase" title="Populated demonstration community data for practical showcase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                DEMO COMMUNITY DATA
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Command Bar / Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#929DB2]" />
            <input
              type="text"
              placeholder="Search engineers, projects, stacks (Press ⌘K)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-12 rounded-lg bg-[#101725] border border-[#273249] text-xs text-[#F4F6FC] placeholder:text-[#929DB2] focus:outline-none focus:border-[#6D95FF] focus:ring-1 focus:ring-[#6D95FF]/30 transition-all font-sans"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-0.5 text-[10px] font-mono text-[#929DB2] bg-[#151F30] px-1.5 py-0.5 rounded border border-[#273249]">
              <Command className="h-2.5 w-2.5" /> K
            </div>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Create Project Pill */}
          <Link to="/projects/new" className="hidden sm:block">
            <Button variant="secondary" size="sm" className="h-7 text-xs gap-1.5 font-medium border-[#273249] bg-[#101725] hover:bg-[#151F30] text-[#F4F6FC]">
              <Plus className="h-3.5 w-3.5 text-[#6D95FF]" /> Launch Workspace
            </Button>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-[#929DB2] hover:text-[#F4F6FC] hover:bg-[#151F30] transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user && (
            <>
              {/* Messages Shortcut */}
              <Link
                to="/messages"
                className="p-1.5 rounded-lg text-[#929DB2] hover:text-[#F4F6FC] hover:bg-[#151F30] transition-colors relative"
                title="Messages"
              >
                <MessageSquare className="h-4 w-4" />
              </Link>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 rounded-lg text-[#929DB2] hover:text-[#F4F6FC] hover:bg-[#151F30] transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#6D95FF] text-[9px] font-bold text-[#090C13] ring-2 ring-[#090C13]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#273249] bg-[#151F30] shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
                    <div className="flex items-center justify-between p-3.5 border-b border-[#273249]">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-[#F4F6FC] text-xs">Activity Stream</span>
                        {unreadCount > 0 && (
                          <Badge variant="cyan" className="text-[10px] py-0 px-1.5 bg-[#6D95FF]/20 text-[#6D95FF] border-[#6D95FF]/40 font-mono">
                            {unreadCount} new
                          </Badge>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-[#6D95FF] hover:text-[#9D83FF] font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-[#273249]/60">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#929DB2]">
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
                            className={`p-3 hover:bg-[#1C2940] cursor-pointer transition-colors flex items-start gap-2.5 ${
                              !notif.is_read ? 'bg-[#6D95FF]/10' : ''
                            }`}
                          >
                            <Avatar
                              src={notif.sender?.avatar_url}
                              name={notif.sender?.full_name || 'System'}
                              size="sm"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <p className="font-semibold text-[#F4F6FC] truncate">{notif.title}</p>
                              <p className="text-[#929DB2] line-clamp-2 text-[11px] mt-0.5">{notif.content}</p>
                              <span className="text-[10px] text-[#929DB2]/80 font-mono mt-1 block">
                                {formatTimeAgo(notif.created_at)}
                              </span>
                            </div>
                            {!notif.is_read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-[#6D95FF] flex-shrink-0 mt-1" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2 border-t border-[#273249] bg-[#101725] text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-[#6D95FF] hover:text-[#9D83FF] font-medium"
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
                  <button className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#6D95FF]/40 transition-all outline-none">
                    <Avatar
                      src={profile?.avatar_url}
                      name={profile?.full_name || user?.email}
                      size="sm"
                      status={profile?.availability_status}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5 bg-[#151F30] border-[#273249]">
                  <DropdownMenuLabel className="p-2">
                    <p className="text-xs font-bold text-[#F4F6FC] truncate">
                      {profile?.full_name || 'Developer'}
                    </p>
                    <p className="text-[11px] text-[#6D95FF] font-mono truncate">
                      @{profile?.username || 'user'}
                    </p>
                    <p className="text-[10px] text-[#929DB2] truncate mt-0.5">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#273249]" />
                  <DropdownMenuItem onClick={() => navigate(`/profile/${profile?.username || 'me'}`)}>
                    <User className="h-3.5 w-3.5 text-[#6D95FF]" /> Public Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile/edit')}>
                    <Settings className="h-3.5 w-3.5 text-[#929DB2]" /> Settings & Skills
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#273249]" />
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
