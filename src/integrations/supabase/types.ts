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
      api_credentials: {
        Row: {
          client_id: string
          client_secret: string
          created_at: string
          id: string
          provider: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_secret: string
          created_at?: string
          id?: string
          provider: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_secret?: string
          created_at?: string
          id?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          teamid: string
          type: string
          userid: string
        }
        Insert: {
          created_at?: string
          id?: string
          teamid: string
          type?: string
          userid: string
        }
        Update: {
          created_at?: string
          id?: string
          teamid?: string
          type?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_teamid_fkey"
            columns: ["teamid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          awayteamid: string
          created_at: string
          date: string
          hometeamid: string
          id: string
          status: string
          time: string
          venue: string
        }
        Insert: {
          awayteamid: string
          created_at?: string
          date: string
          hometeamid: string
          id: string
          status?: string
          time: string
          venue: string
        }
        Update: {
          awayteamid?: string
          created_at?: string
          date?: string
          hometeamid?: string
          id?: string
          status?: string
          time?: string
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_awayteamid_fkey"
            columns: ["awayteamid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "games_hometeamid_fkey"
            columns: ["hometeamid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      price_alerts: {
        Row: {
          categoryid: string | null
          createdat: string
          gameid: string
          id: string
          isactive: boolean
          notifiedat: string | null
          targetprice: number
          userid: string
        }
        Insert: {
          categoryid?: string | null
          createdat?: string
          gameid: string
          id?: string
          isactive?: boolean
          notifiedat?: string | null
          targetprice: number
          userid: string
        }
        Update: {
          categoryid?: string | null
          createdat?: string
          gameid?: string
          id?: string
          isactive?: boolean
          notifiedat?: string | null
          targetprice?: number
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_alerts_categoryid_fkey"
            columns: ["categoryid"]
            isOneToOne: false
            referencedRelation: "ticket_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_alerts_gameid_fkey"
            columns: ["gameid"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          city: string
          id: string
          logo: string | null
          name: string
          primarycolor: string | null
          secondarycolor: string | null
          shortname: string
        }
        Insert: {
          city: string
          id: string
          logo?: string | null
          name: string
          primarycolor?: string | null
          secondarycolor?: string | null
          shortname: string
        }
        Update: {
          city?: string
          id?: string
          logo?: string | null
          name?: string
          primarycolor?: string | null
          secondarycolor?: string | null
          shortname?: string
        }
        Relationships: []
      }
      ticket_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          teamid: string
          userid: string
        }
        Insert: {
          created_at?: string
          id?: string
          teamid: string
          userid: string
        }
        Update: {
          created_at?: string
          id?: string
          teamid?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_teamid_fkey"
            columns: ["teamid"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tracked_games: {
        Row: {
          created_at: string
          gameid: string
          id: string
          userid: string
        }
        Insert: {
          created_at?: string
          gameid: string
          id?: string
          userid: string
        }
        Update: {
          created_at?: string
          gameid?: string
          id?: string
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tracked_games_gameid_fkey"
            columns: ["gameid"]
            isOneToOne: false
            referencedRelation: "games"
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
