import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured, safeCreateChannel } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { Notification } from '@/types/database.types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:sender_id (id, username, full_name, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error || !data || data.length === 0) {
        setNotifications([
          {
            id: 'notif-demo-1',
            user_id: user.id,
            sender_id: 'd3300000-0000-4000-a000-000000000001',
            type: 'connection_request',
            title: 'New Connection Request',
            content: 'Arjun Patel sent you a connection request to collaborate on distributed systems.',
            data: { requester_id: 'd3300000-0000-4000-a000-000000000001' },
            is_read: false,
            created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
            sender: {
              id: 'd3300000-0000-4000-a000-000000000001',
              username: 'arjun.codes',
              full_name: 'Arjun Patel',
              avatar_url: 'preset:dev-1',
            } as any,
          },
          {
            id: 'notif-demo-2',
            user_id: user.id,
            sender_id: 'd3300000-0000-4000-a000-000000000002',
            type: 'project_invite',
            title: 'Project Workspace Invitation',
            content: 'Meera Rao invited you to join the "AI Resume Analyzer" squad.',
            data: { project_id: 'd3300000-0000-4000-b000-000000000001' },
            is_read: false,
            created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            sender: {
              id: 'd3300000-0000-4000-a000-000000000002',
              username: 'dev_meera',
              full_name: 'Meera Rao',
              avatar_url: 'preset:dev-2',
            } as any,
          },
          {
            id: 'notif-demo-3',
            user_id: user.id,
            sender_id: 'd3300000-0000-4000-a000-000000000003',
            type: 'task_assigned',
            title: 'Task Assigned',
            content: 'Harshit Sharma assigned you task: "Implement JWT verification middleware".',
            data: { project_id: 'd3300000-0000-4000-b000-000000000002' },
            is_read: true,
            created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
            sender: {
              id: 'd3300000-0000-4000-a000-000000000003',
              username: 'harshitbuilds',
              full_name: 'Harshit Sharma',
              avatar_url: 'preset:dev-3',
            } as any,
          },
        ]);
      } else {
        setNotifications((data as any) || []);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();

    if (!user || !isSupabaseConfigured) return;

    // Realtime subscription for incoming user notifications
    let channel: any = null;
    try {
      const channelTopic = `user-notifications-${user.id}-${Math.random().toString(36).slice(2, 9)}`;
      channel = safeCreateChannel(channelTopic)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          async (payload) => {
            try {
              // Fetch sender details for new notification
              const newNotif = payload.new as Notification;
              if (newNotif.sender_id) {
                const { data: senderData } = await supabase
                  .from('profiles')
                  .select('id, username, full_name, avatar_url')
                  .eq('id', newNotif.sender_id)
                  .maybeSingle();

                if (senderData) {
                  newNotif.sender = senderData as any;
                }
              }

              setNotifications((prev) => [newNotif, ...prev]);
            } catch (err) {
              console.warn('Realtime notification processing error:', err);
            }
          }
        );

      channel.subscribe();
    } catch (err) {
      console.warn('Realtime notifications subscription error:', err);
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          // ignore
        }
      }
    };
  }, [user, fetchNotifications]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllAsRead = async () => {
    if (!user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);
  };

  const clearNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await supabase.from('notifications').delete().eq('id', id);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        clearNotification,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
