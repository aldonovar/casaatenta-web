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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      consumer_claims: {
        Row: {
          address: string
          claim_detail: string
          claim_terms_consent_at: string
          claim_terms_version: string
          claim_type: string
          claimed_amount: number | null
          code: string
          consumer_request: string
          created_at: string
          document_number: string
          document_type: string
          email: string
          email_retry_after: string | null
          email_retry_count: number
          full_name: string
          good_type: string
          id: string
          is_minor: boolean
          last_email_error: string | null
          minor_guardian: string | null
          minor_guardian_address: string | null
          minor_guardian_email: string | null
          minor_guardian_phone: string | null
          phone: string
          privacy_consent_at: string
          privacy_consent_version: string
          product_description: string
          provider_observations: string | null
          provider_response_communicated_at: string | null
          provider_response_reference: string | null
          request_fingerprint: string | null
          resend_notification_id: string | null
          resend_receipt_id: string | null
          status: string
          turnstile_hostname: string | null
          updated_at: string
        }
        Insert: {
          address: string
          claim_detail: string
          claim_terms_consent_at: string
          claim_terms_version?: string
          claim_type: string
          claimed_amount?: number | null
          code?: string
          consumer_request: string
          created_at?: string
          document_number: string
          document_type: string
          email: string
          email_retry_after?: string | null
          email_retry_count?: number
          full_name: string
          good_type: string
          id?: string
          is_minor?: boolean
          last_email_error?: string | null
          minor_guardian?: string | null
          minor_guardian_address?: string | null
          minor_guardian_email?: string | null
          minor_guardian_phone?: string | null
          phone: string
          privacy_consent_at: string
          privacy_consent_version?: string
          product_description: string
          provider_observations?: string | null
          provider_response_communicated_at?: string | null
          provider_response_reference?: string | null
          request_fingerprint?: string | null
          resend_notification_id?: string | null
          resend_receipt_id?: string | null
          status?: string
          turnstile_hostname?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          claim_detail?: string
          claim_terms_consent_at?: string
          claim_terms_version?: string
          claim_type?: string
          claimed_amount?: number | null
          code?: string
          consumer_request?: string
          created_at?: string
          document_number?: string
          document_type?: string
          email?: string
          email_retry_after?: string | null
          email_retry_count?: number
          full_name?: string
          good_type?: string
          id?: string
          is_minor?: boolean
          last_email_error?: string | null
          minor_guardian?: string | null
          minor_guardian_address?: string | null
          minor_guardian_email?: string | null
          minor_guardian_phone?: string | null
          phone?: string
          privacy_consent_at?: string
          privacy_consent_version?: string
          product_description?: string
          provider_observations?: string | null
          provider_response_communicated_at?: string | null
          provider_response_reference?: string | null
          request_fingerprint?: string | null
          resend_notification_id?: string | null
          resend_receipt_id?: string | null
          status?: string
          turnstile_hostname?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          email_retry_after: string | null
          email_retry_count: number
          id: string
          last_email_error: string | null
          location: string | null
          measures: string | null
          message: string | null
          name: string
          phone: string
          privacy_consent_at: string
          privacy_consent_version: string
          project_data: Json
          request_fingerprint: string | null
          resend_confirmation_id: string | null
          resend_notification_id: string | null
          service: string | null
          source: string
          status: string
          turnstile_hostname: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          email_retry_after?: string | null
          email_retry_count?: number
          id?: string
          last_email_error?: string | null
          location?: string | null
          measures?: string | null
          message?: string | null
          name: string
          phone: string
          privacy_consent_at: string
          privacy_consent_version?: string
          project_data?: Json
          request_fingerprint?: string | null
          resend_confirmation_id?: string | null
          resend_notification_id?: string | null
          service?: string | null
          source: string
          status?: string
          turnstile_hostname?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_retry_after?: string | null
          email_retry_count?: number
          id?: string
          last_email_error?: string | null
          location?: string | null
          measures?: string | null
          message?: string | null
          name?: string
          phone?: string
          privacy_consent_at?: string
          privacy_consent_version?: string
          project_data?: Json
          request_fingerprint?: string | null
          resend_confirmation_id?: string | null
          resend_notification_id?: string | null
          service?: string | null
          source?: string
          status?: string
          turnstile_hostname?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_events: {
        Row: {
          email_id: string | null
          event_created_at: string | null
          event_type: string
          id: string
          payload: Json
          received_at: string
          recipient_email: string | null
          svix_id: string
        }
        Insert: {
          email_id?: string | null
          event_created_at?: string | null
          event_type: string
          id?: string
          payload: Json
          received_at?: string
          recipient_email?: string | null
          svix_id: string
        }
        Update: {
          email_id?: string | null
          event_created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          received_at?: string
          recipient_email?: string | null
          svix_id?: string
        }
        Relationships: []
      }
      newsletter_consent_events: {
        Row: {
          consent_version: string
          created_at: string
          event_type: string
          id: string
          request_fingerprint: string | null
          source_event_id: string | null
          subscriber_id: string
        }
        Insert: {
          consent_version: string
          created_at?: string
          event_type: string
          id?: string
          request_fingerprint?: string | null
          source_event_id?: string | null
          subscriber_id: string
        }
        Update: {
          consent_version?: string
          created_at?: string
          event_type?: string
          id?: string
          request_fingerprint?: string | null
          source_event_id?: string | null
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_consent_events_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "newsletter_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          confirmation_expires_at: string | null
          confirmation_token_hash: string | null
          confirmed_at: string | null
          consent_at: string
          consent_version: string
          created_at: string
          email: string
          email_retry_after: string | null
          email_retry_count: number
          id: string
          last_email_error: string | null
          name: string | null
          resend_confirmation_id: string | null
          resend_welcome_id: string | null
          source: string
          status: string
          suppression_reason: string | null
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          confirmation_expires_at?: string | null
          confirmation_token_hash?: string | null
          confirmed_at?: string | null
          consent_at: string
          consent_version?: string
          created_at?: string
          email: string
          email_retry_after?: string | null
          email_retry_count?: number
          id?: string
          last_email_error?: string | null
          name?: string | null
          resend_confirmation_id?: string | null
          resend_welcome_id?: string | null
          source?: string
          status?: string
          suppression_reason?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          confirmation_expires_at?: string | null
          confirmation_token_hash?: string | null
          confirmed_at?: string | null
          consent_at?: string
          consent_version?: string
          created_at?: string
          email?: string
          email_retry_after?: string | null
          email_retry_count?: number
          id?: string
          last_email_error?: string | null
          name?: string | null
          resend_confirmation_id?: string | null
          resend_welcome_id?: string | null
          source?: string
          status?: string
          suppression_reason?: string | null
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotation_email_deliveries: {
        Row: {
          attachment_bytes: number
          attachment_filename: string
          attempt_count: number
          bounced_at: string | null
          complained_at: string | null
          created_at: string
          delivered_at: string | null
          failed_at: string | null
          id: string
          idempotency_key: string
          is_test: boolean
          last_event_at: string | null
          quotation_number: string
          recipient_fingerprint: string
          recipient_masked: string
          resend_email_id: string | null
          sanitized_error: string | null
          sent_at: string | null
          status: string
          suppressed_at: string | null
          updated_at: string
        }
        Insert: {
          attachment_bytes: number
          attachment_filename: string
          attempt_count?: number
          bounced_at?: string | null
          complained_at?: string | null
          created_at?: string
          delivered_at?: string | null
          failed_at?: string | null
          id?: string
          idempotency_key: string
          is_test?: boolean
          last_event_at?: string | null
          quotation_number: string
          recipient_fingerprint: string
          recipient_masked: string
          resend_email_id?: string | null
          sanitized_error?: string | null
          sent_at?: string | null
          status?: string
          suppressed_at?: string | null
          updated_at?: string
        }
        Update: {
          attachment_bytes?: number
          attachment_filename?: string
          attempt_count?: number
          bounced_at?: string | null
          complained_at?: string | null
          created_at?: string
          delivered_at?: string | null
          failed_at?: string | null
          id?: string
          idempotency_key?: string
          is_test?: boolean
          last_event_at?: string | null
          quotation_number?: string
          recipient_fingerprint?: string
          recipient_masked?: string
          resend_email_id?: string | null
          sanitized_error?: string | null
          sent_at?: string | null
          status?: string
          suppressed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      submission_rate_limits: {
        Row: {
          attempt_count: number
          fingerprint: string
          scope: string
          window_started_at: string
        }
        Insert: {
          attempt_count?: number
          fingerprint: string
          scope: string
          window_started_at?: string
        }
        Update: {
          attempt_count?: number
          fingerprint?: string
          scope?: string
          window_started_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_submission_rate_limit: {
        Args: {
          p_fingerprint: string
          p_limit: number
          p_scope: string
          p_window_seconds: number
        }
        Returns: boolean
      }
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
