import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  UserPlus,
  FolderGit2,
  CheckSquare,
  MessageSquare,
  Trash2,
  ExternalLink,
  Check,
  X,
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimeAgo } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification, refreshNotifications } =
    useNotifications();
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

      // Update connection to accepted
      await supabase
        .from('connections')
        .update({ status: 'accepted' })
        .eq('requester_id', requesterId)
        .eq('receiver_id', user.id);

      // Notify requester
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

      // Add to project members
      await supabase.from('project_members').insert({
        project_id: projectId,
        user_id: user.id,
        role: 'contributor',
      });

      // Update invitation record
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
        return <UserPlus className="h-4 w-4 text-cyan-400" />;
      case 'project_invite':
      case 'project_update':
        return <FolderGit2 className="h-4 w-4 text-violet-400" />;
      case 'task_assigned':
        return <CheckSquare className="h-4 w-4 text-emerald-400" />;
      case 'new_message':
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      default:
        return <Bell className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="cyan" className="font-mono text-xs">
                {unreadCount} Unread
              </Badge>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time activity logs, project invitations, and connection requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-xs">
              <Check className="h-3.5 w-3.5 mr-1" /> Mark all read
            </Button>
          )}

          <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                filter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                filter === 'unread' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'
              }`}
            >
              Unread
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <Card className="border-slate-800 bg-[#0d1527]/90 shadow-xl overflow-hidden divide-y divide-slate-800/60">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <Bell className="h-10 w-10 text-slate-700 mx-auto mb-3" />
            <h4 className="font-semibold text-white text-sm">All caught up!</h4>
            <p className="mt-1">You have no {filter === 'unread' ? 'unread' : ''} notifications right now.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                !notif.is_read ? 'bg-cyan-950/20' : 'hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/80 flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notif.type)}
                </div>

                <div className="min-w-0 flex-1 text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white text-sm truncate">{notif.title}</span>
                    {!notif.is_read && (
                      <span className="h-2 w-2 rounded-full bg-cyan-400 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    {notif.sender && (
                      <span className="font-semibold text-cyan-300">
                        {notif.sender.full_name}{' '}
                      </span>
                    )}
                    {notif.content}
                  </p>

                  <span className="text-[10px] text-slate-500 font-mono mt-1.5 block">
                    {formatTimeAgo(notif.created_at)}
                  </span>

                  {/* Contextual Action Buttons for requests & invites */}
                  {notif.type === 'connection_request' && !notif.is_read && (
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        isLoading={actionLoadingId === notif.id}
                        onClick={() => handleAcceptConnection(notif)}
                        className="h-8 text-xs font-semibold"
                      >
                        Accept Request
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notif.id)}
                        className="h-8 text-xs text-slate-400"
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}

                  {notif.type === 'project_invite' && !notif.is_read && (
                    <div className="mt-3 flex items-center gap-2">
                      <Button
                        variant="glow"
                        size="sm"
                        isLoading={actionLoadingId === notif.id}
                        onClick={() => handleAcceptInvite(notif)}
                        className="h-8 text-xs font-semibold"
                      >
                        Accept & Join Project
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notif.id)}
                        className="h-8 text-xs text-slate-400"
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Dismiss / Delete button */}
              <button
                onClick={() => clearNotification(notif.id)}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="Remove notification"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
