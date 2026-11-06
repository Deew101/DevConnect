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
  ExternalLink,
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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
          )}

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                Dev<span className="text-sky-400">Connect</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 border border-white/[0.08] px-1.5 py-0.2 rounded bg-slate-900/60">
                PRO
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Command Bar / Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search developers, projects, tech stacks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-12 rounded-lg bg-[#0d111a] border border-white/[0.08] text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-0.5 text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-white/[0.06]">
              <Command className="h-2.5 w-2.5" /> K
            </div>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Create Project Pill */}
          <Link to="/projects/new" className="hidden sm:block">
            <Button variant="secondary" size="sm" className="h-7 text-xs gap-1.5 font-medium border-white/[0.08]">
              <Plus className="h-3.5 w-3.5 text-sky-400" /> Create Project
            </Button>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user && (
            <>
              {/* Messages Shortcut */}
              <Link
                to="/messages"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors relative"
                title="Messages"
              >
                <MessageSquare className="h-4 w-4" />
              </Link>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-sky-500 text-[9px] font-bold text-slate-950 ring-2 ring-[#07090e]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/[0.1] bg-[#0c1017] shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95">
                    <div className="flex items-center justify-between p-3.5 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">Notifications</span>
                        {unreadCount > 0 && (
                          <Badge variant="cyan" className="text-[10px] py-0 px-1.5">
                            {unreadCount} new
                          </Badge>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-sky-400 hover:text-sky-300 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">
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
                            className={`p-3 hover:bg-white/[0.04] cursor-pointer transition-colors flex items-start gap-2.5 ${
                              !notif.is_read ? 'bg-sky-500/[0.04]' : ''
                            }`}
                          >
                            <Avatar
                              src={notif.sender?.avatar_url}
                              name={notif.sender?.full_name || 'System'}
                              size="sm"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <p className="font-semibold text-white truncate">{notif.title}</p>
                              <p className="text-slate-400 line-clamp-2 text-[11px] mt-0.5">{notif.content}</p>
                              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                                {formatTimeAgo(notif.created_at)}
                              </span>
                            </div>
                            {!notif.is_read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-1" />
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2 border-t border-white/[0.08] bg-slate-950/60 text-center">
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-sky-400 hover:text-sky-300 font-medium"
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
                  <button className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-sky-500/40 transition-all outline-none">
                    <Avatar
                      src={profile?.avatar_url}
                      name={profile?.full_name || user?.email}
                      size="sm"
                      status={profile?.availability_status}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5">
                  <DropdownMenuLabel className="p-2">
                    <p className="text-xs font-bold text-white truncate">
                      {profile?.full_name || 'Developer'}
                    </p>
                    <p className="text-[11px] text-sky-400 font-mono truncate">
                      @{profile?.username || 'user'}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/profile/${profile?.username || 'me'}`)}>
                    <User className="h-3.5 w-3.5 text-sky-400" /> Public Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile/edit')}>
                    <Settings className="h-3.5 w-3.5 text-slate-400" /> Settings & Skills
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
