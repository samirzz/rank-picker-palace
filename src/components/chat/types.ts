
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_name: string;
  recipient_id: string | null;
  is_admin: boolean;
  created_at: string;
}
