import React, { useState } from 'react';
import { MessageSquare, Plus, Hash, Search, Radio } from 'lucide-react';
import { Conversation } from '@/types/database.types';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimeAgo } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewDirectChat: () => void;
  currentUserId: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeId,
  onSelect,
  onNewDirectChat,
  currentUserId,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    if (!filterQuery.trim()) return true;
    const isDirect = conv.type === 'direct';
    const otherMember = conv.members?.find((m) => m.user_id !== currentUserId)?.profile;
    const title = isDirect
      ? otherMember?.full_name || 'Direct Message'
      : conv.name || 'Project Channel';
    return (
      title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      conv.last_message?.content.toLowerCase().includes(filterQuery.toLowerCase())
    );
  });

  return (
    <div className="w-80 h-full flex flex-col border-r border-[rgba(167,139,250,0.20)] bg-[#100A24] flex-shrink-0 font-sans">
      {/* Header */}
      <div className="p-3.5 border-b border-[rgba(167,139,250,0.20)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-[#A855F7] animate-pulse" />
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#F8F7FF]">
            Communications
          </h3>
        </div>
        <button
          onClick={onNewDirectChat}
          className="p-1.5 rounded-xl bg-[#160E30] hover:bg-[#8B5CF6]/20 border border-[rgba(167,139,250,0.25)] text-[#B8ACD9] hover:text-[#F8F7FF] transition-all"
          title="New direct channel"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filter / Search input */}
      <div className="p-2.5 border-b border-[rgba(167,139,250,0.20)]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#B8ACD9] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter channels or peers..."
            className="w-full h-8 pl-8 pr-3 rounded-xl bg-[#160E30] border border-[rgba(167,139,250,0.20)] text-xs text-[#F8F7FF] placeholder:text-[#B8ACD9] focus:outline-none focus:border-[#8B5CF6] font-sans transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[rgba(167,139,250,0.15)]">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#B8ACD9] font-mono">
            {filterQuery ? 'No matching channels found.' : 'No active streams yet.'}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isDirect = conv.type === 'direct';
            const otherMember = conv.members?.find((m) => m.user_id !== currentUserId)?.profile;
            const title = isDirect
              ? otherMember?.full_name || 'Direct Channel'
              : conv.name || 'Workspace Channel';
            const isActive = conv.id === activeId;

            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  'p-3 flex items-center gap-3 cursor-pointer transition-all duration-200 relative',
                  isActive
                    ? 'bg-[#8B5CF6]/15 border-l-2 border-[#8B5CF6] shadow-[inset_0_0_15px_rgba(139,92,246,0.1)]'
                    : 'hover:bg-[#160E30]/60 hover:translate-x-1'
                )}
              >
                {isDirect ? (
                  <Avatar
                    src={otherMember?.avatar_url}
                    name={otherMember?.full_name}
                    size="sm"
                    status={otherMember?.availability_status}
                    className="w-9 h-9"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-[#160E30] border border-[rgba(167,139,250,0.25)] flex items-center justify-center text-[#A855F7] flex-shrink-0">
                    <Hash className="h-4 w-4" />
                  </div>
                )}

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-[#F8F7FF] truncate text-xs">{title}</span>
                    {conv.last_message && (
                      <span className="text-[10px] text-[#B8ACD9] font-mono flex-shrink-0">
                        {formatTimeAgo(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-[#B8ACD9] truncate text-[11px] leading-tight">
                    {conv.last_message ? conv.last_message.content : 'Channel ready.'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
