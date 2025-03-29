
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: {
    url: string;
    type: string;
    name: string;
  }[];
  // Additional fields needed for Supabase integration
  is_admin?: boolean;
  sender_name?: string;
  sender_id?: string;
  recipient_id?: string;
  created_at?: string;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  unreadCount: number;
}
