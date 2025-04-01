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
      analytics_daily: {
        Row: {
          created_at: string
          date: string
          id: string
          top_selling_items: Json | null
          total_orders: number
          total_sales: number
          total_waste: number
          waste_data: Json | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          top_selling_items?: Json | null
          total_orders?: number
          total_sales?: number
          total_waste?: number
          waste_data?: Json | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          top_selling_items?: Json | null
          total_orders?: number
          total_sales?: number
          total_waste?: number
          waste_data?: Json | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          category: string
          cost_per_unit: number
          created_at: string
          id: string
          last_restocked: string
          name: string
          quantity: number
          supplier: string | null
          threshold: number
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          cost_per_unit: number
          created_at?: string
          id?: string
          last_restocked?: string
          name: string
          quantity?: number
          supplier?: string | null
          threshold?: number
          unit: string
          updated_at?: string
        }
        Update: {
          category?: string
          cost_per_unit?: number
          created_at?: string
          id?: string
          last_restocked?: string
          name?: string
          quantity?: number
          supplier?: string | null
          threshold?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          best_seller: boolean | null
          calories: number | null
          category: Database["public"]["Enums"]["menu_category"]
          created_at: string
          description: string
          id: string
          image_url: string | null
          ingredients: string[]
          name: string
          prep_time: number
          price: number
          status: Database["public"]["Enums"]["item_status"]
          tags: string[] | null
          updated_at: string
          vegetarian: boolean | null
        }
        Insert: {
          best_seller?: boolean | null
          calories?: number | null
          category: Database["public"]["Enums"]["menu_category"]
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          ingredients?: string[]
          name: string
          prep_time?: number
          price: number
          status?: Database["public"]["Enums"]["item_status"]
          tags?: string[] | null
          updated_at?: string
          vegetarian?: boolean | null
        }
        Update: {
          best_seller?: boolean | null
          calories?: number | null
          category?: Database["public"]["Enums"]["menu_category"]
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          ingredients?: string[]
          name?: string
          prep_time?: number
          price?: number
          status?: Database["public"]["Enums"]["item_status"]
          tags?: string[] | null
          updated_at?: string
          vegetarian?: boolean | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          item_id: string
          name: string
          order_id: string
          price: number
          quantity: number
          special_instructions: string | null
          total: number
        }
        Insert: {
          id?: string
          item_id: string
          name: string
          order_id: string
          price: number
          quantity: number
          special_instructions?: string | null
          total: number
        }
        Update: {
          id?: string
          item_id?: string
          name?: string
          order_id?: string
          price?: number
          quantity?: number
          special_instructions?: string | null
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          completed_at: string | null
          created_at: string
          customer_id: string | null
          customer_name: string
          estimated_ready_time: string | null
          id: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          special_instructions: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name: string
          estimated_ready_time?: string | null
          id?: string
          order_number: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          estimated_ready_time?: string | null
          id?: string
          order_number?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          profile_image_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          wallet_balance: number
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          wallet_balance?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          profile_image_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      waste_tracking: {
        Row: {
          cost: number
          id: string
          item_id: string | null
          item_name: string
          quantity: number
          reason: string
          recorded_at: string
          recorded_by: string | null
        }
        Insert: {
          cost: number
          id?: string
          item_id?: string | null
          item_name: string
          quantity: number
          reason: string
          recorded_at?: string
          recorded_by?: string | null
        }
        Update: {
          cost?: number
          id?: string
          item_id?: string | null
          item_name?: string
          quantity?: number
          reason?: string
          recorded_at?: string
          recorded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "waste_tracking_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
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
      item_status: "available" | "unavailable" | "low_stock"
      menu_category:
        | "breakfast"
        | "lunch"
        | "dinner"
        | "snacks"
        | "beverages"
        | "desserts"
      order_status:
        | "pending"
        | "confirmed"
        | "preparing"
        | "ready"
        | "completed"
        | "cancelled"
      payment_method: "wallet" | "upi" | "card" | "cash"
      payment_status: "pending" | "completed" | "failed"
      transaction_status: "pending" | "completed" | "failed"
      transaction_type: "deposit" | "withdrawal" | "payment"
      user_role: "student" | "staff" | "cafeteria_staff" | "admin"
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
