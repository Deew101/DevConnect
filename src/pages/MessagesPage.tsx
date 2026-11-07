import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  MessageSquare,
  Plus,
  Search,
  Github,
  Globe,
  Clock,
  ArrowUpRight,
  User,
  FolderGit2,
  Users,
  ShieldCheck,
  PanelRightClose,
  Radio,
} from 'lucide-react';
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
  const [showDossier, setShowDossier] = useState(true);

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
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            members:conversation_members (
              id,
              user_id,
              last_read_at,
              profile:user_id (id, username, full_name, avatar_url, headline, bio, location, github_username, availability_status, weekly_hours_available, experience_level)
            )
          `)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const convList = data || [];
        setConversations(convList as any);

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
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({ type: 'direct' })
        .select()
        .single();

      if (convError) throw convError;

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
      toast({ title: `Initiated channel with ${targetDev.full_name}`, type: 'success' });
    } catch (err: any) {
      toast({ title: 'Failed to initiate channel', description: err.message, type: 'error' });
    }
  };

  if (loading) {
    return <LoadingScreen message="Connecting realtime communication mesh..." />;
  }

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const isDirect = activeConv?.type === 'direct';
  const partnerProfile = isDirect
    ? activeConv?.members?.find((m) => m.user_id !== user?.id)?.profile
    : null;

  return (
    <div className="h-[calc(100vh-8rem)] rounded-xl border border-[#273249] bg-[#101725] shadow-2xl flex overflow-hidden font-sans">
      {/* Column 1: Conversations List Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={(id) => setActiveConversationId(id)}
        onNewDirectChat={() => setIsNewChatModalOpen(true)}
        currentUserId={user?.id || ''}
      />

      {/* Column 2: Active Conversation Main Stream */}
      <div className="flex-1 h-full flex flex-col bg-[#090C13]">
        {activeConv && user ? (
          <ChatWindow
            conversation={activeConv}
            currentUserId={user.id}
            onToggleDetails={() => setShowDossier(!showDossier)}
            isDetailsOpen={showDossier}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#929DB2]">
            <MessageSquare className="h-12 w-12 text-[#273249] mb-3" />
            <h3 className="font-display text-base font-bold text-[#F4F6FC] mb-1">Select a Conversation</h3>
            <p className="text-xs text-[#929DB2] max-w-sm mb-4">
              Select a peer direct message or workspace collaboration channel from the left sidebar.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewChatModalOpen(true)}
              className="text-xs font-semibold shadow-md shadow-[#6D95FF]/20"
            >
              <Plus className="h-4 w-4 mr-1" /> New Direct Message
            </Button>
          </div>
        )}
      </div>

      {/* Column 3: Premium Editorial Dossier / Channel Sidebar (shows when space allows or when open) */}
      {activeConv && showDossier && (
        <aside className="hidden xl:flex w-72 2xl:w-80 flex-col border-l border-[#273249] bg-[#101725] p-5 flex-shrink-0 overflow-y-auto space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#273249]">
            <span className="text-[10px] font-mono tracking-widest text-[#929DB2] uppercase font-bold flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-[#6D95FF]" /> CHANNEL DOSSIER
            </span>
            <button
              onClick={() => setShowDossier(false)}
              className="text-[#929DB2] hover:text-[#F4F6FC] p-1 rounded hover:bg-[#151F30]"
              title="Close panel"
            >
              <PanelRightClose className="h-4 w-4" />
            </button>
          </div>

          {/* Dossier Content */}
          {isDirect && partnerProfile ? (
            <div className="space-y-4">
              <div className="text-center pt-2">
                <Avatar
                  src={partnerProfile.avatar_url}
                  name={partnerProfile.full_name}
                  size="xl"
                  status={partnerProfile.availability_status}
                  className="mx-auto rounded-2xl w-20 h-20 ring-2 ring-[#6D95FF]/30"
                />
                <h4 className="font-display font-bold text-sm text-[#F4F6FC] mt-3">
                  {partnerProfile.full_name}
                </h4>
                <p className="text-xs text-[#6D95FF] font-mono">@{partnerProfile.username}</p>
                <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#151F30] border border-[#273249] text-[#929DB2]">
                  {partnerProfile.experience_level || 'Software Engineer'}
                </span>
              </div>

              {partnerProfile.headline && (
                <div className="p-3 rounded-lg bg-[#151F30] border border-[#273249] text-xs">
                  <span className="text-[10px] font-mono text-[#929DB2] uppercase tracking-wider block mb-1">
                    FOCUS
                  </span>
                  <p className="text-[#F4F6FC] font-medium leading-relaxed">{partnerProfile.headline}</p>
                </div>
              )}

              {partnerProfile.bio && (
                <div className="text-xs text-[#929DB2] leading-relaxed">
                  <span className="text-[10px] font-mono text-[#929DB2] uppercase tracking-wider block mb-1">
                    BIOGRAPHY
                  </span>
                  <p className="line-clamp-4">{partnerProfile.bio}</p>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-[#273249] text-xs font-mono">
                {partnerProfile.github_username && (
                  <a
                    href={`https://github.com/${partnerProfile.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-[#151F30] border border-[#273249] text-[#F4F6FC] hover:border-[#6D95FF]/40 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Github className="h-3.5 w-3.5 text-[#6D95FF]" /> GitHub
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#929DB2]" />
                  </a>
                )}

                <div className="flex items-center justify-between p-2 rounded-lg bg-[#151F30] border border-[#273249] text-[#929DB2]">
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#35C98A]" /> Availability
                  </span>
                  <span className="text-[#F4F6FC]">
                    {partnerProfile.weekly_hours_available || 15}h/wk
                  </span>
                </div>
              </div>

              <Link to={`/profile/${partnerProfile.username}`} className="block pt-2">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-[#273249] text-[#F4F6FC] hover:bg-[#151F30]">
                  View Full Dossier
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-[#151F30] border border-[#273249] text-xs space-y-2">
                <span className="text-[10px] font-mono text-[#929DB2] uppercase tracking-wider block">
                  WORKSPACE CHANNEL
                </span>
                <h4 className="font-display font-bold text-sm text-[#F4F6FC]">{activeConv.name}</h4>
                <p className="text-[11px] text-[#929DB2]">
                  Realtime coordination channel connected to PostgreSQL WebSocket feed.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#151F30] border border-[#273249] text-xs space-y-2">
                <div className="flex items-center justify-between text-[#929DB2]">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Users className="h-3.5 w-3.5 text-[#6D95FF]" /> Active Members
                  </span>
                  <span className="font-mono text-[#F4F6FC]">
                    {activeConv.members?.length || 2}
                  </span>
                </div>
              </div>

              {activeConv.project_id && (
                <Link to={`/projects/${activeConv.project_id}`} className="block">
                  <Button variant="primary" size="sm" className="w-full text-xs font-semibold">
                    Open Kanban Board
                  </Button>
                </Link>
              )}
            </div>
          )}
        </aside>
      )}

      {/* New Direct Chat Modal */}
      <Dialog
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        title="Start Direct Message"
        description="Search for any developer by name or username to initiate a direct chat."
        maxWidth="md"
      >
        <div className="space-y-4 mt-2 font-sans">
          <Input
            value={searchDevQuery}
            onChange={(e) => handleSearchDevelopers(e.target.value)}
            placeholder="Search by developer name or @username..."
            icon={<Search className="h-4 w-4 text-[#929DB2]" />}
            autoFocus
            className="bg-[#151F30] border-[#273249] text-[#F4F6FC]"
          />

          <div className="max-h-60 overflow-y-auto space-y-1.5 divide-y divide-[#273249]/40">
            {searchingDevs ? (
              <div className="py-4 text-center text-xs text-[#929DB2] font-mono">Querying directory...</div>
            ) : searchDevResults.length === 0 ? (
              searchDevQuery.trim() ? (
                <div className="py-4 text-center text-xs text-[#929DB2] font-mono">No engineers found.</div>
              ) : (
                <div className="py-4 text-center text-xs text-[#929DB2] font-mono">
                  Enter name or handle to search
                </div>
              )
            ) : (
              searchDevResults.map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => handleStartDirectChat(dev)}
                  className="p-2.5 rounded-lg hover:bg-[#151F30] cursor-pointer flex items-center justify-between transition-colors pt-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar
                      src={dev.avatar_url}
                      name={dev.full_name}
                      size="sm"
                      status={dev.availability_status}
                      className="rounded-lg"
                    />
                    <div className="min-w-0 text-xs">
                      <p className="font-semibold text-[#F4F6FC] truncate">{dev.full_name}</p>
                      <p className="text-[#6D95FF] font-mono text-[11px]">@{dev.username}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-[#273249] text-[#F4F6FC] font-mono">
                    Initiate
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
