import React, { useState } from 'react';
import { MessageSquare, Users, Plus, Hash, Search } from 'lucide-react';
import { Conversation, Profile } from '@/types/database.types';
import { Avatar } from '@/components/ui/Avatar';
import { formatTimeAgo, truncateText } from '@/lib/utils';
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
    <div className="w-80 h-full flex flex-col border-r border-slate-800/80 bg-[#070b13] flex-shrink-0">
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-cyan-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200 font-mono">
            Direct & Team Chats
          </h3>
        </div>
        <button
          onClick={onNewDirectChat}
          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
          title="Start new direct message"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Filter / Search input */}
      <div className="p-2.5 border-b border-slate-800/60">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter conversations..."
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/60"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {filterQuery ? 'No matching channels found.' : 'No active conversations yet.'}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isDirect = conv.type === 'direct';
            const otherMember = conv.members?.find((m) => m.user_id !== currentUserId)?.profile;
            const title = isDirect
              ? otherMember?.full_name || 'Direct Message'
              : conv.name || 'Project Channel';
            const isActive = conv.id === activeId;

            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  'p-3 flex items-center gap-3 cursor-pointer transition-colors relative',
                  isActive
                    ? 'bg-slate-800/80 border-l-2 border-cyan-400'
                    : 'hover:bg-slate-900/60'
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
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 flex-shrink-0">
                    <Hash className="h-4 w-4" />
                  </div>
                )}

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-white truncate text-xs">{title}</span>
                    {conv.last_message && (
                      <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                        {formatTimeAgo(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 truncate text-[11px] leading-tight">
                    {conv.last_message ? conv.last_message.content : 'No messages yet.'}
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
