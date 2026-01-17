export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affiliate_payouts: {
        Row: {
          affiliate_id: string
          amount: number
          created_at: string
          id: string
          notes: string | null
          payout_method: string
          processed_at: string | null
          processed_by: string | null
          status: string
          transaction_id: string | null
        }
        Insert: {
          affiliate_id: string
          amount: number
          created_at?: string
          id?: string
          notes?: string | null
          payout_method: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          transaction_id?: string | null
        }
        Update: {
          affiliate_id?: string
          amount?: number
          created_at?: string
          id?: string
          notes?: string | null
          payout_method?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_payouts_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_referrals: {
        Row: {
          affiliate_id: string
          commission_amount: number
          converted_at: string | null
          created_at: string
          id: string
          paid_at: string | null
          referred_email: string | null
          referred_user_id: string | null
          status: string
        }
        Insert: {
          affiliate_id: string
          commission_amount: number
          converted_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referred_email?: string | null
          referred_user_id?: string | null
          status?: string
        }
        Update: {
          affiliate_id?: string
          commission_amount?: number
          converted_at?: string | null
          created_at?: string
          id?: string
          paid_at?: string | null
          referred_email?: string | null
          referred_user_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          affiliate_code: string
          approved_at: string | null
          approved_by: string | null
          commission_rate: number
          created_at: string
          display_name: string
          email: string
          id: string
          is_vip: boolean
          payout_details: string | null
          payout_method: string | null
          pending_payout: number
          status: string
          total_earnings: number
          total_referrals: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          affiliate_code: string
          approved_at?: string | null
          approved_by?: string | null
          commission_rate?: number
          created_at?: string
          display_name: string
          email: string
          id?: string
          is_vip?: boolean
          payout_details?: string | null
          payout_method?: string | null
          pending_payout?: number
          status?: string
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          affiliate_code?: string
          approved_at?: string | null
          approved_by?: string | null
          commission_rate?: number
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          is_vip?: boolean
          payout_details?: string | null
          payout_method?: string | null
          pending_payout?: number
          status?: string
          total_earnings?: number
          total_referrals?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      beta_feedback: {
        Row: {
          additional_comments: string | null
          beta_invite_id: string | null
          created_at: string
          experience_rating: number
          id: string
          overall_rating: number
          user_id: string
          what_liked: string | null
          what_to_improve: string | null
        }
        Insert: {
          additional_comments?: string | null
          beta_invite_id?: string | null
          created_at?: string
          experience_rating: number
          id?: string
          overall_rating: number
          user_id: string
          what_liked?: string | null
          what_to_improve?: string | null
        }
        Update: {
          additional_comments?: string | null
          beta_invite_id?: string | null
          created_at?: string
          experience_rating?: number
          id?: string
          overall_rating?: number
          user_id?: string
          what_liked?: string | null
          what_to_improve?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beta_feedback_beta_invite_id_fkey"
            columns: ["beta_invite_id"]
            isOneToOne: false
            referencedRelation: "beta_invites"
            referencedColumns: ["id"]
          },
        ]
      }
      beta_invites: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          invite_code: string
          recipient_email: string | null
          recipient_name: string | null
          status: string
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          created_by?: string | null
          expires_at: string
          id?: string
          invite_code: string
          recipient_email?: string | null
          recipient_name?: string | null
          status?: string
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          invite_code?: string
          recipient_email?: string | null
          recipient_name?: string | null
          status?: string
        }
        Relationships: []
      }
      beta_sessions: {
        Row: {
          beta_invite_id: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          started_at: string
          user_id: string
        }
        Insert: {
          beta_invite_id?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string
          user_id: string
        }
        Update: {
          beta_invite_id?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "beta_sessions_beta_invite_id_fkey"
            columns: ["beta_invite_id"]
            isOneToOne: false
            referencedRelation: "beta_invites"
            referencedColumns: ["id"]
          },
        ]
      }
      celebrity_images: {
        Row: {
          celebrity_name: string
          celebrity_slug: string
          created_at: string
          id: string
          image_url: string
        }
        Insert: {
          celebrity_name: string
          celebrity_slug: string
          created_at?: string
          id?: string
          image_url: string
        }
        Update: {
          celebrity_name?: string
          celebrity_slug?: string
          created_at?: string
          id?: string
          image_url?: string
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean
          name: string | null
          source: string | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          subscribed_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          content: Json
          created_at: string
          favorite_type: string
          id: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          favorite_type: string
          id?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          favorite_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          ip_address: string
          request_count: number
          window_start: string
        }
        Insert: {
          ip_address: string
          request_count?: number
          window_start?: string
        }
        Update: {
          ip_address?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_email: string
          referred_user_id: string | null
          referrer_id: string
          status: string
        }
        Insert: {
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_email: string
          referred_user_id?: string | null
          referrer_id: string
          status?: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_email?: string
          referred_user_id?: string | null
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      search_trends: {
        Row: {
          category: string | null
          celebrity_name: string
          celebrity_slug: string
          created_at: string
          id: string
          last_searched_at: string
          search_count: number
        }
        Insert: {
          category?: string | null
          celebrity_name: string
          celebrity_slug: string
          created_at?: string
          id?: string
          last_searched_at?: string
          search_count?: number
        }
        Update: {
          category?: string | null
          celebrity_name?: string
          celebrity_slug?: string
          created_at?: string
          id?: string
          last_searched_at?: string
          search_count?: number
        }
        Relationships: []
      }
      trading_achievements: {
        Row: {
          achievement_id: string
          achievement_name: string
          id: string
          portfolio_id: string
          unlocked_at: string
        }
        Insert: {
          achievement_id: string
          achievement_name: string
          id?: string
          portfolio_id: string
          unlocked_at?: string
        }
        Update: {
          achievement_id?: string
          achievement_name?: string
          id?: string
          portfolio_id?: string
          unlocked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_achievements_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "trading_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_cash_purchases: {
        Row: {
          amount_purchased: number
          created_at: string
          id: string
          portfolio_id: string
          price_paid: number
          stripe_payment_intent_id: string | null
        }
        Insert: {
          amount_purchased: number
          created_at?: string
          id?: string
          portfolio_id: string
          price_paid: number
          stripe_payment_intent_id?: string | null
        }
        Update: {
          amount_purchased?: number
          created_at?: string
          id?: string
          portfolio_id?: string
          price_paid?: number
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trading_cash_purchases_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "trading_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_orders: {
        Row: {
          company_name: string
          created_at: string
          executed_at: string | null
          id: string
          order_status: string
          order_type: string
          portfolio_id: string
          price_per_share: number
          shares: number
          ticker: string
          total_amount: number
        }
        Insert: {
          company_name: string
          created_at?: string
          executed_at?: string | null
          id?: string
          order_status?: string
          order_type: string
          portfolio_id: string
          price_per_share: number
          shares: number
          ticker: string
          total_amount: number
        }
        Update: {
          company_name?: string
          created_at?: string
          executed_at?: string | null
          id?: string
          order_status?: string
          order_type?: string
          portfolio_id?: string
          price_per_share?: number
          shares?: number
          ticker?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "trading_orders_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "trading_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_portfolios: {
        Row: {
          cash_balance: number
          created_at: string
          id: string
          session_id: string | null
          total_invested: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cash_balance?: number
          created_at?: string
          id?: string
          session_id?: string | null
          total_invested?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cash_balance?: number
          created_at?: string
          id?: string
          session_id?: string | null
          total_invested?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      trading_positions: {
        Row: {
          avg_cost_per_share: number
          company_name: string
          created_at: string
          current_price: number | null
          id: string
          last_price_update: string | null
          portfolio_id: string
          shares: number
          ticker: string
          updated_at: string
        }
        Insert: {
          avg_cost_per_share: number
          company_name: string
          created_at?: string
          current_price?: number | null
          id?: string
          last_price_update?: string | null
          portfolio_id: string
          shares: number
          ticker: string
          updated_at?: string
        }
        Update: {
          avg_cost_per_share?: number
          company_name?: string
          created_at?: string
          current_price?: number | null
          id?: string
          last_price_update?: string | null
          portfolio_id?: string
          shares?: number
          ticker?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trading_positions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "trading_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      user_access: {
        Row: {
          beta_expires_at: string | null
          beta_invite_id: string | null
          created_at: string
          has_lifetime_access: boolean
          id: string
          referred_by_code: string | null
          search_count: number
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          beta_expires_at?: string | null
          beta_invite_id?: string | null
          created_at?: string
          has_lifetime_access?: boolean
          id?: string
          referred_by_code?: string | null
          search_count?: number
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          beta_expires_at?: string | null
          beta_invite_id?: string | null
          created_at?: string
          has_lifetime_access?: boolean
          id?: string
          referred_by_code?: string | null
          search_count?: number
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_access_beta_invite_id_fkey"
            columns: ["beta_invite_id"]
            isOneToOne: false
            referencedRelation: "beta_invites"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_ip_address: string
          p_max_requests?: number
          p_window_seconds?: number
        }
        Returns: boolean
      }
      cleanup_rate_limits: {
        Args: { p_older_than_minutes?: number }
        Returns: number
      }
      get_request_session_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_affiliate_referrals: {
        Args: { affiliate_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
