import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  UserPlus,
  FolderGit2,
  CheckSquare,
  MessageSquare,
  Trash2,
  Check,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimeAgo } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    refreshNotifications,
  } = useNotifications();
  const { user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;

  const handleAcceptConnection = async (notif: any) => {
    if (!user) return;
    setActionLoadingId(notif.id);
    try {
      const requesterId = notif.data?.requester_id || notif.sender_id;

      await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('requester_id', requesterId)
        .eq('receiver_id', user.id);

      await supabase.from('notifications').insert({
        user_id: requesterId,
        sender_id: user.id,
        type: 'connection_accepted',
        title: 'Connection Accepted',
        content: 'accepted your connection request on DevConnect.',
      });

      await markAsRead(notif.id);
      toast({ title: 'Connection accepted!', type: 'success' });
      refreshNotifications();
    } catch (err: any) {
      toast({ title: 'Failed to accept', description: err.message, type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAcceptInvite = async (notif: any) => {
    if (!user) return;
    setActionLoadingId(notif.id);
    try {
      const projectId = notif.data?.project_id;
      if (!projectId) throw new Error('Project ID missing');

      await supabase.from('project_members').insert({
        project_id: projectId,
        user_id: user.id,
        role: 'contributor',
      });

      await supabase
        .from('project_invitations')
        .update({ status: 'accepted' })
        .eq('project_id', projectId)
        .eq('receiver_id', user.id);

      await markAsRead(notif.id);
      toast({ title: 'Joined project workspace successfully!', type: 'success' });
      refreshNotifications();
    } catch (err: any) {
      toast({ title: 'Failed to join project', description: err.message, type: 'error' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
      case 'connection_accepted':
        return <UserPlus className="h-4 w-4 text-[#648BFF]" />;
      case 'project_invite':
      case 'project_update':
        return <FolderGit2 className="h-4 w-4 text-[#9B7BFF]" />;
      case 'task_assigned':
        return <CheckSquare className="h-4 w-4 text-[#35C98A]" />;
      case 'new_message':
        return <MessageSquare className="h-4 w-4 text-[#648BFF]" />;
      default:
        return <Bell className="h-4 w-4 text-[#929DB2]" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-6 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-wider text-[#648BFF] uppercase font-semibold">
              DevConnect Stream
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#648BFF]" />
            <span className="text-xs font-mono text-[#929DB2]">Activity Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F1F5FC] tracking-tight flex items-center gap-2.5">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="cyan" className="font-mono text-xs">
                {unreadCount} Unread
              </Badge>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-[#929DB2] mt-0.5">
            Real-time collaboration alerts, team invitations, and network updates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-8 font-semibold border-[rgba(167,139,250,0.25)] text-[#F8F7FF] hover:bg-[#8B5CF6]/20 transition-all font-mono"
            >
              <Check className="h-3.5 w-3.5 mr-1 text-[#A855F7]" /> Mark all read
            </Button>
          )}

          <div className="flex rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.20)] p-0.5 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold font-mono transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-[#8B5CF6]/25 text-[#F8F7FF] border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                  : 'text-[#B8ACD9] hover:text-[#F8F7FF]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg font-semibold font-mono transition-all duration-200 ${
                filter === 'unread'
                  ? 'bg-[#8B5CF6]/25 text-[#F8F7FF] border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.25)]'
                  : 'text-[#B8ACD9] hover:text-[#F8F7FF]'
              }`}
            >
              Unread
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <Card className="border-[rgba(167,139,250,0.20)] bg-[#160E30]/75 backdrop-blur-xl shadow-xl overflow-hidden divide-y divide-[rgba(167,139,250,0.15)] rounded-2xl">
        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center text-[#B8ACD9] text-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#100A24] border border-[rgba(167,139,250,0.25)] flex items-center justify-center mx-auto mb-3 text-[#B8ACD9] shadow-inner shadow-[#8B5CF6]/10">
              <Bell className="h-6 w-6 text-[#A855F7]" />
            </div>
            <h4 className="font-bold text-[#F8F7FF] text-sm">All caught up!</h4>
            <p className="mt-1 text-[#B8ACD9] max-w-xs mx-auto">
              You have no {filter === 'unread' ? 'unread' : ''} notifications at this moment.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                notif.is_read ? 'hover:bg-[#100A24]/40' : 'bg-[#8B5CF6]/10 hover:bg-[#8B5CF6]/15'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2 rounded-xl bg-[#100A24] border border-[rgba(167,139,250,0.20)] flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="space-y-1 min-w-0 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#F8F7FF]">{notif.title}</span>
                    {!notif.is_read && (
                      <span className="h-2 w-2 rounded-full bg-[#D946EF] shadow-[0_0_8px_#D946EF]" />
                    )}
                    <span className="text-[10px] text-[#B8ACD9] font-mono">
                      {formatTimeAgo(notif.created_at)}
                    </span>
                  </div>

                  <p className="text-[#B8ACD9] leading-relaxed">
                    {notif.sender && (
                      <Link
                        to={`/profile/${notif.sender.username}`}
                        className="font-semibold text-[#F8F7FF] hover:text-[#C4B5FD] mr-1 transition-colors"
                      >
                        {notif.sender.full_name}
                      </Link>
                    )}
                    {notif.content}
                  </p>

                  {/* Context Actions */}
                  {notif.type === 'connection_request' && (
                    <div className="pt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAcceptConnection(notif)}
                        isLoading={actionLoadingId === notif.id}
                        className="h-7 text-xs font-semibold px-3 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-sm shadow-[#8B5CF6]/25"
                      >
                        Accept Request
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => clearNotification(notif.id)}
                        className="h-7 text-xs border-[rgba(167,139,250,0.25)] text-[#F8F7FF] hover:bg-[#8B5CF6]/20 font-mono"
                      >
                        Ignore
                      </Button>
                    </div>
                  )}

                  {notif.type === 'project_invite' && (
                    <div className="pt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleAcceptInvite(notif)}
                        isLoading={actionLoadingId === notif.id}
                        className="h-7 text-xs font-semibold px-3 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-sm shadow-[#8B5CF6]/25"
                      >
                        Join Workspace
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => clearNotification(notif.id)}
                        className="h-7 text-xs border-[rgba(167,139,250,0.25)] text-[#F8F7FF] hover:bg-[#8B5CF6]/20 font-mono"
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {!notif.is_read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="p-1.5 rounded-lg text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#8B5CF6]/20 transition-all"
                    title="Mark as read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => clearNotification(notif.id)}
                  className="p-1.5 rounded-lg text-[#B8ACD9] hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  title="Remove notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </Card>
    </motion.div>
  );
};
