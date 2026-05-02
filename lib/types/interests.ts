import type { PublicOwnerStats } from "@/lib/types/trade";

export type TradeInterestStatus =
  | "interested"
  | "consulting"
  | "dismissed"
  | "canceled"
  | "completion_requested"
  | "completed";

export type InterestTargetType = "offer" | "want";

export type TradeBottleSummary = {
  id: string;
  display_bottle_name: string | null;
  brand_name: string | null;
  country: string | null;
  distillery_name_ja: string | null;
  distillery_area: string | null;
  median_price: number | null;
  box_condition?: string | null;
  label_condition?: string | null;
  condition_note?: string | null;
  image_url?: string | null;
  note?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export type InterestCounterpartySummary = PublicOwnerStats & {
  display_name: string | null;
  x_id?: string | null;
};

export type TradeInterestListItem = {
  id: string;
  target_type: InterestTargetType;
  status: TradeInterestStatus;
  created_at: string;
  consulting_started_at: string | null;
  target_offer_item_id: string | null;
  target_want_item_id: string | null;
  proposed_offer_item_id: string;
  target: TradeBottleSummary | null;
  proposedOffer: TradeBottleSummary | null;
  counterparty: InterestCounterpartySummary | null;
};

export type TradeInterestDetailItem = TradeInterestListItem & {
  requester_user_id: string;
  receiver_user_id: string;
  requester_completed_at: string | null;
  receiver_completed_at: string | null;
  completed_at: string | null;
  canceled_at: string | null;
  dismissed_at: string | null;
  user_role: "requester" | "receiver";
  has_reviewed: boolean;
};
