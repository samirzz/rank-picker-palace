
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "./types";

export const useChatMessages = (isChatOpen: boolean) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const { user } = useAuth();

  // Reset new messages flag when chat is opened
  useEffect(() => {
    if (isChatOpen) {
      setHasNewMessages(false);
    }
  }, [isChatOpen]);

  // Load previous messages and set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("chat_messages")
          .select("*")
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order("created_at", { ascending: true })
          .limit(50);

        if (error) throw error;
        if (data) setMessages(data as Message[]);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Subscribe to new messages in the channel
    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `sender_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          // Only add admin messages for this user
          setMessages((prev) => [...prev, payload.new as Message]);
          
          // If chat is not open, show notification
          if (!isChatOpen) {
            setHasNewMessages(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isChatOpen]);

  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || !user) return false;

    try {
      const newMessage = {
        content: messageContent,
        sender_id: user.id,
        sender_name: user.email?.split("@")[0] || "User",
        is_admin: false,
        recipient_id: null, // Admin will see all non-admin messages
      };

      await supabase.from("chat_messages").insert([newMessage]);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  };

  return { messages, isLoading, sendMessage, hasNewMessages };
};
