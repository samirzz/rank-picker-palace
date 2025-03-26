
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

// Define a Message interface to match our database schema
interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string | null;
  is_admin: boolean;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  last_message_at: string;
}

const AdminChatManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load users with chat history
  const loadUsers = async () => {
    setRefreshing(true);
    try {
      // Get distinct users who have sent messages
      const { data, error } = await supabase
        .from("chat_messages")
        .select("sender_id, sender_name, created_at")
        .eq("is_admin", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Create a map to keep track of the latest message from each user
      const userMap = new Map<string, { id: string; name: string; last_message_at: string }>();
      
      data?.forEach(message => {
        if (!userMap.has(message.sender_id)) {
          userMap.set(message.sender_id, {
            id: message.sender_id,
            name: message.sender_name,
            last_message_at: message.created_at
          });
        }
      });
      
      // Convert the map to an array for rendering
      const userList = Array.from(userMap.values()).map(user => ({
        id: user.id,
        email: user.name,
        last_message_at: user.last_message_at
      }));
      
      setUsers(userList);
    } catch (error) {
      console.error("Error loading users:", error);
      toast({
        variant: "destructive",
        title: "Error loading users",
        description: "Failed to load users with chat history."
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Load chat history for a specific user
  const loadMessages = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data as Message[]);
    } catch (error) {
      console.error("Error loading messages:", error);
      toast({
        variant: "destructive",
        title: "Error loading messages",
        description: "Failed to load chat messages."
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers();

    // Set up realtime subscription for new messages
    const channel = supabase
      .channel("admin_chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages"
        },
        (payload) => {
          const newMessage = payload.new as Message;
          
          // If we're currently viewing this user's chat, add the message
          if (selectedUser && (newMessage.sender_id === selectedUser.id || newMessage.recipient_id === selectedUser.id)) {
            setMessages(prev => [...prev, newMessage]);
          }
          
          // Refresh the user list to show the most recent activity
          loadUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedUser]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    loadMessages(user.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user) return;

    try {
      const message = {
        content: newMessage,
        sender_id: user.id,
        sender_name: "Admin Support",
        is_admin: true,
        recipient_id: selectedUser.id,
        created_at: new Date().toISOString()
      };

      await supabase.from("chat_messages").insert([message]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "Please try again."
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* User List */}
      <Card className="bg-gray-900 border-gray-800 md:col-span-1">
        <CardHeader className="border-b border-gray-800 flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-white">Users</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={loadUsers}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </CardHeader>
        <CardContent className="p-0 max-h-[600px] overflow-y-auto">
          {users.length === 0 ? (
            <div className="py-6 text-center text-gray-500">No users with chat history</div>
          ) : (
            <ul className="divide-y divide-gray-800">
              {users.map(user => (
                <li 
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`p-3 cursor-pointer hover:bg-gray-800 ${
                    selectedUser?.id === user.id ? "bg-gray-800" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-white font-medium">{user.email}</p>
                      <p className="text-gray-400 text-xs">
                        Last active: {new Date(user.last_message_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="bg-gray-900 border-gray-800 md:col-span-2 flex flex-col h-[600px]">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-lg text-white">
            {selectedUser ? `Chat with ${selectedUser.email}` : "Select a user to chat"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
          {!selectedUser ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a user from the list to view chat history
            </div>
          ) : loading ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500">
              No messages in this conversation
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${
                    message.is_admin
                      ? "bg-mlbb-purple/20 border-l-2 border-mlbb-purple ml-4"
                      : "bg-gray-800 border-l-2 border-gray-700 mr-4"
                  } p-3 rounded shadow`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-400">
                      {message.is_admin ? "Support Agent" : message.sender_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200">{message.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </CardContent>
        
        {selectedUser && (
          <div className="p-3 border-t border-gray-800">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your reply..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-gray-800 border-gray-700 text-white"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-mlbb-purple hover:bg-mlbb-darkpurple"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminChatManager;
