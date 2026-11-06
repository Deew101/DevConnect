import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Hash } from 'lucide-react';
import { Conversation, Message } from '@/types/database.types';
import { supabase } from '@/lib/supabase';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { formatTimeAgo } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUserId,
}) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch existing messages
  useEffect(() => {
    let isMounted = true;

    async function loadMessages() {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (id, username, full_name, avatar_url)
        `)
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.error('Error fetching conversation messages:', error);
      } else if (isMounted) {
        setMessages((data as any) || []);
        setTimeout(scrollToBottom, 100);
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
      toast({
        title: 'Message sending failed',
        description: err.message,
        type: 'error',
      });
      setInputMessage(content);
    } finally {
      setSending(false);
    }
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
      toast({ title: 'File shared successfully', type: 'success' });
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
    ? otherMember?.full_name || 'Direct Chat'
    : conversation.name || 'Project Channel';

  return (
    <div className="flex-1 h-full flex flex-col bg-[#090C13]">
      {/* Header */}
      <div className="h-14 px-5 border-b border-[#273249] flex items-center justify-between bg-[#0E1420]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {isDirect ? (
            <Avatar
              src={otherMember?.avatar_url}
              name={otherMember?.full_name}
              size="sm"
              status={otherMember?.availability_status}
              className="w-8 h-8"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#141C2B] border border-[#273249] flex items-center justify-center text-[#648BFF]">
              <Hash className="h-4 w-4" />
            </div>
          )}

          <div>
            <h4 className="font-bold text-xs text-[#F1F5FC]">{title}</h4>
            <p className="text-[11px] text-[#929DB2] font-mono">
              {isDirect
                ? (otherMember?.headline || 'Direct Conversation')
                : 'Project Collaboration Stream'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] text-[#35C98A] font-mono px-2 py-0.5 rounded-full bg-[#35C98A]/10 border border-[#35C98A]/20">
            <span className="h-1.5 w-1.5 rounded-full bg-[#35C98A] animate-pulse" /> Live Realtime
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-[#929DB2] text-xs">
            <div className="w-10 h-10 rounded-xl bg-[#141C2B] border border-[#273249] flex items-center justify-center text-[#929DB2] mb-2">
              <Hash className="w-5 h-5" />
            </div>
            <p className="font-semibold text-[#F1F5FC] mb-1">Channel Initialized</p>
            <p className="text-[#929DB2]">Send a message below to coordinate with your team.</p>
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
                    className="w-7 h-7 text-[10px] mt-0.5"
                  />
                )}

                <div
                  className={`max-w-[80%] sm:max-w-md rounded-2xl p-3.5 text-xs ${
                    isMe
                      ? 'bg-gradient-to-r from-[#648BFF] to-[#9B7BFF] text-white rounded-tr-none shadow-md shadow-[#648BFF]/20'
                      : 'bg-[#141C2B] border border-[#273249] text-[#F1F5FC] rounded-tl-none shadow-sm'
                  }`}
                >
                  {!isMe && (
                    <div className="font-semibold text-[11px] text-[#648BFF] mb-1">
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
                          className="flex items-center gap-2 p-2 rounded-lg bg-[#0E1420] hover:bg-[#192338] border border-[#273249] text-[#648BFF] underline font-mono text-[11px]"
                        >
                          <Paperclip className="h-3 w-3" />
                          <span className="truncate">{att.name}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[9px] font-mono ${
                      isMe ? 'text-white/80 text-right' : 'text-[#929DB2]'
                    }`}
                  >
                    {formatTimeAgo(msg.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3.5 border-t border-[#273249] bg-[#0E1420]/90">
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
            className="p-2 rounded-lg bg-[#141C2B] hover:bg-[#192338] text-[#929DB2] hover:text-[#F1F5FC] border border-[#273249] transition-colors"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Send a message or code snippet (Enter to send)..."
            className="flex-1 h-9 px-3.5 rounded-lg bg-[#141C2B] border border-[#273249] text-xs text-[#F1F5FC] placeholder:text-[#929DB2] focus:outline-none focus:border-[#648BFF] font-sans"
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputMessage.trim() || sending}
            isLoading={sending}
            className="h-9 px-3.5 rounded-lg font-semibold text-xs shadow-md shadow-[#648BFF]/20"
          >
            <Send className="h-3.5 w-3.5 mr-1" /> Send
          </Button>
        </form>
      </div>
    </div>
  );
};
