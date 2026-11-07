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
    <div className="w-80 h-full flex flex-col border-r border-[#273249] bg-[#101725] flex-shrink-0 font-sans">
      {/* Header */}
      <div className="p-3.5 border-b border-[#273249] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-[#6D95FF] animate-pulse" />
          <h3 className="font-display font-bold text-xs uppercase tracking-wider text-[#F4F6FC]">
            Communications
          </h3>
        </div>
        <button
          onClick={onNewDirectChat}
          className="p-1.5 rounded-lg bg-[#151F30] hover:bg-[#1C2940] border border-[#273249] text-[#929DB2] hover:text-[#F4F6FC] transition-colors"
          title="New direct channel"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filter / Search input */}
      <div className="p-2.5 border-b border-[#273249]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#929DB2] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter channels or peers..."
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#151F30] border border-[#273249] text-xs text-[#F4F6FC] placeholder:text-[#929DB2] focus:outline-none focus:border-[#6D95FF]/60 font-sans"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-[#273249]/40">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#929DB2] font-mono">
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
                  'p-3 flex items-center gap-3 cursor-pointer transition-colors relative',
                  isActive
                    ? 'bg-[#151F30] border-l-2 border-[#6D95FF]'
                    : 'hover:bg-[#151F30]/50'
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
                  <div className="w-9 h-9 rounded-lg bg-[#151F30] border border-[#273249] flex items-center justify-center text-[#6D95FF] flex-shrink-0">
                    <Hash className="h-4 w-4" />
                  </div>
                )}

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-[#F4F6FC] truncate text-xs">{title}</span>
                    {conv.last_message && (
                      <span className="text-[10px] text-[#929DB2] font-mono flex-shrink-0">
                        {formatTimeAgo(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-[#929DB2] truncate text-[11px] leading-tight">
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
