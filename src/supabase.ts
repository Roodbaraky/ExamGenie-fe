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
      class_sow: {
        Row: {
          class_id: number
          sow_id: number
        }
        Insert: {
          class_id?: number
          sow_id: number
        }
        Update: {
          class_id?: number
          sow_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_sow_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_sow_sow_id_fkey"
            columns: ["sow_id"]
            isOneToOne: false
            referencedRelation: "sow"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          class_name: string
          created_at: string | null
          id: number
        }
        Insert: {
          class_name: string
          created_at?: string | null
          id?: number
        }
        Update: {
          class_name?: string
          created_at?: string | null
          id?: number
        }
        Relationships: []
      }
      question_tags: {
        Row: {
          question_id: number
          tag_id: number
        }
        Insert: {
          question_id: number
          tag_id: number
        }
        Update: {
          question_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_tags_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          created_at: string | null
          difficulty: Database["public"]["Enums"]["difficulty"] | null
          id: number
        }
        Insert: {
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          id?: number
        }
        Update: {
          created_at?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty"] | null
          id?: number
        }
        Relationships: []
      }
      sow: {
        Row: {
          id: number
          year: number | null
        }
        Insert: {
          id?: number
          year?: number | null
        }
        Update: {
          id?: number
          year?: number | null
        }
        Relationships: []
      }
      sow_weeks: {
        Row: {
          sow_id: number
          week_id: number
        }
        Insert: {
          sow_id?: number
          week_id: number
        }
        Update: {
          sow_id?: number
          week_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "sow_weeks_sow_id_fkey"
            columns: ["sow_id"]
            isOneToOne: false
            referencedRelation: "sow"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sow_weeks_weeks_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          category: string | null
          id: number
          tag: string
        }
        Insert: {
          category?: string | null
          id?: number
          tag: string
        }
        Update: {
          category?: string | null
          id?: number
          tag?: string
        }
        Relationships: []
      }
      weeks: {
        Row: {
          id: number
          week_number: number | null
        }
        Insert: {
          id?: number
          week_number?: number | null
        }
        Update: {
          id?: number
          week_number?: number | null
        }
        Relationships: []
      }
      weeks_tags: {
        Row: {
          tag_id: number
          week_id: number
        }
        Insert: {
          tag_id: number
          week_id: number
        }
        Update: {
          tag_id?: number
          week_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "weeks_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weeks_tags_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "weeks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      fetch_filtered_tags: {
        Args: {
          classname: string
          currentweek: number
          recallperiod: number
        }
        Returns: {
          tag: string
        }[]
      }
      fetch_questions: {
        Args: {
          input_tags?: string[]
          difficulties?: Database["public"]["Enums"]["difficulty"][]
          limit_value?: number
        }
        Returns: {
          id: number
          difficulty: Database["public"]["Enums"]["difficulty"]
          tags: string[]
        }[]
      }
      get_weeks_with_tags: {
        Args: {
          classname: string
        }
        Returns: {
          week_number: number
          tags: string[]
        }[]
      }
    }
    Enums: {
      difficulty: "foundation" | "crossover" | "higher" | "extended" | "other"
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
