
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
}

export interface ChatContact {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  unreadCount: number;
}
