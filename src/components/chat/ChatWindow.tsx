import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Image, Smile, Hash, AlertCircle } from 'lucide-react';
import { Conversation, Message, Profile } from '@/types/database.types';
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
          // Fetch sender profile details
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
      setInputMessage(content); // restore on error
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

      // Send message with attachment
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
  const title = isDirect ? (otherMember?.full_name || 'Direct Chat') : (conversation.name || 'Project Channel');

  return (
    <div className="flex-1 h-full flex flex-col bg-[#090d16]">
      {/* Header */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-[#070b13]/80">
        <div className="flex items-center gap-3">
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

          <div>
            <h4 className="font-bold text-sm text-white">{title}</h4>
            <p className="text-xs text-slate-400">
              {isDirect
                ? (otherMember?.headline || 'Direct Conversation')
                : 'Project Collaboration Stream'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Realtime
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
            <p className="font-semibold text-slate-400 mb-1">No messages in this channel yet.</p>
            <p>Send a message below to start collaborating!</p>
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
                  />
                )}

                <div
                  className={`max-w-[80%] sm:max-w-md rounded-2xl p-3.5 text-xs ${
                    isMe
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md shadow-cyan-900/20'
                      : 'bg-[#0d1527] border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {!isMe && (
                    <div className="font-semibold text-[11px] text-cyan-300 mb-1">
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
                          className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/50 hover:bg-slate-900 border border-slate-700/60 text-cyan-300 underline font-mono text-[11px]"
                        >
                          <Paperclip className="h-3 w-3" />
                          <span className="truncate">{att.name}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[9px] font-mono ${
                      isMe ? 'text-cyan-200/80 text-right' : 'text-slate-500'
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
      <div className="p-4 border-t border-slate-800 bg-[#070b13]/80">
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
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message (Enter to send)..."
            className="flex-1 h-11 px-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputMessage.trim() || sending}
            isLoading={sending}
            className="h-11 px-4 rounded-xl font-semibold text-xs"
          >
            <Send className="h-4 w-4 mr-1.5" /> Send
          </Button>
        </form>
      </div>
    </div>
  );
};
