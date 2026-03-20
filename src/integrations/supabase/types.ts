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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admit_cards: {
        Row: {
          application_id: string
          center_id: string
          exam_id: string
          generated_at: string
          id: string
          roll_number: string
          user_id: string
        }
        Insert: {
          application_id: string
          center_id: string
          exam_id: string
          generated_at?: string
          id?: string
          roll_number: string
          user_id: string
        }
        Update: {
          application_id?: string
          center_id?: string
          exam_id?: string
          generated_at?: string
          id?: string
          roll_number?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admit_cards_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "exam_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admit_cards_center_id_fkey"
            columns: ["center_id"]
            isOneToOne: false
            referencedRelation: "exam_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admit_cards_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_applications: {
        Row: {
          address_details: Json | null
          created_at: string
          current_step: number
          documents: Json | null
          education_details: Json | null
          exam_id: string
          fee_status: string
          id: string
          is_submitted: boolean | null
          personal_details: Json | null
          selected_subjects: Json | null
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_details?: Json | null
          created_at?: string
          current_step?: number
          documents?: Json | null
          education_details?: Json | null
          exam_id: string
          fee_status?: string
          id?: string
          is_submitted?: boolean | null
          personal_details?: Json | null
          selected_subjects?: Json | null
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_details?: Json | null
          created_at?: string
          current_step?: number
          documents?: Json | null
          education_details?: Json | null
          exam_id?: string
          fee_status?: string
          id?: string
          is_submitted?: boolean | null
          personal_details?: Json | null
          selected_subjects?: Json | null
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_applications_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_centers: {
        Row: {
          address: string | null
          allocated: number
          capacity: number
          center_code: string | null
          center_name: string
          center_type: string | null
          city: string | null
          contact_email: string | null
          contact_number: string | null
          created_at: string
          exam_id: string
          facilities: Json | null
          gate_closing_time: string | null
          id: string
          incharge_name: string | null
          is_accessible: boolean | null
          landmark: string | null
          pincode: string | null
          reporting_time: string | null
          state: string | null
        }
        Insert: {
          address?: string | null
          allocated?: number
          capacity?: number
          center_code?: string | null
          center_name: string
          center_type?: string | null
          city?: string | null
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
          exam_id: string
          facilities?: Json | null
          gate_closing_time?: string | null
          id?: string
          incharge_name?: string | null
          is_accessible?: boolean | null
          landmark?: string | null
          pincode?: string | null
          reporting_time?: string | null
          state?: string | null
        }
        Update: {
          address?: string | null
          allocated?: number
          capacity?: number
          center_code?: string | null
          center_name?: string
          center_type?: string | null
          city?: string | null
          contact_email?: string | null
          contact_number?: string | null
          created_at?: string
          exam_id?: string
          facilities?: Json | null
          gate_closing_time?: string | null
          id?: string
          incharge_name?: string | null
          is_accessible?: boolean | null
          landmark?: string | null
          pincode?: string | null
          reporting_time?: string | null
          state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_centers_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          academic_year: string | null
          class: string
          created_at: string
          created_by: string | null
          description: string | null
          duration_minutes: number | null
          eligibility: string | null
          exam_date: string | null
          exam_pattern: string | null
          exam_time: string | null
          exam_type: string | null
          fee_amount: number
          id: string
          important_dates: Json | null
          instructions: string | null
          is_active: boolean | null
          language: string | null
          last_date_to_apply: string | null
          negative_marking: boolean | null
          negative_marks_value: number | null
          passing_marks: number | null
          subjects: Json | null
          syllabus_url: string | null
          title: string
          total_marks: number | null
          total_questions: number | null
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          class: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          eligibility?: string | null
          exam_date?: string | null
          exam_pattern?: string | null
          exam_time?: string | null
          exam_type?: string | null
          fee_amount?: number
          id?: string
          important_dates?: Json | null
          instructions?: string | null
          is_active?: boolean | null
          language?: string | null
          last_date_to_apply?: string | null
          negative_marking?: boolean | null
          negative_marks_value?: number | null
          passing_marks?: number | null
          subjects?: Json | null
          syllabus_url?: string | null
          title: string
          total_marks?: number | null
          total_questions?: number | null
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          class?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_minutes?: number | null
          eligibility?: string | null
          exam_date?: string | null
          exam_pattern?: string | null
          exam_time?: string | null
          exam_type?: string | null
          fee_amount?: number
          id?: string
          important_dates?: Json | null
          instructions?: string | null
          is_active?: boolean | null
          language?: string | null
          last_date_to_apply?: string | null
          negative_marking?: boolean | null
          negative_marks_value?: number | null
          passing_marks?: number | null
          subjects?: Json | null
          syllabus_url?: string | null
          title?: string
          total_marks?: number | null
          total_questions?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          application_id: string
          created_at: string
          id: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          application_id: string
          created_at?: string
          id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          application_id?: string
          created_at?: string
          id?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "exam_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          class: string | null
          created_at: string
          dob: string | null
          email: string | null
          father_name: string | null
          full_name: string
          gender: string | null
          id: string
          mobile: string | null
          mother_name: string | null
          photo_url: string | null
          signature_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          class?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          father_name?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          mobile?: string | null
          mother_name?: string | null
          photo_url?: string | null
          signature_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          class?: string | null
          created_at?: string
          dob?: string | null
          email?: string | null
          father_name?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          mobile?: string | null
          mother_name?: string | null
          photo_url?: string | null
          signature_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student"
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
      app_role: ["admin", "student"],
    },
  },
} as const
