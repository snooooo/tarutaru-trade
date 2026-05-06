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
      app_config: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      app_user_activity: {
        Row: {
          app: string
          last_active_at: string
          user_id: string
        }
        Insert: {
          app: string
          last_active_at?: string
          user_id: string
        }
        Update: {
          app?: string
          last_active_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      auction_price_data: {
        Row: {
          auction_end_date: string
          auction_id: string | null
          bottle_id: string | null
          box_status: string | null
          created_at: string | null
          id: string
          import_status: string | null
          item_title: string
          item_url: string | null
          label_status: string | null
          seller_id: string | null
          shipping_cost: number | null
          total_price: number
          volume_ml: number | null
          volume_ml_detected: number | null
          winning_price: number
        }
        Insert: {
          auction_end_date: string
          auction_id?: string | null
          bottle_id?: string | null
          box_status?: string | null
          created_at?: string | null
          id?: string
          import_status?: string | null
          item_title: string
          item_url?: string | null
          label_status?: string | null
          seller_id?: string | null
          shipping_cost?: number | null
          total_price: number
          volume_ml?: number | null
          volume_ml_detected?: number | null
          winning_price: number
        }
        Update: {
          auction_end_date?: string
          auction_id?: string | null
          bottle_id?: string | null
          box_status?: string | null
          created_at?: string | null
          id?: string
          import_status?: string | null
          item_title?: string
          item_url?: string | null
          label_status?: string | null
          seller_id?: string | null
          shipping_cost?: number | null
          total_price?: number
          volume_ml?: number | null
          volume_ml_detected?: number | null
          winning_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "auction_price_data_bottle_id_fkey"
            columns: ["bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
        ]
      }
      bottles: {
        Row: {
          abv: string | null
          age_statement: string | null
          bottle_name: string
          bottler_name: string | null
          brand_name: string | null
          category: string | null
          comment: string | null
          country: string | null
          created_at: string | null
          display_order: number | null
          distillery_id: string | null
          distillery_name_ja: string | null
          id: string
          manufacturer: string | null
          price: string | null
          updated_at: string | null
          url: string | null
          volume_ml: string | null
        }
        Insert: {
          abv?: string | null
          age_statement?: string | null
          bottle_name: string
          bottler_name?: string | null
          brand_name?: string | null
          category?: string | null
          comment?: string | null
          country?: string | null
          created_at?: string | null
          display_order?: number | null
          distillery_id?: string | null
          distillery_name_ja?: string | null
          id?: string
          manufacturer?: string | null
          price?: string | null
          updated_at?: string | null
          url?: string | null
          volume_ml?: string | null
        }
        Update: {
          abv?: string | null
          age_statement?: string | null
          bottle_name?: string
          bottler_name?: string | null
          brand_name?: string | null
          category?: string | null
          comment?: string | null
          country?: string | null
          created_at?: string | null
          display_order?: number | null
          distillery_id?: string | null
          distillery_name_ja?: string | null
          id?: string
          manufacturer?: string | null
          price?: string | null
          updated_at?: string | null
          url?: string | null
          volume_ml?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bottles_distillery_id_fkey"
            columns: ["distillery_id"]
            isOneToOne: false
            referencedRelation: "distilleries"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_distillery_assignments: {
        Row: {
          challenge_id: string
          created_at: string | null
          distillery_id: string
          id: string
          note: string | null
          sort_order: number | null
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          distillery_id: string
          id?: string
          note?: string | null
          sort_order?: number | null
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          distillery_id?: string
          id?: string
          note?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_distillery_assignments_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenge_distillery_assignments_distillery_id_fkey"
            columns: ["distillery_id"]
            isOneToOne: false
            referencedRelation: "distilleries"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          description: string | null
          id: string
          level: number
          name: string
        }
        Insert: {
          description?: string | null
          id: string
          level: number
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          level?: number
          name?: string
        }
        Relationships: []
      }
      contact_requests: {
        Row: {
          admin_notes: string | null
          id: string
          message: string
          processed_at: string | null
          status: string
          subject: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          id?: string
          message: string
          processed_at?: string | null
          status?: string
          subject: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          id?: string
          message?: string
          processed_at?: string | null
          status?: string
          subject?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      distilleries: {
        Row: {
          area: string | null
          country: string | null
          created_at: string | null
          description: string | null
          distillery_name_en: string | null
          distillery_name_ja: string
          game_100meijo: boolean | null
          game_100meijo_mini: boolean | null
          id: string
          image_license_code: string | null
          image_license_url: string | null
          image_source_url: string | null
          image_url: string | null
          latitude: number | null
          longitude: number | null
          tours_available: string | null
          tours_info: string | null
          updated_at: string | null
        }
        Insert: {
          area?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          distillery_name_en?: string | null
          distillery_name_ja: string
          game_100meijo?: boolean | null
          game_100meijo_mini?: boolean | null
          id?: string
          image_license_code?: string | null
          image_license_url?: string | null
          image_source_url?: string | null
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          tours_available?: string | null
          tours_info?: string | null
          updated_at?: string | null
        }
        Update: {
          area?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          distillery_name_en?: string | null
          distillery_name_ja?: string
          game_100meijo?: boolean | null
          game_100meijo_mini?: boolean | null
          id?: string
          image_license_code?: string | null
          image_license_url?: string | null
          image_source_url?: string | null
          image_url?: string | null
          latitude?: number | null
          longitude?: number | null
          tours_available?: string | null
          tours_info?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      price_data: {
        Row: {
          availability: number | null
          bottle_id: string | null
          box_status: string | null
          catch_copy: string | null
          classification_summary: string | null
          created_at: string | null
          credit_card_flag: number | null
          display_order: number | null
          filter_status: string | null
          final_status: string | null
          gemini_filtered: boolean | null
          gemini_reason: string | null
          genre_id: number | null
          id: string
          image_url: string | null
          import_status: string | null
          is_best_price: boolean | null
          item_caption: string | null
          item_id: string
          item_name: string
          item_url: string | null
          keyword: string | null
          label_status: string | null
          ng_word_filtered: boolean | null
          ng_word_reason: string | null
          postage_flag: number | null
          price: number
          review_average: number | null
          review_count: number | null
          search_shipping_cost: number | null
          search_shipping_method: string | null
          search_shipping_text: string | null
          search_timestamp: string
          shipping_cost: number | null
          shop_code: string | null
          shop_name: string | null
          tax_flag: number | null
          total_price: number
          updated_at: string | null
          volume_ml: number | null
        }
        Insert: {
          availability?: number | null
          bottle_id?: string | null
          box_status?: string | null
          catch_copy?: string | null
          classification_summary?: string | null
          created_at?: string | null
          credit_card_flag?: number | null
          display_order?: number | null
          filter_status?: string | null
          final_status?: string | null
          gemini_filtered?: boolean | null
          gemini_reason?: string | null
          genre_id?: number | null
          id?: string
          image_url?: string | null
          import_status?: string | null
          is_best_price?: boolean | null
          item_caption?: string | null
          item_id: string
          item_name: string
          item_url?: string | null
          keyword?: string | null
          label_status?: string | null
          ng_word_filtered?: boolean | null
          ng_word_reason?: string | null
          postage_flag?: number | null
          price: number
          review_average?: number | null
          review_count?: number | null
          search_shipping_cost?: number | null
          search_shipping_method?: string | null
          search_shipping_text?: string | null
          search_timestamp: string
          shipping_cost?: number | null
          shop_code?: string | null
          shop_name?: string | null
          tax_flag?: number | null
          total_price: number
          updated_at?: string | null
          volume_ml?: number | null
        }
        Update: {
          availability?: number | null
          bottle_id?: string | null
          box_status?: string | null
          catch_copy?: string | null
          classification_summary?: string | null
          created_at?: string | null
          credit_card_flag?: number | null
          display_order?: number | null
          filter_status?: string | null
          final_status?: string | null
          gemini_filtered?: boolean | null
          gemini_reason?: string | null
          genre_id?: number | null
          id?: string
          image_url?: string | null
          import_status?: string | null
          is_best_price?: boolean | null
          item_caption?: string | null
          item_id?: string
          item_name?: string
          item_url?: string | null
          keyword?: string | null
          label_status?: string | null
          ng_word_filtered?: boolean | null
          ng_word_reason?: string | null
          postage_flag?: number | null
          price?: number
          review_average?: number | null
          review_count?: number | null
          search_shipping_cost?: number | null
          search_shipping_method?: string | null
          search_shipping_text?: string | null
          search_timestamp?: string
          shipping_cost?: number | null
          shop_code?: string | null
          shop_name?: string | null
          tax_flag?: number | null
          total_price?: number
          updated_at?: string | null
          volume_ml?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_data_bottle_id_fkey"
            columns: ["bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_posts: {
        Row: {
          additional_data: Json | null
          category: string | null
          content: string
          created_at: string | null
          id: number
          item_id: string | null
          item_name: string
          item_url: string
          keyword_matched: string | null
          platform: string
          price: number
          shipping_info: string | null
          shop_name: string | null
          source: string
          stock_status: string | null
          total_price: number | null
          tweet_id: string | null
          updated_at: string | null
          x_link: string | null
        }
        Insert: {
          additional_data?: Json | null
          category?: string | null
          content: string
          created_at?: string | null
          id?: number
          item_id?: string | null
          item_name: string
          item_url: string
          keyword_matched?: string | null
          platform: string
          price: number
          shipping_info?: string | null
          shop_name?: string | null
          source: string
          stock_status?: string | null
          total_price?: number | null
          tweet_id?: string | null
          updated_at?: string | null
          x_link?: string | null
        }
        Update: {
          additional_data?: Json | null
          category?: string | null
          content?: string
          created_at?: string | null
          id?: number
          item_id?: string | null
          item_name?: string
          item_url?: string
          keyword_matched?: string | null
          platform?: string
          price?: number
          shipping_info?: string | null
          shop_name?: string | null
          source?: string
          stock_status?: string | null
          total_price?: number | null
          tweet_id?: string | null
          updated_at?: string | null
          x_link?: string | null
        }
        Relationships: []
      }
      trade_interests: {
        Row: {
          canceled_at: string | null
          completed_at: string | null
          consulting_started_at: string | null
          created_at: string
          dismissed_at: string | null
          id: string
          proposed_offer_item_id: string | null
          proposed_offer_item_previous_status:
            | Database["public"]["Enums"]["trade_item_status"]
            | null
          receiver_completed_at: string | null
          receiver_user_id: string
          requester_completed_at: string | null
          requester_user_id: string
          status: Database["public"]["Enums"]["trade_interest_status"]
          target_offer_item_id: string | null
          target_offer_item_previous_status:
            | Database["public"]["Enums"]["trade_item_status"]
            | null
          target_trade_post_id: string | null
          target_trade_post_previous_status:
            | Database["public"]["Enums"]["trade_post_status"]
            | null
          target_type:
            | Database["public"]["Enums"]["trade_interest_target_type"]
            | null
          target_want_item_id: string | null
          target_want_item_previous_status:
            | Database["public"]["Enums"]["trade_item_status"]
            | null
          updated_at: string
        }
        Insert: {
          canceled_at?: string | null
          completed_at?: string | null
          consulting_started_at?: string | null
          created_at?: string
          dismissed_at?: string | null
          id?: string
          proposed_offer_item_id?: string | null
          proposed_offer_item_previous_status?:
            | Database["public"]["Enums"]["trade_item_status"]
            | null
          receiver_completed_at?: string | null
          receiver_user_id: string
          requester_completed_at?: string | null
          requester_user_id: string
          status?: Database["public"]["Enums"]["trade_interest_status"]
          target_offer_item_id?: string | null
          target_offer_item_previous_status?:
            | Database["public"]["Enums"]["trade_item_status"]
            | null
          target_trade_post_id?: string | null
          target_trade_post_previous_status?:
            | Database["public"]["Enums"]["trade_post_status"]
            | null
          target_type?:
            | Database["public"]["Enums"]["trade_interest_target_type"]
            | null
          target_want_item_id?: string | null
          target_want_item_previous_status?:
            | Database["public"]["Enums"]["trade_item_status"]
            | null
          updated_at?: string
        }
        Update: {
          canceled_at?: string | null
          completed_at?: string | null
          consulting_started_at?: string | null
          created_at?: string
          dismissed_at?: string | null
          id?: string
          proposed_offer_item_id?: string | null
          proposed_offer_item_previous_status?:
            | Database["public"]["Enums"]["trade_item_status"]
            | null
          receiver_completed_at?: string | null
          receiver_user_id?: string
          requester_completed_at?: string | null
          requester_user_id?: string
          status?: Database["public"]["Enums"]["trade_interest_status"]
          target_offer_item_id?: string | null
          target_offer_item_previous_status?:
            | Database["public"]["Enums"]["trade_item_status"]
            | null
          target_trade_post_id?: string | null
          target_trade_post_previous_status?:
            | Database["public"]["Enums"]["trade_post_status"]
            | null
          target_type?:
            | Database["public"]["Enums"]["trade_interest_target_type"]
            | null
          target_want_item_id?: string | null
          target_want_item_previous_status?:
            | Database["public"]["Enums"]["trade_item_status"]
            | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_interests_proposed_offer_item_id_fkey"
            columns: ["proposed_offer_item_id"]
            isOneToOne: false
            referencedRelation: "trade_offer_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_interests_proposed_offer_item_id_fkey"
            columns: ["proposed_offer_item_id"]
            isOneToOne: false
            referencedRelation: "trade_public_offer_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_interests_receiver_user_id_fkey"
            columns: ["receiver_user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trade_interests_requester_user_id_fkey"
            columns: ["requester_user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trade_interests_target_offer_item_id_fkey"
            columns: ["target_offer_item_id"]
            isOneToOne: false
            referencedRelation: "trade_offer_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_interests_target_offer_item_id_fkey"
            columns: ["target_offer_item_id"]
            isOneToOne: false
            referencedRelation: "trade_public_offer_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_interests_target_trade_post_id_fkey"
            columns: ["target_trade_post_id"]
            isOneToOne: false
            referencedRelation: "trade_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_interests_target_trade_post_id_fkey"
            columns: ["target_trade_post_id"]
            isOneToOne: false
            referencedRelation: "trade_public_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_interests_target_want_item_id_fkey"
            columns: ["target_want_item_id"]
            isOneToOne: false
            referencedRelation: "trade_public_want_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_interests_target_want_item_id_fkey"
            columns: ["target_want_item_id"]
            isOneToOne: false
            referencedRelation: "trade_want_items"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_offer_items: {
        Row: {
          box_condition: Database["public"]["Enums"]["trade_box_condition"]
          created_at: string
          id: string
          image_url: string | null
          label_condition: Database["public"]["Enums"]["trade_label_condition"]
          maltperi_bottle_id: string | null
          manual_bottle_name: string | null
          note: string | null
          sort_order: number
          status: Database["public"]["Enums"]["trade_item_status"]
          trade_post_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          box_condition: Database["public"]["Enums"]["trade_box_condition"]
          created_at?: string
          id?: string
          image_url?: string | null
          label_condition: Database["public"]["Enums"]["trade_label_condition"]
          maltperi_bottle_id?: string | null
          manual_bottle_name?: string | null
          note?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["trade_item_status"]
          trade_post_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          box_condition?: Database["public"]["Enums"]["trade_box_condition"]
          created_at?: string
          id?: string
          image_url?: string | null
          label_condition?: Database["public"]["Enums"]["trade_label_condition"]
          maltperi_bottle_id?: string | null
          manual_bottle_name?: string | null
          note?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["trade_item_status"]
          trade_post_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_offer_items_maltperi_bottle_id_fkey"
            columns: ["maltperi_bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_offer_items_trade_post_id_fkey"
            columns: ["trade_post_id"]
            isOneToOne: false
            referencedRelation: "trade_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_offer_items_trade_post_id_fkey"
            columns: ["trade_post_id"]
            isOneToOne: false
            referencedRelation: "trade_public_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_offer_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      trade_posts: {
        Row: {
          closed_at: string | null
          condition_note: string | null
          created_at: string
          id: string
          published_at: string | null
          status: Database["public"]["Enums"]["trade_post_status"]
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          closed_at?: string | null
          condition_note?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["trade_post_status"]
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          closed_at?: string | null
          condition_note?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["trade_post_status"]
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      trade_profiles: {
        Row: {
          anonymous_shipping_ok: boolean | null
          created_at: string
          deleted_at: string | null
          display_name: string
          is_suspended: boolean
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
          x_followers_range:
            | Database["public"]["Enums"]["trade_x_followers_range"]
            | null
          x_id: string | null
        }
        Insert: {
          anonymous_shipping_ok?: boolean | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string
          is_suspended?: boolean
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
          x_followers_range?:
            | Database["public"]["Enums"]["trade_x_followers_range"]
            | null
          x_id?: string | null
        }
        Update: {
          anonymous_shipping_ok?: boolean | null
          created_at?: string
          deleted_at?: string | null
          display_name?: string
          is_suspended?: boolean
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
          x_followers_range?:
            | Database["public"]["Enums"]["trade_x_followers_range"]
            | null
          x_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      trade_proposal_offer_items: {
        Row: {
          box_condition: Database["public"]["Enums"]["trade_box_condition"]
          created_at: string
          id: string
          image_url: string | null
          label_condition: Database["public"]["Enums"]["trade_label_condition"]
          maltperi_bottle_id: string | null
          manual_bottle_name: string | null
          note: string | null
          sort_order: number
          status: string
          trade_interest_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          box_condition?: Database["public"]["Enums"]["trade_box_condition"]
          created_at?: string
          id?: string
          image_url?: string | null
          label_condition?: Database["public"]["Enums"]["trade_label_condition"]
          maltperi_bottle_id?: string | null
          manual_bottle_name?: string | null
          note?: string | null
          sort_order?: number
          status?: string
          trade_interest_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          box_condition?: Database["public"]["Enums"]["trade_box_condition"]
          created_at?: string
          id?: string
          image_url?: string | null
          label_condition?: Database["public"]["Enums"]["trade_label_condition"]
          maltperi_bottle_id?: string | null
          manual_bottle_name?: string | null
          note?: string | null
          sort_order?: number
          status?: string
          trade_interest_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_proposal_offer_items_maltperi_bottle_id_fkey"
            columns: ["maltperi_bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_proposal_offer_items_trade_interest_id_fkey"
            columns: ["trade_interest_id"]
            isOneToOne: false
            referencedRelation: "trade_interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_proposal_offer_items_trade_interest_id_fkey"
            columns: ["trade_interest_id"]
            isOneToOne: false
            referencedRelation: "trade_visible_counterparty_profiles"
            referencedColumns: ["trade_interest_id"]
          },
          {
            foreignKeyName: "trade_proposal_offer_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      trade_reports: {
        Row: {
          admin_note: string | null
          created_at: string
          id: string
          reason: string | null
          reporter_user_id: string
          status: string
          trade_post_id: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          reporter_user_id: string
          status?: string
          trade_post_id: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          reporter_user_id?: string
          status?: string
          trade_post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_reports_reporter_user_id_fkey"
            columns: ["reporter_user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trade_reports_trade_post_id_fkey"
            columns: ["trade_post_id"]
            isOneToOne: false
            referencedRelation: "trade_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_reports_trade_post_id_fkey"
            columns: ["trade_post_id"]
            isOneToOne: false
            referencedRelation: "trade_public_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewee_user_id: string
          reviewer_user_id: string
          trade_interest_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewee_user_id: string
          reviewer_user_id: string
          trade_interest_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewee_user_id?: string
          reviewer_user_id?: string
          trade_interest_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_reviews_reviewee_user_id_fkey"
            columns: ["reviewee_user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trade_reviews_reviewer_user_id_fkey"
            columns: ["reviewer_user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trade_reviews_trade_interest_id_fkey"
            columns: ["trade_interest_id"]
            isOneToOne: false
            referencedRelation: "trade_interests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_reviews_trade_interest_id_fkey"
            columns: ["trade_interest_id"]
            isOneToOne: false
            referencedRelation: "trade_visible_counterparty_profiles"
            referencedColumns: ["trade_interest_id"]
          },
        ]
      }
      trade_want_items: {
        Row: {
          condition_note: string | null
          created_at: string
          id: string
          maltperi_bottle_id: string | null
          manual_bottle_name: string | null
          sort_order: number
          status: Database["public"]["Enums"]["trade_item_status"]
          trade_post_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          condition_note?: string | null
          created_at?: string
          id?: string
          maltperi_bottle_id?: string | null
          manual_bottle_name?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["trade_item_status"]
          trade_post_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          condition_note?: string | null
          created_at?: string
          id?: string
          maltperi_bottle_id?: string | null
          manual_bottle_name?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["trade_item_status"]
          trade_post_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trade_want_items_maltperi_bottle_id_fkey"
            columns: ["maltperi_bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_want_items_trade_post_id_fkey"
            columns: ["trade_post_id"]
            isOneToOne: false
            referencedRelation: "trade_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_want_items_trade_post_id_fkey"
            columns: ["trade_post_id"]
            isOneToOne: false
            referencedRelation: "trade_public_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_want_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_bottle_status: {
        Row: {
          bottle_id: string | null
          created_at: string | null
          id: string
          quantity_owned: number | null
          tasted: boolean | null
          updated_at: string | null
          user_bottle_id: string | null
          user_id: string
          user_memo: string | null
          user_price: number | null
          want_to_try: boolean | null
        }
        Insert: {
          bottle_id?: string | null
          created_at?: string | null
          id?: string
          quantity_owned?: number | null
          tasted?: boolean | null
          updated_at?: string | null
          user_bottle_id?: string | null
          user_id: string
          user_memo?: string | null
          user_price?: number | null
          want_to_try?: boolean | null
        }
        Update: {
          bottle_id?: string | null
          created_at?: string | null
          id?: string
          quantity_owned?: number | null
          tasted?: boolean | null
          updated_at?: string | null
          user_bottle_id?: string | null
          user_id?: string
          user_memo?: string | null
          user_price?: number | null
          want_to_try?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bottle_status_bottle_id_fkey"
            columns: ["bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bottle_status_user_bottle_id_fkey"
            columns: ["user_bottle_id"]
            isOneToOne: false
            referencedRelation: "user_bottles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_bottles: {
        Row: {
          abv: string | null
          age_statement: string | null
          area: string | null
          bottle_name: string
          bottler_name: string | null
          brand_name: string | null
          category: string | null
          comment: string | null
          country: string | null
          created_at: string | null
          distillery_id: string | null
          distillery_name_ja: string | null
          id: string
          manufacturer: string | null
          price: string | null
          updated_at: string | null
          url: string | null
          user_id: string
          volume_ml: string | null
        }
        Insert: {
          abv?: string | null
          age_statement?: string | null
          area?: string | null
          bottle_name: string
          bottler_name?: string | null
          brand_name?: string | null
          category?: string | null
          comment?: string | null
          country?: string | null
          created_at?: string | null
          distillery_id?: string | null
          distillery_name_ja?: string | null
          id?: string
          manufacturer?: string | null
          price?: string | null
          updated_at?: string | null
          url?: string | null
          user_id: string
          volume_ml?: string | null
        }
        Update: {
          abv?: string | null
          age_statement?: string | null
          area?: string | null
          bottle_name?: string
          bottler_name?: string | null
          brand_name?: string | null
          category?: string | null
          comment?: string | null
          country?: string | null
          created_at?: string | null
          distillery_id?: string | null
          distillery_name_ja?: string | null
          id?: string
          manufacturer?: string | null
          price?: string | null
          updated_at?: string | null
          url?: string | null
          user_id?: string
          volume_ml?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bottles_distillery_id_fkey"
            columns: ["distillery_id"]
            isOneToOne: false
            referencedRelation: "distilleries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bottles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          cleared_at: string | null
          id: string
          progress: number | null
          status: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          cleared_at?: string | null
          id: string
          progress?: number | null
          status: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          cleared_at?: string | null
          id?: string
          progress?: number | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_distillery_interactions: {
        Row: {
          bottle_owned: boolean
          bottle_tasted: boolean
          challenge_id: string | null
          created_at: string
          distillery_id: string
          id: string
          owned_at: string | null
          status: string | null
          tasted_at: string | null
          updated_at: string
          user_id: string
          visited: boolean
          visited_at: string | null
        }
        Insert: {
          bottle_owned?: boolean
          bottle_tasted?: boolean
          challenge_id?: string | null
          created_at?: string
          distillery_id: string
          id?: string
          owned_at?: string | null
          status?: string | null
          tasted_at?: string | null
          updated_at?: string
          user_id: string
          visited?: boolean
          visited_at?: string | null
        }
        Update: {
          bottle_owned?: boolean
          bottle_tasted?: boolean
          challenge_id?: string | null
          created_at?: string
          distillery_id?: string
          id?: string
          owned_at?: string | null
          status?: string | null
          tasted_at?: string | null
          updated_at?: string
          user_id?: string
          visited?: boolean
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_distillery_interactions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_distillery_interactions_distillery_id_fkey"
            columns: ["distillery_id"]
            isOneToOne: false
            referencedRelation: "distilleries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_distillery_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_distillery_notes: {
        Row: {
          created_at: string | null
          distillery_id: string
          id: string
          images: Json | null
          is_public: boolean | null
          note: string | null
          rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          distillery_id: string
          id?: string
          images?: Json | null
          is_public?: boolean | null
          note?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          distillery_id?: string
          id?: string
          images?: Json | null
          is_public?: boolean | null
          note?: string | null
          rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_distillery_notes_distillery_id_fkey"
            columns: ["distillery_id"]
            isOneToOne: false
            referencedRelation: "distilleries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_distillery_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      app_active_users: {
        Row: {
          email: string | null
          maltperi_last_active_at: string | null
          service_usage: string | null
          tarutaru_last_active_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
      trade_bottle_auction_price_stats: {
        Row: {
          bottle_id: string | null
          latest_auction_end_date: string | null
          max_price: number | null
          median_price: number | null
          min_price: number | null
          sample_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_price_data_bottle_id_fkey"
            columns: ["bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_public_offer_items: {
        Row: {
          bottle_name: string | null
          box_condition:
            | Database["public"]["Enums"]["trade_box_condition"]
            | null
          brand_name: string | null
          category: string | null
          country: string | null
          created_at: string | null
          display_bottle_name: string | null
          distillery_area: string | null
          distillery_id: string | null
          distillery_name_ja: string | null
          id: string | null
          image_url: string | null
          label_condition:
            | Database["public"]["Enums"]["trade_label_condition"]
            | null
          maltperi_bottle_id: string | null
          manual_bottle_name: string | null
          median_price: number | null
          note: string | null
          owner_anonymous_shipping_ok: boolean | null
          owner_average_rating: number | null
          owner_cancellation_rate: number | null
          owner_completed_count: number | null
          owner_display_name: string | null
          owner_review_count: number | null
          owner_x_followers_range:
            | Database["public"]["Enums"]["trade_x_followers_range"]
            | null
          price_sample_count: number | null
          profile_public_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bottles_distillery_id_fkey"
            columns: ["distillery_id"]
            isOneToOne: false
            referencedRelation: "distilleries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_offer_items_maltperi_bottle_id_fkey"
            columns: ["maltperi_bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_public_posts: {
        Row: {
          condition_note: string | null
          created_at: string | null
          id: string | null
          offer_items: Json | null
          owner_anonymous_shipping_ok: boolean | null
          owner_average_rating: number | null
          owner_cancellation_rate: number | null
          owner_completed_count: number | null
          owner_display_name: string | null
          owner_review_count: number | null
          owner_x_followers_range:
            | Database["public"]["Enums"]["trade_x_followers_range"]
            | null
          profile_public_id: string | null
          published_at: string | null
          search_text: string | null
          title: string | null
          want_items: Json | null
        }
        Relationships: []
      }
      trade_public_profile_stats: {
        Row: {
          anonymous_shipping_ok: boolean | null
          average_rating: number | null
          cancellation_rate: number | null
          completed_count: number | null
          display_name: string | null
          profile_public_id: string | null
          review_count: number | null
          x_followers_range:
            | Database["public"]["Enums"]["trade_x_followers_range"]
            | null
        }
        Relationships: []
      }
      trade_public_profile_stats_internal: {
        Row: {
          anonymous_shipping_ok: boolean | null
          average_rating: number | null
          cancellation_rate: number | null
          completed_count: number | null
          display_name: string | null
          profile_public_id: string | null
          review_count: number | null
          user_id: string | null
          x_followers_range:
            | Database["public"]["Enums"]["trade_x_followers_range"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "app_active_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      trade_public_want_items: {
        Row: {
          bottle_name: string | null
          brand_name: string | null
          category: string | null
          condition_note: string | null
          country: string | null
          created_at: string | null
          display_bottle_name: string | null
          distillery_area: string | null
          distillery_id: string | null
          distillery_name_ja: string | null
          id: string | null
          maltperi_bottle_id: string | null
          manual_bottle_name: string | null
          median_price: number | null
          owner_anonymous_shipping_ok: boolean | null
          owner_average_rating: number | null
          owner_cancellation_rate: number | null
          owner_completed_count: number | null
          owner_display_name: string | null
          owner_review_count: number | null
          owner_x_followers_range:
            | Database["public"]["Enums"]["trade_x_followers_range"]
            | null
          price_sample_count: number | null
          profile_public_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bottles_distillery_id_fkey"
            columns: ["distillery_id"]
            isOneToOne: false
            referencedRelation: "distilleries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trade_want_items_maltperi_bottle_id_fkey"
            columns: ["maltperi_bottle_id"]
            isOneToOne: false
            referencedRelation: "bottles"
            referencedColumns: ["id"]
          },
        ]
      }
      trade_visible_counterparty_profiles: {
        Row: {
          counterparty_anonymous_shipping_ok: boolean | null
          counterparty_average_rating: number | null
          counterparty_cancellation_rate: number | null
          counterparty_completed_count: number | null
          counterparty_display_name: string | null
          counterparty_profile_public_id: string | null
          counterparty_review_count: number | null
          counterparty_x_followers_range:
            | Database["public"]["Enums"]["trade_x_followers_range"]
            | null
          counterparty_x_id: string | null
          trade_interest_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_challenge_progress: {
        Args: { challenge_id: string; user_id: string }
        Returns: number
      }
      touch_app_active: { Args: { p_app: string }; Returns: undefined }
      trade_cancel_interest: {
        Args: { p_interest_id: string }
        Returns: undefined
      }
      trade_create_interest: {
        Args: {
          p_proposed_offer_item_id: string
          p_target_id: string
          p_target_type: Database["public"]["Enums"]["trade_interest_target_type"]
        }
        Returns: string
      }
      trade_create_post: {
        Args: {
          p_condition_note: string
          p_offer_items: Json
          p_title: string
          p_want_items?: Json
        }
        Returns: string
      }
      trade_create_post_interest:
        | {
            Args: {
              p_proposal_offer_items: Json
              p_target_trade_post_id: string
            }
            Returns: string
          }
        | {
            Args: {
              p_proposed_offer_item_id: string
              p_target_trade_post_id: string
            }
            Returns: string
          }
      trade_create_review: {
        Args: { p_comment?: string; p_interest_id: string; p_rating: number }
        Returns: string
      }
      trade_delete_account: { Args: never; Returns: Json }
      trade_dismiss_interest: {
        Args: { p_interest_id: string }
        Returns: undefined
      }
      trade_mark_completed: {
        Args: { p_interest_id: string }
        Returns: Database["public"]["Enums"]["trade_interest_status"]
      }
      trade_profile_is_complete: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      trade_profile_is_complete_internal: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      trade_start_consulting: {
        Args: { p_interest_id: string }
        Returns: undefined
      }
      update_bottles_display_order: { Args: never; Returns: undefined }
      update_challenge_progress: {
        Args: { challenge_id: string; user_id: string }
        Returns: boolean
      }
      update_distillery_visit_status: {
        Args: { p_distillery_id: string; p_user_id: string; p_visited: boolean }
        Returns: boolean
      }
    }
    Enums: {
      bottle_status: "not_tasted" | "tasted" | "owned" | "owned_and_tasted"
      bottle_status_enum: "not_tasted" | "tasted" | "owned" | "owned_and_tasted"
      country_enum:
        | "スコッチ"
        | "アイリッシュ"
        | "アメリカン"
        | "カナディアン"
        | "ジャパニーズ"
        | "その他"
      tours_availability_enum: "available" | "unavailable" | "N/A"
      trade_box_condition:
        | "with_box_good"
        | "with_box_minor_damage"
        | "with_box_damaged"
        | "no_box"
      trade_interest_status:
        | "interested"
        | "consulting"
        | "dismissed"
        | "canceled"
        | "completion_requested"
        | "completed"
      trade_interest_target_type: "offer" | "want"
      trade_item_status: "public" | "private" | "trading" | "closed"
      trade_label_condition: "good" | "minor_damage" | "damaged"
      trade_post_status: "public" | "private" | "consulting" | "closed"
      trade_x_followers_range: "under_100" | "100_499" | "500_999" | "1000_plus"
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
      bottle_status: ["not_tasted", "tasted", "owned", "owned_and_tasted"],
      bottle_status_enum: ["not_tasted", "tasted", "owned", "owned_and_tasted"],
      country_enum: [
        "スコッチ",
        "アイリッシュ",
        "アメリカン",
        "カナディアン",
        "ジャパニーズ",
        "その他",
      ],
      tours_availability_enum: ["available", "unavailable", "N/A"],
      trade_box_condition: [
        "with_box_good",
        "with_box_minor_damage",
        "with_box_damaged",
        "no_box",
      ],
      trade_interest_status: [
        "interested",
        "consulting",
        "dismissed",
        "canceled",
        "completion_requested",
        "completed",
      ],
      trade_interest_target_type: ["offer", "want"],
      trade_item_status: ["public", "private", "trading", "closed"],
      trade_label_condition: ["good", "minor_damage", "damaged"],
      trade_post_status: ["public", "private", "consulting", "closed"],
      trade_x_followers_range: ["under_100", "100_499", "500_999", "1000_plus"],
    },
  },
} as const
