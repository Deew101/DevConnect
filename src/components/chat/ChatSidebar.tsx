import React from 'react';
import { MessageSquare, Users, Plus, Hash } from 'lucide-react';
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
  return (
    <div className="w-80 h-full flex flex-col border-r border-slate-800 bg-[#070b13]">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">Conversations</h3>
        </div>
        <button
          onClick={onNewDirectChat}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="Start new direct message"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No active conversations. Connect with developers or start a project chat!
          </div>
        ) : (
          conversations.map((conv) => {
            const isDirect = conv.type === 'direct';
            // Find other participant in direct message
            const otherMember = conv.members?.find((m) => m.user_id !== currentUserId)?.profile;
            const title = isDirect ? (otherMember?.full_name || 'Direct Message') : (conv.name || 'Project Channel');
            const isActive = conv.id === activeId;

            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  'p-3.5 flex items-center gap-3 cursor-pointer transition-colors',
                  isActive
                    ? 'bg-slate-800/90 border-l-2 border-cyan-400'
                    : 'hover:bg-slate-900/60'
                )}
              >
                {isDirect ? (
                  <Avatar
                    src={otherMember?.avatar_url}
                    name={otherMember?.full_name}
                    size="md"
                    status={otherMember?.availability_status}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
                    <Hash className="h-5 w-5" />
                  </div>
                )}

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white truncate">{title}</span>
                    {conv.last_message && (
                      <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                        {formatTimeAgo(conv.last_message.created_at)}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 truncate text-[11px]">
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
