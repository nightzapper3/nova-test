import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/lib/chat";

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

export const useConversations = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Load conversations list
  const loadConversations = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("conversations")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false });
    if (data) setConversations(data);
  }, [userId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load messages for active conversation
  const loadMessages = useCallback(async (convId: string) => {
    const { data } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as Message[]);
  }, []);

  const selectConversation = useCallback(async (id: string) => {
    setActiveId(id);
    await loadMessages(id);
  }, [loadMessages]);

  const createConversation = useCallback(async (firstMessage?: string) => {
    if (!userId) return null;
    const title = firstMessage
      ? firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "")
      : "New Chat";
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: userId, title })
      .select("id")
      .single();
    if (error || !data) return null;
    setActiveId(data.id);
    setMessages([]);
    await loadConversations();
    return data.id;
  }, [userId, loadConversations]);

  const newChat = useCallback(() => {
    setActiveId(null);
    setMessages([]);
  }, []);

  const saveMessage = useCallback(async (convId: string, msg: Message) => {
    await supabase.from("chat_messages").insert({
      conversation_id: convId,
      role: msg.role,
      content: msg.content,
    });
    // Update conversation timestamp
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", convId);
  }, []);

  const deleteConversation = useCallback(async (id: string) => {
    await supabase.from("conversations").delete().eq("id", id);
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
    await loadConversations();
  }, [activeId, loadConversations]);

  const updateTitle = useCallback(async (convId: string, title: string) => {
    const shortTitle = title.slice(0, 50) + (title.length > 50 ? "..." : "");
    await supabase
      .from("conversations")
      .update({ title: shortTitle })
      .eq("id", convId);
    await loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    activeId,
    messages,
    setMessages,
    selectConversation,
    createConversation,
    newChat,
    saveMessage,
    deleteConversation,
    updateTitle,
  };
};
