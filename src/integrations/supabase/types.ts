export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      hero_content: {
        Row: {
          created_at: string | null
          cta_link: string | null
          cta_text: string | null
          headline: string
          id: string
          image_url: string | null
          order: number | null
          status: string | null
          subheadline: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          headline: string
          id?: string
          image_url?: string | null
          order?: number | null
          status?: string | null
          subheadline?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_link?: string | null
          cta_text?: string | null
          headline?: string
          id?: string
          image_url?: string | null
          order?: number | null
          status?: string | null
          subheadline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      news: {
        Row: {
          author: string | null
          category: string | null
          content: string | null
          created_at: string
          date: string
          excerpt: string | null
          featured: boolean | null
          id: string
          image: string | null
          keywords: string[] | null
          read_time: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          date?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          keywords?: string[] | null
          read_time?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          date?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          image?: string | null
          keywords?: string[] | null
          read_time?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          application_url: string | null
          created_at: string
          deadline: string | null
          description: string | null
          employment_type: string | null
          featured: boolean | null
          id: string
          is_open: boolean | null
          location: string | null
          organization: string | null
          requirements: string[] | null
          responsibilities: string[] | null
          salary_range: string | null
          status: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          employment_type?: string | null
          featured?: boolean | null
          id?: string
          is_open?: boolean | null
          location?: string | null
          organization?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          status?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          employment_type?: string | null
          featured?: boolean | null
          id?: string
          is_open?: boolean | null
          location?: string | null
          organization?: string | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          salary_range?: string | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      paralegal_cases: {
        Row: {
          case_status: string | null
          case_title: string | null
          details: string | null
          id: string
          opened_at: string | null
          paralegal_id: string | null
        }
        Insert: {
          case_status?: string | null
          case_title?: string | null
          details?: string | null
          id?: string
          opened_at?: string | null
          paralegal_id?: string | null
        }
        Update: {
          case_status?: string | null
          case_title?: string | null
          details?: string | null
          id?: string
          opened_at?: string | null
          paralegal_id?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          approach: string | null
          beneficiaries: Json | null
          best_practices: string[] | null
          budget: number | null
          created_at: string
          description: string | null
          donors: string[] | null
          end_date: string | null
          featured: boolean | null
          geographic_coverage: string[] | null
          id: string
          image: string | null
          location: string[] | null
          objectives: string[] | null
          partners: string[] | null
          results: Json[] | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          approach?: string | null
          beneficiaries?: Json | null
          best_practices?: string[] | null
          budget?: number | null
          created_at?: string
          description?: string | null
          donors?: string[] | null
          end_date?: string | null
          featured?: boolean | null
          geographic_coverage?: string[] | null
          id?: string
          image?: string | null
          location?: string[] | null
          objectives?: string[] | null
          partners?: string[] | null
          results?: Json[] | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          approach?: string | null
          beneficiaries?: Json | null
          best_practices?: string[] | null
          budget?: number | null
          created_at?: string
          description?: string | null
          donors?: string[] | null
          end_date?: string | null
          featured?: boolean | null
          geographic_coverage?: string[] | null
          id?: string
          image?: string | null
          location?: string[] | null
          objectives?: string[] | null
          partners?: string[] | null
          results?: Json[] | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          category: string | null
          created_at: string
          date: string
          description: string | null
          download_count: number | null
          excerpt: string | null
          featured: boolean | null
          file_size: string | null
          file_url: string | null
          id: string
          image: string | null
          keywords: string[] | null
          pages: string | null
          seo_description: string | null
          seo_title: string | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          download_count?: number | null
          excerpt?: string | null
          featured?: boolean | null
          file_size?: string | null
          file_url?: string | null
          id?: string
          image?: string | null
          keywords?: string[] | null
          pages?: string | null
          seo_description?: string | null
          seo_title?: string | null
          title: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          download_count?: number | null
          excerpt?: string | null
          featured?: boolean | null
          file_size?: string | null
          file_url?: string | null
          id?: string
          image?: string | null
          keywords?: string[] | null
          pages?: string | null
          seo_description?: string | null
          seo_title?: string | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          download_count: number | null
          featured: boolean | null
          file_url: string | null
          id: string
          image: string | null
          title: string
          type: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          featured?: boolean | null
          file_url?: string | null
          id?: string
          image?: string | null
          title: string
          type?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          featured?: boolean | null
          file_url?: string | null
          id?: string
          image?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      staff_tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          staff_id: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          staff_id?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          staff_id?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: []
      }
      stakeholder_projects: {
        Row: {
          end_date: string | null
          id: string
          project_name: string | null
          role: string | null
          stakeholder_id: string | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          end_date?: string | null
          id?: string
          project_name?: string | null
          role?: string | null
          stakeholder_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          end_date?: string | null
          id?: string
          project_name?: string | null
          role?: string | null
          stakeholder_id?: string | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          category: string | null
          client_image: string | null
          client_name: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          impact_metrics: Json | null
          location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          client_image?: string | null
          client_name?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          impact_metrics?: Json | null
          location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          client_image?: string | null
          client_name?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          impact_metrics?: Json | null
          location?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          name: string
          order: number | null
          photo_url: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          name: string
          order?: number | null
          photo_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string
          order?: number | null
          photo_url?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          name: string
          order: number | null
          quote: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name: string
          order?: number | null
          quote?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string
          order?: number | null
          quote?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
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
    Enums: {},
  },
} as const
