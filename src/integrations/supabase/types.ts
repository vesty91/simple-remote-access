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
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_deleted: boolean | null
          is_moderated: boolean | null
          message_text: string
          message_type: string | null
          sender_user_id: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_moderated?: boolean | null
          message_text: string
          message_type?: string | null
          sender_user_id: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          is_moderated?: boolean | null
          message_text?: string
          message_type?: string | null
          sender_user_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "remote_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_history: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          device_id: string | null
          id: string
          ip_address: unknown | null
          session_id: string | null
          suspicious_activity: boolean | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          device_id?: string | null
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          suspicious_activity?: boolean | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          device_id?: string | null
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          suspicious_activity?: boolean | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_history_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_history_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "remote_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      device_permissions: {
        Row: {
          device_id: string
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          is_active: boolean | null
          permission_level: string
          user_id: string
        }
        Insert: {
          device_id: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permission_level?: string
          user_id: string
        }
        Update: {
          device_id?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          is_active?: boolean | null
          permission_level?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_permissions_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          access_code: string | null
          agent_installed: boolean | null
          created_at: string | null
          description: string | null
          device_type: string
          id: string
          ip_address: unknown | null
          is_online: boolean | null
          is_permanent: boolean | null
          last_seen: string | null
          mac_address: string | null
          name: string
          operating_system: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_code?: string | null
          agent_installed?: boolean | null
          created_at?: string | null
          description?: string | null
          device_type: string
          id?: string
          ip_address?: unknown | null
          is_online?: boolean | null
          is_permanent?: boolean | null
          last_seen?: string | null
          mac_address?: string | null
          name: string
          operating_system?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_code?: string | null
          agent_installed?: boolean | null
          created_at?: string | null
          description?: string | null
          device_type?: string
          id?: string
          ip_address?: unknown | null
          is_online?: boolean | null
          is_permanent?: boolean | null
          last_seen?: string | null
          mac_address?: string | null
          name?: string
          operating_system?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      file_transfers: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          file_name: string
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          progress_percentage: number | null
          receiver_device_id: string | null
          sender_user_id: string
          session_id: string
          started_at: string | null
          status: string
          transfer_direction: string
          transfer_speed: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_name: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          progress_percentage?: number | null
          receiver_device_id?: string | null
          sender_user_id: string
          session_id: string
          started_at?: string | null
          status?: string
          transfer_direction: string
          transfer_speed?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          progress_percentage?: number | null
          receiver_device_id?: string | null
          sender_user_id?: string
          session_id?: string
          started_at?: string | null
          status?: string
          transfer_direction?: string
          transfer_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "file_transfers_receiver_device_id_fkey"
            columns: ["receiver_device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_transfers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "remote_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          role: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      remote_sessions: {
        Row: {
          access_code: string | null
          chat_enabled: boolean | null
          controller_user_id: string
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          file_transfer_enabled: boolean | null
          host_device_id: string
          id: string
          screen_sharing_quality: string | null
          session_type: string
          started_at: string | null
          status: string
        }
        Insert: {
          access_code?: string | null
          chat_enabled?: boolean | null
          controller_user_id: string
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          file_transfer_enabled?: boolean | null
          host_device_id: string
          id?: string
          screen_sharing_quality?: string | null
          session_type: string
          started_at?: string | null
          status?: string
        }
        Update: {
          access_code?: string | null
          chat_enabled?: boolean | null
          controller_user_id?: string
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          file_transfer_enabled?: boolean | null
          host_device_id?: string
          id?: string
          screen_sharing_quality?: string | null
          session_type?: string
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "remote_sessions_host_device_id_fkey"
            columns: ["host_device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
