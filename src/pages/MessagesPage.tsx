import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MessageSquare, Plus, Search } from 'lucide-react';
import { Conversation, Profile } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { useToast } from '@/components/ui/Toast';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // New Chat Modal
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [searchDevQuery, setSearchDevQuery] = useState('');
  const [searchDevResults, setSearchDevResults] = useState<Profile[]>([]);
  const [searchingDevs, setSearchingDevs] = useState(false);

  useEffect(() => {
    async function loadConversations() {
      if (!user) return;
      setLoading(true);
      try {
        // Query user's conversations
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            members:conversation_members (
              id,
              user_id,
              last_read_at,
              profile:user_id (id, username, full_name, avatar_url, headline, availability_status)
            )
          `)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const convList = data || [];
        setConversations(convList as any);

        // Select first or url query param if present
        const queryId = searchParams.get('id');
        if (queryId && convList.some((c: any) => c.id === queryId)) {
          setActiveConversationId(queryId);
        } else if (convList.length > 0 && !activeConversationId) {
          setActiveConversationId(convList[0].id);
        }
      } catch (err: any) {
        console.error('Error loading conversations:', err);
      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, [user, searchParams]);

  const handleSearchDevelopers = async (query: string) => {
    setSearchDevQuery(query);
    if (!query.trim() || !user) {
      setSearchDevResults([]);
      return;
    }

    setSearchingDevs(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id)
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(6);

      setSearchDevResults(data || []);
    } catch (err) {
      console.error('Search devs error:', err);
    } finally {
      setSearchingDevs(false);
    }
  };

  const handleStartDirectChat = async (targetDev: Profile) => {
    if (!user) return;
    try {
      // 1. Create conversation record
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({ type: 'direct' })
        .select()
        .single();

      if (convError) throw convError;

      // 2. Add members
      await supabase.from('conversation_members').insert([
        { conversation_id: conv.id, user_id: user.id },
        { conversation_id: conv.id, user_id: targetDev.id },
      ]);

      const formattedConv: Conversation = {
        ...conv,
        members: [
          { id: '1', conversation_id: conv.id, user_id: user.id, last_read_at: '', joined_at: '' },
          {
            id: '2',
            conversation_id: conv.id,
            user_id: targetDev.id,
            last_read_at: '',
            joined_at: '',
            profile: targetDev,
          },
        ],
      };

      setConversations((prev) => [formattedConv, ...prev]);
      setActiveConversationId(conv.id);
      setIsNewChatModalOpen(false);
      toast({ title: `Started chat with ${targetDev.full_name}`, type: 'success' });
    } catch (err: any) {
      toast({ title: 'Failed to start chat', description: err.message, type: 'error' });
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading messaging channels..." />;
  }

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  return (
    <div className="h-[calc(100vh-8rem)] rounded-2xl border border-slate-800 bg-[#070b13] shadow-2xl flex overflow-hidden">
      {/* Conversations List Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={(id) => setActiveConversationId(id)}
        onNewDirectChat={() => setIsNewChatModalOpen(true)}
        currentUserId={user?.id || ''}
      />

      {/* Active Conversation Main Stream */}
      <div className="flex-1 h-full flex flex-col bg-[#090d16]">
        {activeConv && user ? (
          <ChatWindow conversation={activeConv} currentUserId={user.id} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
            <MessageSquare className="h-12 w-12 text-slate-700 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Select a conversation</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Choose a direct developer chat or project workspace stream from the left, or start a new direct message.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewChatModalOpen(true)}
              className="text-xs font-semibold"
            >
              <Plus className="h-4 w-4 mr-1" /> New Direct Message
            </Button>
          </div>
        )}
      </div>

      {/* New Direct Chat Modal */}
      <Dialog
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        title="Start Direct Message"
        description="Search for any developer by name or username to initiate a direct chat."
        maxWidth="md"
      >
        <div className="space-y-4 mt-2">
          <Input
            value={searchDevQuery}
            onChange={(e) => handleSearchDevelopers(e.target.value)}
            placeholder="Search by developer name or @username..."
            icon={<Search className="h-4 w-4" />}
            autoFocus
          />

          <div className="max-h-60 overflow-y-auto space-y-1.5 divide-y divide-slate-800/40">
            {searchingDevs ? (
              <div className="py-4 text-center text-xs text-slate-400">Searching...</div>
            ) : searchDevResults.length === 0 ? (
              searchDevQuery.trim() ? (
                <div className="py-4 text-center text-xs text-slate-500">No developers found.</div>
              ) : (
                <div className="py-4 text-center text-xs text-slate-500">
                  Type a name to search developers
                </div>
              )
            ) : (
              searchDevResults.map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => handleStartDirectChat(dev)}
                  className="p-2.5 rounded-xl hover:bg-slate-800/60 cursor-pointer flex items-center justify-between transition-colors pt-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={dev.avatar_url}
                      name={dev.full_name}
                      size="sm"
                      status={dev.availability_status}
                    />
                    <div className="min-w-0 text-xs">
                      <p className="font-semibold text-white truncate">{dev.full_name}</p>
                      <p className="text-cyan-400 font-mono text-[11px]">@{dev.username}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    Chat
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};
