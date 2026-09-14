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
      account_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          note: string | null
          request_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          note?: string | null
          request_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          note?: string | null
          request_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_attachments: {
        Row: {
          alert_id: string
          created_at: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_path: string
        }
        Insert: {
          alert_id: string
          created_at?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path: string
        }
        Update: {
          alert_id?: string
          created_at?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "alert_attachments_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "territory_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_categories: {
        Row: {
          audience: string
          created_at: string
          is_active: boolean
          label: string
          slug: string
          sort_order: number
        }
        Insert: {
          audience?: string
          created_at?: string
          is_active?: boolean
          label: string
          slug: string
          sort_order?: number
        }
        Update: {
          audience?: string
          created_at?: string
          is_active?: boolean
          label?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      alert_status_history: {
        Row: {
          actor_id: string | null
          alert_id: string
          created_at: string
          from_state: Database["public"]["Enums"]["alert_state"] | null
          id: string
          note: string | null
          to_state: Database["public"]["Enums"]["alert_state"]
        }
        Insert: {
          actor_id?: string | null
          alert_id: string
          created_at?: string
          from_state?: Database["public"]["Enums"]["alert_state"] | null
          id?: string
          note?: string | null
          to_state: Database["public"]["Enums"]["alert_state"]
        }
        Update: {
          actor_id?: string | null
          alert_id?: string
          created_at?: string
          from_state?: Database["public"]["Enums"]["alert_state"] | null
          id?: string
          note?: string | null
          to_state?: Database["public"]["Enums"]["alert_state"]
        }
        Relationships: [
          {
            foreignKeyName: "alert_status_history_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "territory_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          detail: Json
          entity_id: string | null
          entity_kind: string | null
          id: string
          organization_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          detail?: Json
          entity_id?: string | null
          entity_kind?: string | null
          id?: string
          organization_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          detail?: Json
          entity_id?: string | null
          entity_kind?: string | null
          id?: string
          organization_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_runs: {
        Row: {
          created_at: string
          detail: Json
          finished_at: string | null
          id: string
          job: string
          lease_until: string | null
          processed: number
          started_at: string
          status: string
        }
        Insert: {
          created_at?: string
          detail?: Json
          finished_at?: string | null
          id?: string
          job: string
          lease_until?: string | null
          processed?: number
          started_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          detail?: Json
          finished_at?: string | null
          id?: string
          job?: string
          lease_until?: string | null
          processed?: number
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      benefit_redemptions: {
        Row: {
          benefit_id: string
          code: string
          created_at: string
          id: string
          status: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          benefit_id: string
          code?: string
          created_at?: string
          id?: string
          status?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          benefit_id?: string
          code?: string
          created_at?: string
          id?: string
          status?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "benefit_redemptions_benefit_id_fkey"
            columns: ["benefit_id"]
            isOneToOne: false
            referencedRelation: "benefits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "benefit_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      benefits: {
        Row: {
          address: string | null
          benefit_type: string
          business_name: string
          city: string | null
          conditions: string | null
          created_at: string
          description: string | null
          discount_percent: number | null
          expires_at: string | null
          id: string
          is_published: boolean
          logo_url: string | null
          province: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          benefit_type?: string
          business_name: string
          city?: string | null
          conditions?: string | null
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          is_published?: boolean
          logo_url?: string | null
          province?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          benefit_type?: string
          business_name?: string
          city?: string | null
          conditions?: string | null
          created_at?: string
          description?: string | null
          discount_percent?: number | null
          expires_at?: string | null
          id?: string
          is_published?: boolean
          logo_url?: string | null
          province?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      content_relations: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          relation: string
          source_id: string
          source_kind: Database["public"]["Enums"]["content_kind"]
          target_id: string
          target_kind: Database["public"]["Enums"]["content_kind"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          relation?: string
          source_id: string
          source_kind: Database["public"]["Enums"]["content_kind"]
          target_id: string
          target_kind: Database["public"]["Enums"]["content_kind"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          relation?: string
          source_id?: string
          source_kind?: Database["public"]["Enums"]["content_kind"]
          target_id?: string
          target_kind?: Database["public"]["Enums"]["content_kind"]
        }
        Relationships: []
      }
      discoveries: {
        Row: {
          category: string
          city: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean
          link_url: string | null
          province: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          link_url?: string | null
          province?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          city?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          link_url?: string | null
          province?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_bookings: {
        Row: {
          created_at: string
          event_id: string
          id: string
          note: string | null
          seats: number
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          note?: string | null
          seats?: number
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          note?: string | null
          seats?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "member_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      exclusive_contents: {
        Row: {
          body: string | null
          content_type: string
          cover_url: string | null
          created_at: string
          description: string | null
          download_url: string | null
          id: string
          is_published: boolean
          media_url: string | null
          publish_at: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          content_type?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          download_url?: string | null
          id?: string
          is_published?: boolean
          media_url?: string | null
          publish_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          content_type?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          download_url?: string | null
          id?: string
          is_published?: boolean
          media_url?: string | null
          publish_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          label: string | null
          link_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          label?: string | null
          link_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          label?: string | null
          link_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          id: string
          label: string | null
          target_id: string
          target_kind: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          target_id: string
          target_kind: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          target_id?: string
          target_kind?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          created_at: string
          cv_path: string | null
          email: string
          full_name: string
          id: string
          job_id: string
          message: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cv_path?: string | null
          email: string
          full_name: string
          id?: string
          job_id: string
          message?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cv_path?: string | null
          email?: string
          full_name?: string
          id?: string
          job_id?: string
          message?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      job_posts: {
        Row: {
          apply_email: string | null
          archived_at: string | null
          company_id: string | null
          company_name: string
          comune: string
          contract_type: string
          created_at: string
          description: string
          expires_at: string
          id: string
          latitude: number | null
          longitude: number | null
          moderation_note: string | null
          organization_id: string | null
          province: string | null
          requirements: string | null
          salary_range: string | null
          sector: string
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          apply_email?: string | null
          archived_at?: string | null
          company_id?: string | null
          company_name: string
          comune: string
          contract_type: string
          created_at?: string
          description: string
          expires_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          moderation_note?: string | null
          organization_id?: string | null
          province?: string | null
          requirements?: string | null
          salary_range?: string | null
          sector: string
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          apply_email?: string | null
          archived_at?: string | null
          company_id?: string | null
          company_name?: string
          comune?: string
          contract_type?: string
          created_at?: string
          description?: string
          expires_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          moderation_note?: string | null
          organization_id?: string | null
          province?: string | null
          requirements?: string | null
          salary_range?: string | null
          sector?: string
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_posts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      job_saves: {
        Row: {
          created_at: string
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_saves_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      listener_collection_items: {
        Row: {
          collection_id: string
          created_at: string
          episode_slug: string
          id: string
          label: string | null
          link_url: string | null
          program_slug: string
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          episode_slug: string
          id?: string
          label?: string | null
          link_url?: string | null
          program_slug: string
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          episode_slug?: string
          id?: string
          label?: string | null
          link_url?: string | null
          program_slug?: string
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listener_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "listener_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      listener_collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      listener_follows: {
        Row: {
          created_at: string
          id: string
          last_seen_at: string
          program_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_seen_at?: string
          program_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_seen_at?: string
          program_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      listener_progress: {
        Row: {
          audio_url: string
          completed: boolean
          created_at: string
          duration_seconds: number | null
          episode_slug: string
          id: string
          position_seconds: number
          program_slug: string
          updated_at: string
          user_id: string
        }
        Insert: {
          audio_url: string
          completed?: boolean
          created_at?: string
          duration_seconds?: number | null
          episode_slug: string
          id?: string
          position_seconds?: number
          program_slug: string
          updated_at?: string
          user_id: string
        }
        Update: {
          audio_url?: string
          completed?: boolean
          created_at?: string
          duration_seconds?: number | null
          episode_slug?: string
          id?: string
          position_seconds?: number
          program_slug?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      listener_shares: {
        Row: {
          channel: string
          click_count: number
          created_at: string
          episode_slug: string
          id: string
          last_click_at: string | null
          link_url: string
          program_slug: string
          title: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          channel?: string
          click_count?: number
          created_at?: string
          episode_slug: string
          id?: string
          last_click_at?: string | null
          link_url: string
          program_slug: string
          title: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          channel?: string
          click_count?: number
          created_at?: string
          episode_slug?: string
          id?: string
          last_click_at?: string | null
          link_url?: string
          program_slug?: string
          title?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      member_events: {
        Row: {
          archived_at: string | null
          capacity: number | null
          city: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          id: string
          is_published: boolean
          member_booking_opens_at: string | null
          member_only: boolean
          member_price: number | null
          member_seats: number | null
          organization_id: string | null
          perks: string[]
          province: string | null
          public_booking_opens_at: string | null
          public_price: number | null
          starts_at: string
          status: string
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          archived_at?: string | null
          capacity?: number | null
          city?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_published?: boolean
          member_booking_opens_at?: string | null
          member_only?: boolean
          member_price?: number | null
          member_seats?: number | null
          organization_id?: string | null
          perks?: string[]
          province?: string | null
          public_booking_opens_at?: string | null
          public_price?: number | null
          starts_at?: string
          status?: string
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          archived_at?: string | null
          capacity?: number | null
          city?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          id?: string
          is_published?: boolean
          member_booking_opens_at?: string | null
          member_only?: boolean
          member_price?: number | null
          member_seats?: number | null
          organization_id?: string | null
          perks?: string[]
          province?: string | null
          public_booking_opens_at?: string | null
          public_price?: number | null
          starts_at?: string
          status?: string
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          created_at: string
          ends_at: string | null
          id: string
          note: string | null
          organization_id: string
          plan: string
          starts_at: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at?: string | null
          id?: string
          note?: string | null
          organization_id: string
          plan?: string
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string | null
          id?: string
          note?: string | null
          organization_id?: string
          plan?: string
          starts_at?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      moderation_flags: {
        Row: {
          content_id: string
          content_kind: Database["public"]["Enums"]["content_kind"]
          created_at: string
          created_by: string | null
          detail: string | null
          id: string
          reason: string
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
        }
        Insert: {
          content_id: string
          content_kind: Database["public"]["Enums"]["content_kind"]
          created_at?: string
          created_by?: string | null
          detail?: string | null
          id?: string
          reason: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
        }
        Update: {
          content_id?: string
          content_kind?: Database["public"]["Enums"]["content_kind"]
          created_at?: string
          created_by?: string | null
          detail?: string | null
          id?: string
          reason?: string
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
        }
        Relationships: []
      }
      news_article_sources: {
        Row: {
          article_id: string
          author: string | null
          candidate_id: string | null
          created_at: string
          id: string
          original_title: string | null
          original_url: string
          published_at: string | null
          source_id: string | null
          source_name: string
        }
        Insert: {
          article_id: string
          author?: string | null
          candidate_id?: string | null
          created_at?: string
          id?: string
          original_title?: string | null
          original_url: string
          published_at?: string | null
          source_id?: string | null
          source_name: string
        }
        Update: {
          article_id?: string
          author?: string | null
          candidate_id?: string | null
          created_at?: string
          id?: string
          original_title?: string | null
          original_url?: string
          published_at?: string | null
          source_id?: string | null
          source_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_article_sources_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "news_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_article_sources_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "news_candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_article_sources_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "news_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          body: string
          category_slug: string | null
          cover_image_alt: string | null
          cover_image_url: string | null
          created_at: string
          credibility_score: number | null
          focus_keywords: string[]
          generated_by_ai: boolean
          geographic_scope:
            | Database["public"]["Enums"]["news_coverage_scope"]
            | null
          id: string
          province: string | null
          published_at: string | null
          relevance_score: number | null
          review_notes: string | null
          reviewed_by: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["news_article_status"]
          structured_data: Json
          subtitle: string | null
          summary: string | null
          title: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["news_verification_status"]
        }
        Insert: {
          body?: string
          category_slug?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          credibility_score?: number | null
          focus_keywords?: string[]
          generated_by_ai?: boolean
          geographic_scope?:
            | Database["public"]["Enums"]["news_coverage_scope"]
            | null
          id?: string
          province?: string | null
          published_at?: string | null
          relevance_score?: number | null
          review_notes?: string | null
          reviewed_by?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["news_article_status"]
          structured_data?: Json
          subtitle?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["news_verification_status"]
        }
        Update: {
          body?: string
          category_slug?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          credibility_score?: number | null
          focus_keywords?: string[]
          generated_by_ai?: boolean
          geographic_scope?:
            | Database["public"]["Enums"]["news_coverage_scope"]
            | null
          id?: string
          province?: string | null
          published_at?: string | null
          relevance_score?: number | null
          review_notes?: string | null
          reviewed_by?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["news_article_status"]
          structured_data?: Json
          subtitle?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["news_verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "news_articles_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "news_categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      news_automation_runs: {
        Row: {
          articles_generated: number
          articles_published: number
          articles_rejected: number
          articles_review: number
          candidates_collected: number
          created_at: string
          duplicates_found: number
          errors: Json
          finished_at: string | null
          id: string
          logs: Json
          sources_checked: number
          started_at: string
          status: string
          triggered_by: string
        }
        Insert: {
          articles_generated?: number
          articles_published?: number
          articles_rejected?: number
          articles_review?: number
          candidates_collected?: number
          created_at?: string
          duplicates_found?: number
          errors?: Json
          finished_at?: string | null
          id?: string
          logs?: Json
          sources_checked?: number
          started_at?: string
          status?: string
          triggered_by?: string
        }
        Update: {
          articles_generated?: number
          articles_published?: number
          articles_rejected?: number
          articles_review?: number
          candidates_collected?: number
          created_at?: string
          duplicates_found?: number
          errors?: Json
          finished_at?: string | null
          id?: string
          logs?: Json
          sources_checked?: number
          started_at?: string
          status?: string
          triggered_by?: string
        }
        Relationships: []
      }
      news_candidates: {
        Row: {
          canonical_url: string
          category_slug: string | null
          collected_at: string
          content_hash: string
          created_at: string
          credibility_score: number | null
          duplicate_group_id: string | null
          excerpt_original: string | null
          geographic_scope:
            | Database["public"]["Enums"]["news_coverage_scope"]
            | null
          id: string
          processing_status: Database["public"]["Enums"]["news_candidate_status"]
          province: string | null
          raw_metadata: Json
          rejection_reason: string | null
          relevance_score: number | null
          source_author: string | null
          source_id: string | null
          source_name: string | null
          source_published_at: string | null
          title_original: string
          updated_at: string
          url_hash: string
        }
        Insert: {
          canonical_url: string
          category_slug?: string | null
          collected_at?: string
          content_hash: string
          created_at?: string
          credibility_score?: number | null
          duplicate_group_id?: string | null
          excerpt_original?: string | null
          geographic_scope?:
            | Database["public"]["Enums"]["news_coverage_scope"]
            | null
          id?: string
          processing_status?: Database["public"]["Enums"]["news_candidate_status"]
          province?: string | null
          raw_metadata?: Json
          rejection_reason?: string | null
          relevance_score?: number | null
          source_author?: string | null
          source_id?: string | null
          source_name?: string | null
          source_published_at?: string | null
          title_original: string
          updated_at?: string
          url_hash: string
        }
        Update: {
          canonical_url?: string
          category_slug?: string | null
          collected_at?: string
          content_hash?: string
          created_at?: string
          credibility_score?: number | null
          duplicate_group_id?: string | null
          excerpt_original?: string | null
          geographic_scope?:
            | Database["public"]["Enums"]["news_coverage_scope"]
            | null
          id?: string
          processing_status?: Database["public"]["Enums"]["news_candidate_status"]
          province?: string | null
          raw_metadata?: Json
          rejection_reason?: string | null
          relevance_score?: number | null
          source_author?: string | null
          source_id?: string | null
          source_name?: string | null
          source_published_at?: string | null
          title_original?: string
          updated_at?: string
          url_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "news_candidates_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "news_categories"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "news_candidates_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "news_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      news_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          label: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          label?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      news_settings: {
        Row: {
          automation_enabled: boolean
          created_at: string
          cron_schedule: string
          cron_timezone: string
          emergency_stop: boolean
          id: string
          last_run_at: string | null
          manual_review_mode: boolean
          max_italia_articles: number
          max_piemonte_articles: number
          min_credibility_score: number
          min_relevance_score: number
          next_run_at: string | null
          review_period_days: number
          review_period_started_at: string | null
          updated_at: string
        }
        Insert: {
          automation_enabled?: boolean
          created_at?: string
          cron_schedule?: string
          cron_timezone?: string
          emergency_stop?: boolean
          id?: string
          last_run_at?: string | null
          manual_review_mode?: boolean
          max_italia_articles?: number
          max_piemonte_articles?: number
          min_credibility_score?: number
          min_relevance_score?: number
          next_run_at?: string | null
          review_period_days?: number
          review_period_started_at?: string | null
          updated_at?: string
        }
        Update: {
          automation_enabled?: boolean
          created_at?: string
          cron_schedule?: string
          cron_timezone?: string
          emergency_stop?: boolean
          id?: string
          last_run_at?: string | null
          manual_review_mode?: boolean
          max_italia_articles?: number
          max_piemonte_articles?: number
          min_credibility_score?: number
          min_relevance_score?: number
          next_run_at?: string | null
          review_period_days?: number
          review_period_started_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      news_sources: {
        Row: {
          allows_image_reuse: boolean
          allows_scraping: boolean
          city: string | null
          coverage_scope: Database["public"]["Enums"]["news_coverage_scope"]
          created_at: string
          domain: string
          endpoint_url: string | null
          feed_url: string | null
          id: string
          is_active: boolean
          last_checked_at: string | null
          last_error: string | null
          name: string
          province: string | null
          reliability_score: number
          source_type: Database["public"]["Enums"]["news_source_type"]
          updated_at: string
        }
        Insert: {
          allows_image_reuse?: boolean
          allows_scraping?: boolean
          city?: string | null
          coverage_scope?: Database["public"]["Enums"]["news_coverage_scope"]
          created_at?: string
          domain: string
          endpoint_url?: string | null
          feed_url?: string | null
          id?: string
          is_active?: boolean
          last_checked_at?: string | null
          last_error?: string | null
          name: string
          province?: string | null
          reliability_score?: number
          source_type?: Database["public"]["Enums"]["news_source_type"]
          updated_at?: string
        }
        Update: {
          allows_image_reuse?: boolean
          allows_scraping?: boolean
          city?: string | null
          coverage_scope?: Database["public"]["Enums"]["news_coverage_scope"]
          created_at?: string
          domain?: string
          endpoint_url?: string | null
          feed_url?: string | null
          id?: string
          is_active?: boolean
          last_checked_at?: string | null
          last_error?: string | null
          name?: string
          province?: string | null
          reliability_score?: number
          source_type?: Database["public"]["Enums"]["news_source_type"]
          updated_at?: string
        }
        Relationships: []
      }
      notification_reads: {
        Row: {
          id: string
          notification_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          id?: string
          notification_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          id?: string
          notification_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_reads_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_reads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          is_important: boolean
          link_url: string | null
          notif_type: string
          target_interest: string | null
          target_province: string | null
          target_role: Database["public"]["Enums"]["app_role"] | null
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          is_important?: boolean
          link_url?: string | null
          notif_type?: string
          target_interest?: string | null
          target_province?: string | null
          target_role?: Database["public"]["Enums"]["app_role"] | null
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          is_important?: boolean
          link_url?: string | null
          notif_type?: string
          target_interest?: string | null
          target_province?: string | null
          target_role?: Database["public"]["Enums"]["app_role"] | null
          title?: string
        }
        Relationships: []
      }
      organization_responses: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          id: string
          organization_id: string
          review_id: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          id?: string
          organization_id: string
          review_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          id?: string
          organization_id?: string
          review_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_responses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_users: {
        Row: {
          accepted_at: string | null
          created_at: string
          id: string
          invited_email: string | null
          organization_id: string
          role: Database["public"]["Enums"]["org_member_role"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invited_email?: string | null
          organization_id: string
          role?: Database["public"]["Enums"]["org_member_role"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          id?: string
          invited_email?: string | null
          organization_id?: string
          role?: Database["public"]["Enums"]["org_member_role"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_verifications: {
        Row: {
          created_at: string
          document_path: string | null
          id: string
          note: string | null
          organization_id: string
          outcome: Database["public"]["Enums"]["verification_outcome"]
          requested_by: string | null
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_path?: string | null
          id?: string
          note?: string | null
          organization_id: string
          outcome?: Database["public"]["Enums"]["verification_outcome"]
          requested_by?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_path?: string | null
          id?: string
          note?: string | null
          organization_id?: string
          outcome?: Database["public"]["Enums"]["verification_outcome"]
          requested_by?: string | null
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_verifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          archived_at: string | null
          comune: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          is_member: boolean
          kind: Database["public"]["Enums"]["org_kind"]
          logo_url: string | null
          name: string
          owner_id: string
          province: string | null
          slug: string
          status: Database["public"]["Enums"]["org_status"]
          tax_code: string | null
          terms_accepted_at: string | null
          trust_score: number
          updated_at: string
          vat_number: string | null
          verified_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          comune?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_member?: boolean
          kind?: Database["public"]["Enums"]["org_kind"]
          logo_url?: string | null
          name: string
          owner_id: string
          province?: string | null
          slug: string
          status?: Database["public"]["Enums"]["org_status"]
          tax_code?: string | null
          terms_accepted_at?: string | null
          trust_score?: number
          updated_at?: string
          vat_number?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          comune?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_member?: boolean
          kind?: Database["public"]["Enums"]["org_kind"]
          logo_url?: string | null
          name?: string
          owner_id?: string
          province?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["org_status"]
          tax_code?: string | null
          terms_accepted_at?: string | null
          trust_score?: number
          updated_at?: string
          vat_number?: string | null
          verified_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      previews: {
        Row: {
          body: string | null
          content_type: string
          cover_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          is_published: boolean
          media_url: string | null
          member_publish_at: string
          public_publish_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          content_type?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          media_url?: string | null
          member_publish_at?: string
          public_publish_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          content_type?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          is_published?: boolean
          media_url?: string | null
          member_publish_at?: string
          public_publish_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          interests: string[]
          last_name: string | null
          member_id: string
          member_since: string
          membership_status: string
          notify_email: boolean
          notify_in_app: boolean
          province: string | null
          qr_token: string
          referral_code: string
          referred_by: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          interests?: string[]
          last_name?: string | null
          member_id: string
          member_since?: string
          membership_status?: string
          notify_email?: boolean
          notify_in_app?: boolean
          province?: string | null
          qr_token?: string
          referral_code: string
          referred_by?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          interests?: string[]
          last_name?: string | null
          member_id?: string
          member_since?: string
          membership_status?: string
          notify_email?: boolean
          notify_in_app?: boolean
          province?: string | null
          qr_token?: string
          referral_code?: string
          referred_by?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          invited_email: string | null
          referrer_id: string
          registered_at: string | null
          registered_user_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_email?: string | null
          referrer_id: string
          registered_at?: string | null
          registered_user_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_email?: string | null
          referrer_id?: string
          registered_at?: string | null
          registered_user_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_reports: {
        Row: {
          created_at: string
          id: string
          note: string | null
          reason: string
          reporter_id: string | null
          review_id: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          reason: string
          reporter_id?: string | null
          review_id: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          reason?: string
          reporter_id?: string | null
          review_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_reports_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          edit_count: number
          id: string
          images: string[]
          is_verified: boolean
          moderation_note: string | null
          organization_id: string | null
          place_id: string | null
          rating: number
          status: Database["public"]["Enums"]["review_state"]
          updated_at: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          edit_count?: number
          id?: string
          images?: string[]
          is_verified?: boolean
          moderation_note?: string | null
          organization_id?: string | null
          place_id?: string | null
          rating: number
          status?: Database["public"]["Enums"]["review_state"]
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          edit_count?: number
          id?: string
          images?: string[]
          is_verified?: boolean
          moderation_note?: string | null
          organization_id?: string | null
          place_id?: string | null
          rating?: number
          status?: Database["public"]["Enums"]["review_state"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "terrain_places"
            referencedColumns: ["id"]
          },
        ]
      }
      site_feedback: {
        Row: {
          created_at: string
          id: string
          note: string | null
          page_path: string | null
          rating: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          page_path?: string | null
          rating: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          page_path?: string | null
          rating?: number
          user_id?: string | null
        }
        Relationships: []
      }
      terrain_categories: {
        Row: {
          created_at: string
          is_active: boolean
          label: string
          slug: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          label: string
          slug: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          is_active?: boolean
          label?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      terrain_favorites: {
        Row: {
          created_at: string
          id: string
          place_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          place_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          place_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "terrain_favorites_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "terrain_places"
            referencedColumns: ["id"]
          },
        ]
      }
      terrain_places: {
        Row: {
          address: string | null
          archived_at: string | null
          category: string
          comune: string
          created_at: string
          description: string | null
          email: string | null
          expires_at: string | null
          id: string
          image_url: string | null
          last_confirmed_at: string | null
          latitude: number | null
          longitude: number | null
          moderation_note: string | null
          name: string
          organization_id: string | null
          owner_id: string | null
          phone: string | null
          plan: string
          province: string | null
          slug: string
          status: string
          updated_at: string
          verified_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          category: string
          comune: string
          created_at?: string
          description?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          last_confirmed_at?: string | null
          latitude?: number | null
          longitude?: number | null
          moderation_note?: string | null
          name: string
          organization_id?: string | null
          owner_id?: string | null
          phone?: string | null
          plan?: string
          province?: string | null
          slug: string
          status?: string
          updated_at?: string
          verified_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          category?: string
          comune?: string
          created_at?: string
          description?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          last_confirmed_at?: string | null
          latitude?: number | null
          longitude?: number | null
          moderation_note?: string | null
          name?: string
          organization_id?: string | null
          owner_id?: string | null
          phone?: string | null
          plan?: string
          province?: string | null
          slug?: string
          status?: string
          updated_at?: string
          verified_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "terrain_places_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      territory_alerts: {
        Row: {
          alert_type: string | null
          archived_at: string | null
          assigned_to: string | null
          body: string
          category: string
          code: string
          comune: string
          contact_email: string | null
          created_at: string
          expires_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          moderation_note: string | null
          organization_id: string | null
          payload: Json
          province: string | null
          published_at: string | null
          reporter_id: string | null
          state: Database["public"]["Enums"]["alert_state"]
          status: string
          submitted_at: string | null
          title: string
          updated_at: string
        }
        Insert: {
          alert_type?: string | null
          archived_at?: string | null
          assigned_to?: string | null
          body: string
          category: string
          code: string
          comune: string
          contact_email?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          moderation_note?: string | null
          organization_id?: string | null
          payload?: Json
          province?: string | null
          published_at?: string | null
          reporter_id?: string | null
          state?: Database["public"]["Enums"]["alert_state"]
          status?: string
          submitted_at?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          alert_type?: string | null
          archived_at?: string | null
          assigned_to?: string | null
          body?: string
          category?: string
          code?: string
          comune?: string
          contact_email?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          moderation_note?: string | null
          organization_id?: string | null
          payload?: Json
          province?: string | null
          published_at?: string | null
          reporter_id?: string | null
          state?: Database["public"]["Enums"]["alert_state"]
          status?: string
          submitted_at?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "territory_alerts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          account_type: string
          completed_at: string | null
          created_at: string
          formats: string[]
          goal: string | null
          listen_moment: string | null
          notify_new_episodes: boolean
          provinces: string[]
          topics: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: string
          completed_at?: string | null
          created_at?: string
          formats?: string[]
          goal?: string | null
          listen_moment?: string | null
          notify_new_episodes?: boolean
          provinces?: string[]
          topics?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: string
          completed_at?: string | null
          created_at?: string
          formats?: string[]
          goal?: string | null
          listen_moment?: string | null
          notify_new_episodes?: boolean
          provinces?: string[]
          topics?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      verification_requests: {
        Row: {
          created_at: string
          id: string
          note: string | null
          outcome: Database["public"]["Enums"]["verification_outcome"]
          requested_by: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          subject_id: string
          subject_kind: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          outcome?: Database["public"]["Enums"]["verification_outcome"]
          requested_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          subject_id: string
          subject_kind: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          outcome?: Database["public"]["Enums"]["verification_outcome"]
          requested_by?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          subject_id?: string
          subject_kind?: string
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
      alert_state:
        | "draft"
        | "submitted"
        | "analyzing"
        | "needs_review"
        | "needs_information"
        | "approved"
        | "transformed"
        | "published"
        | "rejected"
        | "archived"
      app_role: "user" | "member" | "admin"
      content_kind:
        | "alert"
        | "place"
        | "job"
        | "event"
        | "news"
        | "radio_program"
        | "radio_episode"
        | "podcast"
        | "podcast_episode"
        | "organization"
        | "review"
      news_article_status:
        | "draft"
        | "review"
        | "scheduled"
        | "published"
        | "rejected"
      news_candidate_status:
        | "pending"
        | "scored"
        | "selected"
        | "rejected"
        | "duplicate"
      news_coverage_scope: "piemonte" | "italia" | "provincia" | "comune"
      news_source_type: "rss" | "api" | "institutional" | "html"
      news_verification_status:
        | "pending"
        | "verified"
        | "unverifiable"
        | "disputed"
      org_kind:
        | "azienda"
        | "associazione"
        | "ente"
        | "organizzatore"
        | "professionista"
        | "altro"
      org_member_role:
        | "owner"
        | "org_admin"
        | "editor"
        | "recruiter"
        | "events"
        | "analyst"
        | "viewer"
      org_status:
        | "draft"
        | "email_verification"
        | "org_verification"
        | "approved"
        | "limited"
        | "suspended"
        | "archived"
      review_state: "pending" | "approved" | "rejected" | "hidden"
      verification_outcome: "pending" | "approved" | "rejected" | "more_info"
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
      alert_state: [
        "draft",
        "submitted",
        "analyzing",
        "needs_review",
        "needs_information",
        "approved",
        "transformed",
        "published",
        "rejected",
        "archived",
      ],
      app_role: ["user", "member", "admin"],
      content_kind: [
        "alert",
        "place",
        "job",
        "event",
        "news",
        "radio_program",
        "radio_episode",
        "podcast",
        "podcast_episode",
        "organization",
        "review",
      ],
      news_article_status: [
        "draft",
        "review",
        "scheduled",
        "published",
        "rejected",
      ],
      news_candidate_status: [
        "pending",
        "scored",
        "selected",
        "rejected",
        "duplicate",
      ],
      news_coverage_scope: ["piemonte", "italia", "provincia", "comune"],
      news_source_type: ["rss", "api", "institutional", "html"],
      news_verification_status: [
        "pending",
        "verified",
        "unverifiable",
        "disputed",
      ],
      org_kind: [
        "azienda",
        "associazione",
        "ente",
        "organizzatore",
        "professionista",
        "altro",
      ],
      org_member_role: [
        "owner",
        "org_admin",
        "editor",
        "recruiter",
        "events",
        "analyst",
        "viewer",
      ],
      org_status: [
        "draft",
        "email_verification",
        "org_verification",
        "approved",
        "limited",
        "suspended",
        "archived",
      ],
      review_state: ["pending", "approved", "rejected", "hidden"],
      verification_outcome: ["pending", "approved", "rejected", "more_info"],
    },
  },
} as const
