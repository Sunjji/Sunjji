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
      comments: {
        Row: {
          authorId: string
          content: string
          createdAt: string
          diaryId: number
          id: number
        }
        Insert: {
          authorId?: string
          content: string
          createdAt?: string
          diaryId: number
          id?: number
        }
        Update: {
          authorId?: string
          content?: string
          createdAt?: string
          diaryId?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "comments_diaryId_fkey"
            columns: ["diaryId"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
        ]
      }
      diaries: {
        Row: {
          authorId: string
          comment: string
          content: string
          createdAt: string
          id: number
          imageUrl: string
          isPublic: boolean
          title: string
        }
        Insert: {
          authorId?: string
          comment?: string
          content: string
          createdAt?: string
          id?: number
          imageUrl: string
          isPublic: boolean
          title: string
        }
        Update: {
          authorId?: string
          comment?: string
          content?: string
          createdAt?: string
          id?: number
          imageUrl?: string
          isPublic?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "diaries_authorId_fkey1"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          createdAt: string
          diaryId: number
          id: number
          userId: string
        }
        Insert: {
          createdAt?: string
          diaryId: number
          id?: number
          userId?: string
        }
        Update: {
          createdAt?: string
          diaryId?: number
          id?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_diaryId_fkey"
            columns: ["diaryId"]
            isOneToOne: false
            referencedRelation: "diaries"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: number
          breed: string | null
          butlerId: string
          comment: string
          created_at: string
          gender: string
          id: number
          imageUrl: string
          name: string
          weight: number
        }
        Insert: {
          age: number
          breed?: string | null
          butlerId?: string
          comment?: string
          created_at?: string
          gender: string
          id?: number
          imageUrl: string
          name: string
          weight: number
        }
        Update: {
          age?: number
          breed?: string | null
          butlerId?: string
          comment?: string
          created_at?: string
          gender?: string
          id?: number
          imageUrl?: string
          name?: string
          weight?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          birth: string | null
          comment: string
          createdAt: string
          customImage: boolean | null
          firstPetId: number | null
          id: string
          imageUrl: string
          nickname: string
        }
        Insert: {
          birth?: string | null
          comment?: string
          createdAt?: string
          customImage?: boolean | null
          firstPetId?: number | null
          id?: string
          imageUrl?: string
          nickname: string
        }
        Update: {
          birth?: string | null
          comment?: string
          createdAt?: string
          customImage?: boolean | null
          firstPetId?: number | null
          id?: string
          imageUrl?: string
          nickname?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_firstPetId_fkey"
            columns: ["firstPetId"]
            isOneToOne: false
            referencedRelation: "pets"
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
