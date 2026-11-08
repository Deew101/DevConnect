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
import { DEMO_CONVERSATIONS } from '@/data/demoCommunityData';

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

        const convList: any[] = (!error && data) ? data : [];

        // Format demo community channels
        const formattedDemo: Conversation[] = DEMO_CONVERSATIONS.map((dc) => ({
          id: dc.id,
          type: dc.type as any,
          name: dc.name,
          project_id: null,
          created_at: new Date().toISOString(),
          updated_at: dc.last_message?.created_at || new Date().toISOString(),
          is_demo: true,
          members: dc.members.map((m, idx) => ({
            id: `mem-${dc.id}-${idx}`,
            conversation_id: dc.id,
            user_id: m.user_id,
            last_read_at: new Date().toISOString(),
            joined_at: new Date().toISOString(),
            profile: m.profile as any,
          })),
          last_message: dc.last_message as any,
        } as any));

        // Merge real and demo, real first
        const existingIds = new Set(convList.map((c) => c.id));
        const merged = [
          ...convList,
          ...formattedDemo.filter((d) => !existingIds.has(d.id)),
        ];

        setConversations(merged);

        const queryId = searchParams.get('id');
        if (queryId && merged.some((c: any) => c.id === queryId)) {
          setActiveConversationId(queryId);
        } else if (merged.length > 0 && !activeConversationId) {
          setActiveConversationId(merged[0].id);
        }
      } catch (err: any) {
        console.error('Error loading conversations:', err);
        const formattedDemo: Conversation[] = DEMO_CONVERSATIONS.map((dc) => ({
          id: dc.id,
          type: dc.type as any,
          name: dc.name,
          project_id: null,
          created_at: new Date().toISOString(),
          updated_at: dc.last_message?.created_at || new Date().toISOString(),
          is_demo: true,
          members: dc.members.map((m, idx) => ({
            id: `mem-${dc.id}-${idx}`,
            conversation_id: dc.id,
            user_id: m.user_id,
            last_read_at: new Date().toISOString(),
            joined_at: new Date().toISOString(),
            profile: m.profile as any,
          })),
          last_message: dc.last_message as any,
        } as any));
        setConversations(formattedDemo);
        if (formattedDemo.length > 0) setActiveConversationId(formattedDemo[0].id);
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
    <div className="h-[calc(100vh-8rem)] rounded-2xl border border-[rgba(167,139,250,0.20)] bg-[#100A24]/90 backdrop-blur-xl shadow-2xl flex overflow-hidden font-sans">
      {/* Column 1: Conversations List Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={(id) => setActiveConversationId(id)}
        onNewDirectChat={() => setIsNewChatModalOpen(true)}
        currentUserId={user?.id || ''}
      />

      {/* Column 2: Active Conversation Main Stream */}
      <div className="flex-1 h-full flex flex-col bg-[#080514]">
        {activeConv && user ? (
          <ChatWindow
            conversation={activeConv}
            currentUserId={user.id}
            onToggleDetails={() => setShowDossier(!showDossier)}
            isDetailsOpen={showDossier}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#B8ACD9]">
            <MessageSquare className="h-12 w-12 text-[#8B5CF6]/40 mb-3" />
            <h3 className="font-display text-base font-bold text-[#F8F7FF] mb-1">Select a Conversation</h3>
            <p className="text-xs text-[#B8ACD9] max-w-sm mb-4">
              Select a peer direct message or workspace collaboration channel from the left sidebar.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsNewChatModalOpen(true)}
              className="text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-md shadow-[#8B5CF6]/25"
            >
              <Plus className="h-4 w-4 mr-1" /> New Direct Message
            </Button>
          </div>
        )}
      </div>

      {/* Column 3: Premium Editorial Dossier / Channel Sidebar (shows when space allows or when open) */}
      {activeConv && showDossier && (
        <aside className="hidden xl:flex w-72 2xl:w-80 flex-col border-l border-[rgba(167,139,250,0.20)] bg-[#100A24] p-5 flex-shrink-0 overflow-y-auto space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(167,139,250,0.20)]">
            <span className="text-[10px] font-mono tracking-widest text-[#C4B5FD] uppercase font-bold flex items-center gap-1.5">
              <Radio className="h-3 w-3 text-[#A855F7]" /> CHANNEL DOSSIER
            </span>
            <button
              onClick={() => setShowDossier(false)}
              className="text-[#B8ACD9] hover:text-[#F8F7FF] p-1.5 rounded-lg hover:bg-[#8B5CF6]/20 transition-all"
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
                  className="mx-auto rounded-2xl w-20 h-20 ring-2 ring-[#8B5CF6]/40 shadow-lg shadow-[#8B5CF6]/20"
                />
                <h4 className="font-display font-bold text-sm text-[#F8F7FF] mt-3">
                  {partnerProfile.full_name}
                </h4>
                <p className="text-xs text-[#A855F7] font-mono">@{partnerProfile.username}</p>
                <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[rgba(167,139,250,0.25)] text-[#C4B5FD]">
                  {partnerProfile.experience_level || 'Software Engineer'}
                </span>
              </div>

              {partnerProfile.headline && (
                <div className="p-3 rounded-xl bg-[#160E30] border border-[rgba(167,139,250,0.20)] text-xs">
                  <span className="text-[10px] font-mono text-[#B8ACD9] uppercase tracking-wider block mb-1">
                    FOCUS
                  </span>
                  <p className="text-[#F8F7FF] font-medium leading-relaxed">{partnerProfile.headline}</p>
                </div>
              )}

              {partnerProfile.bio && (
                <div className="text-xs text-[#B8ACD9] leading-relaxed">
                  <span className="text-[10px] font-mono text-[#B8ACD9] uppercase tracking-wider block mb-1">
                    BIOGRAPHY
                  </span>
                  <p className="line-clamp-4">{partnerProfile.bio}</p>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-[rgba(167,139,250,0.20)] text-xs font-mono">
                {partnerProfile.github_username && (
                  <a
                    href={`https://github.com/${partnerProfile.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-xl bg-[#160E30] border border-[rgba(167,139,250,0.20)] text-[#F8F7FF] hover:border-[#8B5CF6]/50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Github className="h-3.5 w-3.5 text-[#A855F7]" /> GitHub
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#B8ACD9]" />
                  </a>
                )}

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#160E30] border border-[rgba(167,139,250,0.20)] text-[#B8ACD9]">
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-[#34D399]" /> Availability
                  </span>
                  <span className="text-[#F8F7FF]">
                    {partnerProfile.weekly_hours_available || 15}h/wk
                  </span>
                </div>
              </div>

              <Link to={`/profile/${partnerProfile.username}`} className="block pt-2">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold border-[rgba(167,139,250,0.25)] text-[#F8F7FF] hover:bg-[#8B5CF6]/20 transition-all font-mono">
                  View Full Dossier
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#160E30] border border-[rgba(167,139,250,0.20)] text-xs space-y-2">
                <span className="text-[10px] font-mono text-[#B8ACD9] uppercase tracking-wider block">
                  WORKSPACE CHANNEL
                </span>
                <h4 className="font-display font-bold text-sm text-[#F8F7FF]">{activeConv.name}</h4>
                <p className="text-[11px] text-[#B8ACD9]">
                  Realtime coordination channel connected to PostgreSQL WebSocket feed.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#160E30] border border-[rgba(167,139,250,0.20)] text-xs space-y-2">
                <div className="flex items-center justify-between text-[#B8ACD9]">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Users className="h-3.5 w-3.5 text-[#A855F7]" /> Active Members
                  </span>
                  <span className="font-mono text-[#F8F7FF]">
                    {activeConv.members?.length || 2}
                  </span>
                </div>
              </div>

              {activeConv.project_id && (
                <Link to={`/projects/${activeConv.project_id}`} className="block">
                  <Button variant="primary" size="sm" className="w-full text-xs font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-md shadow-[#8B5CF6]/25">
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
