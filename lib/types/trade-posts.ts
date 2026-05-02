import type { PublicOwnerStats } from "@/lib/types/trade";

export type TradePostStatus = "public" | "private" | "consulting" | "closed";

export type PublicTradePostOfferItem = {
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
  sort_order: number | null;
  created_at: string | null;
};

export type PublicTradePostWantItem = {
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
  sort_order: number | null;
  created_at: string | null;
};

export type PublicTradePost = PublicOwnerStats & {
  id: string;
  title: string | null;
  condition_note: string | null;
  created_at: string;
  published_at: string | null;
  offer_items: PublicTradePostOfferItem[];
  want_items: PublicTradePostWantItem[];
  search_text?: string | null;
};

export type MyTradePost = {
  id: string;
  title: string | null;
  condition_note: string | null;
  status: TradePostStatus;
  created_at: string;
  published_at: string | null;
  closed_at: string | null;
  offer_items: PublicTradePostOfferItem[];
  want_items: PublicTradePostWantItem[];
};
