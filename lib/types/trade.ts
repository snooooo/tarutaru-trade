import type { ShippingPreference } from "@/lib/types/profile";

export type PublicOwnerStats = {
  profile_public_id: string | null;
  owner_display_name: string | null;
  owner_x_followers_range: string | null;
  owner_shipping_preference: ShippingPreference | null;
  owner_shipping_region: string | null;
  owner_completed_count: number | null;
  owner_review_count: number | null;
  owner_average_rating: number | null;
  owner_cancellation_rate: number | null;
};

export type PublicOfferItem = PublicOwnerStats & {
  id: string;
  maltperi_bottle_id: string | null;
  manual_bottle_name: string | null;
  display_bottle_name: string | null;
  bottle_name: string | null;
  brand_name: string | null;
  country: string | null;
  category: string | null;
  distillery_name_ja: string | null;
  distillery_id: string | null;
  distillery_area: string | null;
  median_price: number | null;
  price_sample_count: number | null;
  box_condition: string | null;
  label_condition: string | null;
  image_url: string | null;
  note: string | null;
  created_at: string;
};

export type PublicWantItem = PublicOwnerStats & {
  id: string;
  maltperi_bottle_id: string | null;
  manual_bottle_name: string | null;
  display_bottle_name: string | null;
  bottle_name: string | null;
  brand_name: string | null;
  country: string | null;
  category: string | null;
  distillery_name_ja: string | null;
  distillery_id: string | null;
  distillery_area: string | null;
  median_price: number | null;
  price_sample_count: number | null;
  condition_note: string | null;
  created_at: string;
};
