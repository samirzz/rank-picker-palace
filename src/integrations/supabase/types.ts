export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          password_hash: string
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          password_hash: string
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          password_hash?: string
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_admin: boolean | null
          recipient_id: string | null
          sender_id: string
          sender_name: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_admin?: boolean | null
          recipient_id?: string | null
          sender_id: string
          sender_name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_admin?: boolean | null
          recipient_id?: string | null
          sender_id?: string
          sender_name?: string
        }
        Relationships: []
      }
      configuration: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      heroes: {
        Row: {
          created_at: string
          difficulty: number
          id: string
          image: string
          name: string
          price_modifier: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          difficulty: number
          id: string
          image: string
          name: string
          price_modifier?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          difficulty?: number
          id?: string
          image?: string
          name?: string
          price_modifier?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          current_mmr: number | null
          current_rank: string | null
          customer_name: string | null
          email: string
          hero_id: string | null
          id: string
          order_number: string | null
          order_type: string
          status: string
          target_mmr: number | null
          target_rank: string | null
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          current_mmr?: number | null
          current_rank?: string | null
          customer_name?: string | null
          email: string
          hero_id?: string | null
          id?: string
          order_number?: string | null
          order_type: string
          status?: string
          target_mmr?: number | null
          target_rank?: string | null
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          current_mmr?: number | null
          current_rank?: string | null
          customer_name?: string | null
          email?: string
          hero_id?: string | null
          id?: string
          order_number?: string | null
          order_type?: string
          status?: string
          target_mmr?: number | null
          target_rank?: string | null
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      rank_combinations: {
        Row: {
          created_at: string
          from_rank_id: string
          from_subdivision: number | null
          id: number
          price: number
          to_rank_id: string
          to_subdivision: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_rank_id: string
          from_subdivision?: number | null
          id?: number
          price: number
          to_rank_id: string
          to_subdivision?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_rank_id?: string
          from_subdivision?: number | null
          id?: number
          price?: number
          to_rank_id?: string
          to_subdivision?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rank_combinations_from_rank_id_fkey"
            columns: ["from_rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rank_combinations_to_rank_id_fkey"
            columns: ["to_rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
        ]
      }
      rank_subdivisions: {
        Row: {
          created_at: string
          id: number
          max_points: number | null
          min_points: number | null
          name: string
          rank_id: string
          stars: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          max_points?: number | null
          min_points?: number | null
          name: string
          rank_id: string
          stars?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          max_points?: number | null
          min_points?: number | null
          name?: string
          rank_id?: string
          stars?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rank_subdivisions_rank_id_fkey"
            columns: ["rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
        ]
      }
      ranks: {
        Row: {
          base_price: number | null
          cost_per_star: number | null
          created_at: string
          id: string
          image: string
          name: string
          price_modifier: number
          tier: number
          updated_at: string
        }
        Insert: {
          base_price?: number | null
          cost_per_star?: number | null
          created_at?: string
          id: string
          image: string
          name: string
          price_modifier?: number
          tier: number
          updated_at?: string
        }
        Update: {
          base_price?: number | null
          cost_per_star?: number | null
          created_at?: string
          id?: string
          image?: string
          name?: string
          price_modifier?: number
          tier?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
