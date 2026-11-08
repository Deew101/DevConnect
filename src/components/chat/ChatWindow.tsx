import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Hash, Code, Smile, PanelRightOpen, PanelRightClose, Sparkles } from 'lucide-react';
import { Conversation, Message } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatTimeAgo } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { DEMO_CONVERSATIONS } from '@/data/demoCommunityData';

interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: string;
  onToggleDetails?: () => void;
  isDetailsOpen?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUserId,
  onToggleDetails,
  isDetailsOpen = true,
}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch existing messages
  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:sender_id (id, username, full_name, avatar_url)
          `)
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true })
          .limit(100);

        if (error || !data || data.length === 0) {
          const demoConv = DEMO_CONVERSATIONS.find((c) => c.id === conversation.id);
          if (demoConv && isMounted) {
            setMessages(demoConv.messages as any);
            setTimeout(scrollToBottom, 100);
            return;
          }
        }

        if (data && isMounted) {
          setMessages((data as any) || []);
          setTimeout(scrollToBottom, 100);
        }
      } catch (err) {
        const demoConv = DEMO_CONVERSATIONS.find((c) => c.id === conversation.id);
        if (demoConv && isMounted) {
          setMessages(demoConv.messages as any);
          setTimeout(scrollToBottom, 100);
        }
      }
    }

    loadMessages();

    // 2. Realtime subscription for incoming messages
    const channel = supabase
      .channel(`chat-room-${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          const { data: senderData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', newMsg.sender_id)
            .maybeSingle();

          if (senderData) {
            newMsg.sender = senderData as any;
          }

          setMessages((prev) => [...prev, newMsg]);
          setIsTyping(false);
          setTimeout(scrollToBottom, 50);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [conversation.id]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const content = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversation.id,
        sender_id: currentUserId,
        content,
        attachments: [],
      });

      if (error) throw error;
      scrollToBottom();
    } catch (err: any) {
      // If demo channel or offline mesh, append optimistically
      const isDemo = conversation.id.startsWith('d3300000') || (conversation as any).is_demo;
      if (isDemo || err) {
        const optimisticMsg: any = {
          id: `msg-${Date.now()}`,
          conversation_id: conversation.id,
          sender_id: currentUserId,
          content,
          created_at: new Date().toISOString(),
          attachments: [],
        };
        setMessages((prev) => [...prev, optimisticMsg]);
        setTimeout(scrollToBottom, 50);
      } else {
        toast({
          title: 'Message transmission failed',
          description: err.message,
          type: 'error',
        });
        setInputMessage(content);
      }
    } finally {
      setSending(false);
    }
  };

  const handleInsertCodeSnippet = () => {
    setInputMessage((prev) => `${prev}\`\`\`typescript\n// Enter snippet\n\`\`\`\n`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({ title: 'File size limit is 10MB', type: 'error' });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${conversation.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

      const { error: msgError } = await supabase.from('messages').insert({
        conversation_id: conversation.id,
        sender_id: currentUserId,
        content: `Attached file: ${file.name}`,
        attachments: [
          {
            name: file.name,
            url: urlData.publicUrl,
            type: file.type,
            size: file.size,
          },
        ],
      });

      if (msgError) throw msgError;
      toast({ title: 'File attached and shared', type: 'success' });
    } catch (err: any) {
      toast({
        title: 'Upload failed',
        description: err.message,
        type: 'error',
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isDirect = conversation.type === 'direct';
  const otherMember = conversation.members?.find((m) => m.user_id !== currentUserId)?.profile;
  const title = isDirect
    ? otherMember?.full_name || 'Direct Channel'
    : conversation.name || 'Project Collaboration Stream';

  return (
    <div className="flex-1 h-full flex flex-col bg-[#080514] font-sans">
      {/* Header */}
      <div className="h-14 px-5 border-b border-[rgba(167,139,250,0.20)] flex items-center justify-between bg-[#100A24]/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {isDirect ? (
            <Avatar
              src={otherMember?.avatar_url}
              name={otherMember?.full_name}
              size="sm"
              status={otherMember?.availability_status}
              className="w-8 h-8 rounded-xl"
            />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-[#160E30] border border-[rgba(167,139,250,0.25)] flex items-center justify-center text-[#A855F7]">
              <Hash className="h-4 w-4" />
            </div>
          )}

          <div>
            <h4 className="font-display font-bold text-xs text-[#F8F7FF]">{title}</h4>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              <p className="text-[10px] text-[#B8ACD9] font-mono">
                {isDirect
                  ? (otherMember?.headline || 'Direct Engineering Stream')
                  : 'Workspace Channel • Realtime Connected'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-[#34D399] font-mono px-2 py-0.5 rounded-full bg-[#34D399]/10 border border-[#34D399]/20 shadow-[0_0_8px_rgba(52,211,153,0.15)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#34D399] animate-pulse" /> Live WebSocket
          </span>

          {onToggleDetails && (
            <button
              onClick={onToggleDetails}
              className="p-1.5 rounded-xl text-[#B8ACD9] hover:text-[#F8F7FF] hover:bg-[#8B5CF6]/20 border border-transparent hover:border-[rgba(167,139,250,0.25)] transition-all"
              title={isDetailsOpen ? 'Hide channel dossier' : 'Show channel dossier'}
            >
              {isDetailsOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#B8ACD9] text-xs">
            <div className="w-10 h-10 rounded-2xl bg-[#160E30] border border-[rgba(167,139,250,0.25)] flex items-center justify-center text-[#B8ACD9] mb-2 shadow-inner shadow-[#8B5CF6]/10">
              <Hash className="w-5 h-5 text-[#A855F7]" />
            </div>
            <p className="font-display font-bold text-[#F8F7FF] mb-1">Encrypted Stream Ready</p>
            <p className="text-[#B8ACD9] text-center max-w-xs font-mono text-[11px]">
              Type a message below to synchronize with your collaborator or workspace team.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
              >
                {!isMe && (
                  <Avatar
                    src={msg.sender?.avatar_url}
                    name={msg.sender?.full_name}
                    size="sm"
                    className="w-7 h-7 text-[10px] mt-0.5 rounded-xl"
                  />
                )}

                <div
                  className={`max-w-[80%] sm:max-w-md rounded-2xl p-3.5 text-xs ${
                    isMe
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-medium rounded-tr-none shadow-md shadow-[#8B5CF6]/20'
                      : 'bg-[#160E30] border border-[rgba(167,139,250,0.20)] text-[#F8F7FF] rounded-tl-none shadow-sm'
                  }`}
                >
                  {!isMe && (
                    <div className="font-display font-semibold text-[11px] text-[#A855F7] mb-1">
                      {msg.sender?.full_name || 'Member'}
                    </div>
                  )}

                  <p className="leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>

                  {/* Render attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.attachments.map((att, i) => (
                        <a
                          key={i}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-xl bg-[#100A24] hover:bg-[#8B5CF6]/20 border border-[rgba(167,139,250,0.25)] text-[#C4B5FD] underline font-mono text-[11px] transition-all"
                        >
                          <Paperclip className="h-3 w-3" />
                          <span className="truncate">{att.name}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[9px] font-mono ${
                      isMe ? 'text-white/80 text-right font-bold' : 'text-[#B8ACD9]'
                    }`}
                  >
                    {formatTimeAgo(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-[#B8ACD9] font-mono pl-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:0.4s]" />
            <span>typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Rich Composer Bar */}
      <div className="p-3.5 border-t border-[rgba(167,139,250,0.20)] bg-[#100A24]/95 backdrop-blur-md">
        {/* Quick format actions */}
        <div className="flex items-center gap-2 mb-2 px-1 text-[11px] font-mono text-[#B8ACD9]">
          <button
            type="button"
            onClick={handleInsertCodeSnippet}
            className="flex items-center gap-1 hover:text-[#C4B5FD] transition-colors"
            title="Insert Code Snippet"
          >
            <Code className="h-3 w-3" /> Insert Code
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setInputMessage((prev) => `${prev}🚀 `)}
            className="hover:text-[#C4B5FD] transition-colors"
          >
            🚀 Ship
          </button>
          <button
            type="button"
            onClick={() => setInputMessage((prev) => `${prev}⚡ `)}
            className="hover:text-[#C4B5FD] transition-colors"
          >
            ⚡ PR Ready
          </button>
          <button
            type="button"
            onClick={() => setInputMessage((prev) => `${prev}✅ `)}
            className="hover:text-[#C4B5FD] transition-colors"
          >
            ✅ LGTM
          </button>
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-2 rounded-xl bg-[#160E30] hover:bg-[#8B5CF6]/20 text-[#B8ACD9] hover:text-[#F8F7FF] border border-[rgba(167,139,250,0.25)] transition-all"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message or paste code (Press Enter to transmit)..."
            className="flex-1 h-9 px-3.5 rounded-xl bg-[#160E30] border border-[rgba(167,139,250,0.20)] text-xs text-[#F8F7FF] placeholder:text-[#B8ACD9] focus:outline-none focus:border-[#8B5CF6] font-sans transition-colors"
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputMessage.trim() || sending}
            isLoading={sending}
            className="h-9 px-4 rounded-xl font-semibold text-xs bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white shadow-md shadow-[#8B5CF6]/25"
          >
            <Send className="h-3.5 w-3.5 mr-1" /> Send
          </Button>
        </form>
      </div>
    </div>
  );
};
