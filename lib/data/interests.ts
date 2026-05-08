import { createServerSupabaseClient } from "@/lib/supabase/server";
import type {
  InterestCounterpartySummary,
  TradeBottleSummary,
  TradeInterestDetailItem,
  TradeInterestListItem,
  TradeInterestStatus,
} from "@/lib/types/interests";
import type { PublicTradePost, TradePostStatus } from "@/lib/types/trade-posts";
import type {
  PublicTradePostOfferItem,
  PublicTradePostWantItem,
} from "@/lib/types/trade-posts";
import type { PublicOfferItem, PublicWantItem } from "@/lib/types/trade";
import type { ShippingPreference } from "@/lib/types/profile";

type QueryResult<T> = {
  data: T[];
  error: string | null;
  isConfigured: boolean;
};

type OfferRow = {
  id: string;
  maltperi_bottle_id: string | null;
  manual_bottle_name: string | null;
  box_condition: string | null;
  label_condition: string | null;
  image_url: string | null;
  note: string | null;
  status: string | null;
  created_at: string | null;
};

type WantRow = {
  id: string;
  maltperi_bottle_id: string | null;
  manual_bottle_name: string | null;
  condition_note: string | null;
  status: string | null;
  created_at: string | null;
};

type BottleRow = {
  id: string;
  bottle_name: string;
  brand_name: string | null;
  country: string | null;
  distillery_name_ja: string | null;
};

type PriceStatsRow = {
  bottle_id: string | null;
  median_price: number | null;
};

type InterestRow = {
  id: string;
  requester_user_id: string;
  receiver_user_id: string;
  target_type: "offer" | "want" | null;
  status: TradeInterestStatus;
  created_at: string;
  consulting_started_at: string | null;
  canceled_at?: string | null;
  dismissed_at?: string | null;
  requester_completed_at?: string | null;
  receiver_completed_at?: string | null;
  completed_at?: string | null;
  target_offer_item_id: string | null;
  target_want_item_id: string | null;
  target_trade_post_id?: string | null;
  proposed_offer_item_id: string | null;
};

type ProposalOfferRow = OfferRow & {
  trade_interest_id: string;
  sort_order: number | null;
};

type RelatedPostRow = {
  id: string;
  title: string | null;
  condition_note: string | null;
  status: TradePostStatus;
  created_at: string;
  published_at: string | null;
  closed_at: string | null;
};

type RelatedPostOfferRow = OfferRow & {
  trade_post_id: string;
  sort_order: number | null;
};

type RelatedPostWantRow = WantRow & {
  trade_post_id: string;
  sort_order: number | null;
};

type VisibleCounterpartyRow = {
  trade_interest_id: string | null;
  counterparty_profile_public_id: string | null;
  counterparty_display_name: string | null;
  counterparty_x_followers_range: string | null;
  counterparty_shipping_preference: ShippingPreference | null;
  counterparty_shipping_region: string | null;
  counterparty_completed_count: number | null;
  counterparty_review_count: number | null;
  counterparty_average_rating: number | null;
  counterparty_cancellation_rate: number | null;
  counterparty_x_id?: string | null;
};

const interestSelect = [
  "id",
  "requester_user_id",
  "receiver_user_id",
  "target_type",
  "target_trade_post_id",
  "status",
  "created_at",
  "consulting_started_at",
  "target_offer_item_id",
  "target_want_item_id",
  "proposed_offer_item_id",
].join(",");

type LoosePostQuery = {
  select: (columns: string) => {
    in: (
      column: string,
      values: string[],
    ) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
  };
};

type LoosePublicPostSupabase = {
  from: (table: "trade_public_posts") => LoosePostQuery;
};

type LooseProposalQuery = {
  select: (columns: string) => {
    in: (
      column: string,
      values: string[],
    ) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
  };
};

type LooseProposalSupabase = {
  from: (table: "trade_proposal_offer_items") => LooseProposalQuery;
};

type LooseRelatedSupabase = {
  from: (table: string) => {
    select: (columns: string) => {
      in: (
        column: string,
        values: string[],
      ) => Promise<{ data: unknown[] | null; error: { message: string } | null }>;
    };
  };
};

function toOfferSummary(
  row: OfferRow,
  bottleMap: Map<string, BottleRow>,
  priceMap: Map<string, number | null>,
): TradeBottleSummary {
  const bottle = row.maltperi_bottle_id
    ? bottleMap.get(row.maltperi_bottle_id)
    : null;

  return {
    id: row.id,
    display_bottle_name: row.manual_bottle_name ?? bottle?.bottle_name ?? null,
    brand_name: bottle?.brand_name ?? null,
    country: bottle?.country ?? null,
    distillery_name_ja: bottle?.distillery_name_ja ?? null,
    distillery_area: null,
    median_price: row.maltperi_bottle_id
      ? (priceMap.get(row.maltperi_bottle_id) ?? null)
      : null,
    box_condition: row.box_condition,
    label_condition: row.label_condition,
    image_url: row.image_url,
    note: row.note,
    status: row.status,
    created_at: row.created_at,
  };
}

function toWantSummary(
  row: WantRow,
  bottleMap: Map<string, BottleRow>,
  priceMap: Map<string, number | null>,
): TradeBottleSummary {
  const bottle = row.maltperi_bottle_id
    ? bottleMap.get(row.maltperi_bottle_id)
    : null;

  return {
    id: row.id,
    display_bottle_name: row.manual_bottle_name ?? bottle?.bottle_name ?? null,
    brand_name: bottle?.brand_name ?? null,
    country: bottle?.country ?? null,
    distillery_name_ja: bottle?.distillery_name_ja ?? null,
    distillery_area: null,
    median_price: row.maltperi_bottle_id
      ? (priceMap.get(row.maltperi_bottle_id) ?? null)
      : null,
    condition_note: row.condition_note,
    status: row.status,
    created_at: row.created_at,
  };
}

function toPublicOfferSummary(row: PublicOfferItem): TradeBottleSummary {
  return {
    id: row.id,
    display_bottle_name: row.display_bottle_name,
    brand_name: row.brand_name,
    country: row.country,
    distillery_name_ja: row.distillery_name_ja,
    distillery_area: row.distillery_area,
    median_price: row.median_price,
    box_condition: row.box_condition,
    label_condition: row.label_condition,
    image_url: row.image_url,
    note: row.note,
    created_at: row.created_at,
  };
}

function toPublicWantSummary(row: PublicWantItem): TradeBottleSummary {
  return {
    id: row.id,
    display_bottle_name: row.display_bottle_name,
    brand_name: row.brand_name,
    country: row.country,
    distillery_name_ja: row.distillery_name_ja,
    distillery_area: row.distillery_area,
    median_price: row.median_price,
    condition_note: row.condition_note,
    created_at: row.created_at,
  };
}

function ownerStatsFromOffer(row: PublicOfferItem): InterestCounterpartySummary {
  return {
    profile_public_id: row.profile_public_id,
    display_name: row.owner_display_name,
    owner_display_name: row.owner_display_name,
    owner_x_followers_range: row.owner_x_followers_range,
    owner_shipping_preference: row.owner_shipping_preference,
    owner_shipping_region: row.owner_shipping_region ?? null,
    owner_completed_count: row.owner_completed_count,
    owner_review_count: row.owner_review_count,
    owner_average_rating: row.owner_average_rating,
    owner_cancellation_rate: row.owner_cancellation_rate,
  };
}

function ownerStatsFromWant(row: PublicWantItem): InterestCounterpartySummary {
  return {
    profile_public_id: row.profile_public_id,
    display_name: row.owner_display_name,
    owner_display_name: row.owner_display_name,
    owner_x_followers_range: row.owner_x_followers_range,
    owner_shipping_preference: row.owner_shipping_preference,
    owner_shipping_region: row.owner_shipping_region ?? null,
    owner_completed_count: row.owner_completed_count,
    owner_review_count: row.owner_review_count,
    owner_average_rating: row.owner_average_rating,
    owner_cancellation_rate: row.owner_cancellation_rate,
  };
}

function ownerStatsFromVisible(
  row: VisibleCounterpartyRow,
): InterestCounterpartySummary {
  return {
    profile_public_id: row.counterparty_profile_public_id,
    display_name: row.counterparty_display_name,
    owner_display_name: row.counterparty_display_name,
    owner_x_followers_range: row.counterparty_x_followers_range,
    owner_shipping_preference: row.counterparty_shipping_preference,
    owner_shipping_region: row.counterparty_shipping_region,
    owner_completed_count: row.counterparty_completed_count,
    owner_review_count: row.counterparty_review_count,
    owner_average_rating: row.counterparty_average_rating,
    owner_cancellation_rate: row.counterparty_cancellation_rate,
    x_id: row.counterparty_x_id ?? null,
  };
}

function ownerStatsFromPost(row: PublicTradePost): InterestCounterpartySummary {
  return {
    profile_public_id: row.profile_public_id,
    display_name: row.owner_display_name,
    owner_display_name: row.owner_display_name,
    owner_x_followers_range: row.owner_x_followers_range,
    owner_shipping_preference: row.owner_shipping_preference,
    owner_shipping_region: row.owner_shipping_region ?? null,
    owner_completed_count: row.owner_completed_count,
    owner_review_count: row.owner_review_count,
    owner_average_rating: row.owner_average_rating,
    owner_cancellation_rate: row.owner_cancellation_rate,
  };
}

function normalizePost(row: unknown): PublicTradePost {
  const post = row as PublicTradePost;

  return {
    ...post,
    offer_items: Array.isArray(post.offer_items) ? post.offer_items : [],
    want_items: Array.isArray(post.want_items) ? post.want_items : [],
  };
}

function toPostOfferItem(
  row: RelatedPostOfferRow,
  bottleMap: Map<string, BottleRow>,
  priceMap: Map<string, number | null>,
): PublicTradePostOfferItem {
  const bottle = row.maltperi_bottle_id
    ? bottleMap.get(row.maltperi_bottle_id)
    : null;

  return {
    id: row.id,
    maltperi_bottle_id: row.maltperi_bottle_id,
    manual_bottle_name: row.manual_bottle_name,
    display_bottle_name: row.manual_bottle_name ?? bottle?.bottle_name ?? null,
    bottle_name: bottle?.bottle_name ?? null,
    brand_name: bottle?.brand_name ?? null,
    country: bottle?.country ?? null,
    category: null,
    distillery_name_ja: bottle?.distillery_name_ja ?? null,
    distillery_id: null,
    distillery_area: null,
    median_price: row.maltperi_bottle_id
      ? (priceMap.get(row.maltperi_bottle_id) ?? null)
      : null,
    price_sample_count: null,
    box_condition: row.box_condition,
    label_condition: row.label_condition,
    image_url: row.image_url,
    note: row.note,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

function toPostWantItem(
  row: RelatedPostWantRow,
  bottleMap: Map<string, BottleRow>,
  priceMap: Map<string, number | null>,
): PublicTradePostWantItem {
  const bottle = row.maltperi_bottle_id
    ? bottleMap.get(row.maltperi_bottle_id)
    : null;

  return {
    id: row.id,
    maltperi_bottle_id: row.maltperi_bottle_id,
    manual_bottle_name: row.manual_bottle_name,
    display_bottle_name: row.manual_bottle_name ?? bottle?.bottle_name ?? null,
    bottle_name: bottle?.bottle_name ?? null,
    brand_name: bottle?.brand_name ?? null,
    country: bottle?.country ?? null,
    category: null,
    distillery_name_ja: bottle?.distillery_name_ja ?? null,
    distillery_id: null,
    distillery_area: null,
    median_price: row.maltperi_bottle_id
      ? (priceMap.get(row.maltperi_bottle_id) ?? null)
      : null,
    price_sample_count: null,
    condition_note: row.condition_note,
    sort_order: row.sort_order,
    created_at: row.created_at,
  };
}

async function hydrateRawItems(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  offerIds: string[],
  wantIds: string[],
) {
  const [offerResult, wantResult] = await Promise.all([
    offerIds.length
      ? supabase
          .from("trade_offer_items")
          .select(
            "id,maltperi_bottle_id,manual_bottle_name,box_condition,label_condition,image_url,note,status,created_at",
          )
          .in("id", offerIds)
      : Promise.resolve({ data: [], error: null }),
    wantIds.length
      ? supabase
          .from("trade_want_items")
          .select("id,maltperi_bottle_id,manual_bottle_name,condition_note,status,created_at")
          .in("id", wantIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const offerRows = (offerResult.data ?? []) as OfferRow[];
  const wantRows = (wantResult.data ?? []) as WantRow[];
  const bottleIds = Array.from(
    new Set(
      [...offerRows, ...wantRows]
        .map((row) => row.maltperi_bottle_id)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  const [bottleResult, priceResult] = await Promise.all([
    bottleIds.length
      ? supabase
          .from("bottles")
          .select("id,bottle_name,brand_name,country,distillery_name_ja")
          .in("id", bottleIds)
      : Promise.resolve({ data: [], error: null }),
    bottleIds.length
      ? supabase
          .from("trade_bottle_auction_price_stats")
          .select("bottle_id,median_price")
          .in("bottle_id", bottleIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const bottleMap = new Map(
    ((bottleResult.data ?? []) as BottleRow[]).map((row) => [row.id, row]),
  );
  const priceMap = new Map(
    ((priceResult.data ?? []) as PriceStatsRow[])
      .filter((row) => row.bottle_id)
      .map((row) => [row.bottle_id as string, row.median_price]),
  );

  return {
    offers: new Map(
      offerRows.map((row) => [row.id, toOfferSummary(row, bottleMap, priceMap)]),
    ),
    wants: new Map(
      wantRows.map((row) => [row.id, toWantSummary(row, bottleMap, priceMap)]),
    ),
    error:
      offerResult.error?.message ??
      wantResult.error?.message ??
      bottleResult.error?.message ??
      priceResult.error?.message ??
      null,
  };
}

async function getPublicMaps(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  offerIds: string[],
  wantIds: string[],
) {
  const [offerResult, wantResult] = await Promise.all([
    offerIds.length
      ? supabase.from("trade_public_offer_items").select("*").in("id", offerIds)
      : Promise.resolve({ data: [], error: null }),
    wantIds.length
      ? supabase.from("trade_public_want_items").select("*").in("id", wantIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const publicOffers = (offerResult.data ?? []) as PublicOfferItem[];
  const publicWants = (wantResult.data ?? []) as PublicWantItem[];

  return {
    offerSummaries: new Map(
      publicOffers.map((row) => [row.id, toPublicOfferSummary(row)]),
    ),
    wantSummaries: new Map(
      publicWants.map((row) => [row.id, toPublicWantSummary(row)]),
    ),
    offerOwners: new Map(publicOffers.map((row) => [row.id, ownerStatsFromOffer(row)])),
    wantOwners: new Map(publicWants.map((row) => [row.id, ownerStatsFromWant(row)])),
  };
}

async function getPublicPostMaps(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  postIds: string[],
) {
  if (!postIds.length) {
    return {
      posts: new Map<string, PublicTradePost>(),
      owners: new Map<string, InterestCounterpartySummary>(),
      error: null,
    };
  }

  const { data, error } = await (supabase as unknown as LoosePublicPostSupabase)
    .from("trade_public_posts")
    .select("*")
    .in("id", postIds);
  const posts = (data ?? []).map(normalizePost);

  return {
    posts: new Map(posts.map((post) => [post.id, post])),
    owners: new Map(posts.map((post) => [post.id, ownerStatsFromPost(post)])),
    error: error?.message ?? null,
  };
}

async function getRelatedPostMaps(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  postIds: string[],
) {
  if (!postIds.length) {
    return {
      posts: new Map<string, PublicTradePost>(),
      owners: new Map<string, InterestCounterpartySummary>(),
      error: null,
    };
  }

  const loose = supabase as unknown as LooseRelatedSupabase;
  const [postResult, offerResult, wantResult] = await Promise.all([
    loose
      .from("trade_posts")
      .select("id,title,condition_note,status,created_at,published_at,closed_at")
      .in("id", postIds),
    loose
      .from("trade_offer_items")
      .select(
        "id,trade_post_id,maltperi_bottle_id,manual_bottle_name,box_condition,label_condition,image_url,note,status,sort_order,created_at",
      )
      .in("trade_post_id", postIds),
    loose
      .from("trade_want_items")
      .select(
        "id,trade_post_id,maltperi_bottle_id,manual_bottle_name,condition_note,status,sort_order,created_at",
      )
      .in("trade_post_id", postIds),
  ]);
  const postRows = (postResult.data ?? []) as RelatedPostRow[];
  const offerRows = (offerResult.data ?? []) as RelatedPostOfferRow[];
  const wantRows = (wantResult.data ?? []) as RelatedPostWantRow[];
  const bottleIds = Array.from(
    new Set(
      [...offerRows, ...wantRows]
        .map((row) => row.maltperi_bottle_id)
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const [bottleResult, priceResult] = await Promise.all([
    bottleIds.length
      ? supabase
          .from("bottles")
          .select("id,bottle_name,brand_name,country,distillery_name_ja")
          .in("id", bottleIds)
      : Promise.resolve({ data: [], error: null }),
    bottleIds.length
      ? supabase
          .from("trade_bottle_auction_price_stats")
          .select("bottle_id,median_price")
          .in("bottle_id", bottleIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  const bottleMap = new Map(
    ((bottleResult.data ?? []) as BottleRow[]).map((row) => [row.id, row]),
  );
  const priceMap = new Map(
    ((priceResult.data ?? []) as PriceStatsRow[])
      .filter((row) => row.bottle_id)
      .map((row) => [row.bottle_id as string, row.median_price]),
  );
  const offersByPost = new Map<string, PublicTradePostOfferItem[]>();
  for (const row of offerRows) {
    const items = offersByPost.get(row.trade_post_id) ?? [];
    items.push(toPostOfferItem(row, bottleMap, priceMap));
    offersByPost.set(row.trade_post_id, items);
  }
  const wantsByPost = new Map<string, PublicTradePostWantItem[]>();
  for (const row of wantRows) {
    const items = wantsByPost.get(row.trade_post_id) ?? [];
    items.push(toPostWantItem(row, bottleMap, priceMap));
    wantsByPost.set(row.trade_post_id, items);
  }
  const posts = postRows.map((post) => ({
    id: post.id,
    status: post.status,
    title: post.title,
    condition_note: post.condition_note,
    created_at: post.created_at,
    published_at: post.published_at,
    closed_at: post.closed_at,
    profile_public_id: null,
    owner_display_name: null,
    owner_x_followers_range: null,
    owner_shipping_preference: null,
    owner_shipping_region: null,
    owner_completed_count: null,
    owner_review_count: null,
    owner_average_rating: null,
    owner_cancellation_rate: null,
    offer_items: (offersByPost.get(post.id) ?? []).sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    ),
    want_items: (wantsByPost.get(post.id) ?? []).sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    ),
  }));

  return {
    posts: new Map(posts.map((post) => [post.id, post])),
    owners: new Map(posts.map((post) => [post.id, ownerStatsFromPost(post)])),
    error:
      postResult.error?.message ??
      offerResult.error?.message ??
      wantResult.error?.message ??
      bottleResult.error?.message ??
      priceResult.error?.message ??
      null,
  };
}

async function getProposalOfferMaps(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  interestIds: string[],
) {
  if (!interestIds.length) {
    return {
      items: new Map<string, TradeBottleSummary[]>(),
      error: null,
    };
  }

  const { data, error } = await (supabase as unknown as LooseProposalSupabase)
    .from("trade_proposal_offer_items")
    .select(
      "id,trade_interest_id,maltperi_bottle_id,manual_bottle_name,box_condition,label_condition,image_url,note,status,sort_order,created_at",
    )
    .in("trade_interest_id", interestIds);
  const rows = (data ?? []) as ProposalOfferRow[];
  const bottleIds = Array.from(
    new Set(
      rows
        .map((row) => row.maltperi_bottle_id)
        .filter((id): id is string => Boolean(id)),
    ),
  );

  const [bottleResult, priceResult] = await Promise.all([
    bottleIds.length
      ? supabase
          .from("bottles")
          .select("id,bottle_name,brand_name,country,distillery_name_ja")
          .in("id", bottleIds)
      : Promise.resolve({ data: [], error: null }),
    bottleIds.length
      ? supabase
          .from("trade_bottle_auction_price_stats")
          .select("bottle_id,median_price")
          .in("bottle_id", bottleIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const bottleMap = new Map(
    ((bottleResult.data ?? []) as BottleRow[]).map((row) => [row.id, row]),
  );
  const priceMap = new Map(
    ((priceResult.data ?? []) as PriceStatsRow[])
      .filter((row) => row.bottle_id)
      .map((row) => [row.bottle_id as string, row.median_price]),
  );
  const items = new Map<string, TradeBottleSummary[]>();

  for (const row of rows.sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  )) {
    const current = items.get(row.trade_interest_id) ?? [];
    current.push(toOfferSummary(row, bottleMap, priceMap));
    items.set(row.trade_interest_id, current);
  }

  return {
    items,
    error:
      error?.message ??
      bottleResult.error?.message ??
      priceResult.error?.message ??
      null,
  };
}

async function buildInterestItems(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  rows: InterestRow[],
  direction: "sent" | "received",
): Promise<{ items: TradeInterestListItem[]; error: string | null }> {
  const offerIds = Array.from(
    new Set(
      rows
        .flatMap((row) => [row.target_offer_item_id, row.proposed_offer_item_id])
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const wantIds = Array.from(
    new Set(
      rows
        .map((row) => row.target_want_item_id)
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const postIds = Array.from(
    new Set(
      rows
        .map((row) => row.target_trade_post_id)
        .filter((id): id is string => Boolean(id)),
    ),
  );
  const interestIds = rows.map((row) => row.id);

  const [
    rawMaps,
    publicMaps,
    publicPostMaps,
    relatedPostMaps,
    proposalMaps,
    visibleResult,
  ] = await Promise.all([
    hydrateRawItems(supabase, offerIds, wantIds),
    getPublicMaps(supabase, offerIds, wantIds),
    getPublicPostMaps(supabase, postIds),
    getRelatedPostMaps(supabase, postIds),
    getProposalOfferMaps(supabase, interestIds),
    interestIds.length
      ? supabase
          .from("trade_visible_counterparty_profiles")
          .select("*")
          .in("trade_interest_id", interestIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const visibleMap = new Map(
    ((visibleResult.data ?? []) as VisibleCounterpartyRow[])
      .filter((row) => row.trade_interest_id)
      .map((row) => [row.trade_interest_id as string, ownerStatsFromVisible(row)]),
  );

  return {
    items: rows.map((row) => {
      const targetPost = row.target_trade_post_id
        ? (publicPostMaps.posts.get(row.target_trade_post_id) ??
          relatedPostMaps.posts.get(row.target_trade_post_id) ??
          null)
        : null;
      const target =
        targetPost
          ? null
          : row.target_type === "offer" && row.target_offer_item_id
          ? (publicMaps.offerSummaries.get(row.target_offer_item_id) ??
            rawMaps.offers.get(row.target_offer_item_id) ??
            null)
          : row.target_want_item_id
            ? (publicMaps.wantSummaries.get(row.target_want_item_id) ??
              rawMaps.wants.get(row.target_want_item_id) ??
              null)
            : null;
      const proposalOfferItems = proposalMaps.items.get(row.id) ?? [];
      const proposedOffer =
        proposalOfferItems[0] ??
        (row.proposed_offer_item_id
          ? (publicMaps.offerSummaries.get(row.proposed_offer_item_id) ??
            rawMaps.offers.get(row.proposed_offer_item_id) ??
            null)
          : null);

      const publicCounterparty =
        direction === "sent"
          ? row.target_trade_post_id
            ? (publicPostMaps.owners.get(row.target_trade_post_id) ??
              relatedPostMaps.owners.get(row.target_trade_post_id))
            : row.target_type === "offer" && row.target_offer_item_id
            ? publicMaps.offerOwners.get(row.target_offer_item_id)
            : row.target_want_item_id
              ? publicMaps.wantOwners.get(row.target_want_item_id)
              : null
          : row.proposed_offer_item_id
            ? publicMaps.offerOwners.get(row.proposed_offer_item_id)
            : null;

      return {
        ...row,
        targetPost,
        target,
        proposalOfferItems,
        proposedOffer,
        counterparty: visibleMap.get(row.id) ?? publicCounterparty ?? null,
      };
    }),
    error:
      rawMaps.error ??
      publicPostMaps.error ??
      relatedPostMaps.error ??
      proposalMaps.error ??
      visibleResult.error?.message ??
      null,
  };
}

export async function getMySelectableOfferItems(): Promise<
  QueryResult<TradeBottleSummary>
> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: [], error: userError?.message ?? null, isConfigured: true };
  }

  const { data, error } = await supabase
    .from("trade_offer_items")
    .select(
      "id,maltperi_bottle_id,manual_bottle_name,box_condition,label_condition,image_url,note,status,created_at",
    )
    .eq("user_id", user.id)
    .in("status", ["public", "private"])
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as OfferRow[];
  const hydrated = await hydrateRawItems(
    supabase,
    rows.map((row) => row.id),
    [],
  );

  return {
    data: rows
      .map((row) => hydrated.offers.get(row.id))
      .filter((item): item is TradeBottleSummary => Boolean(item)),
    error: error?.message ?? hydrated.error,
    isConfigured: true,
  };
}

export async function getMyOfferItems(): Promise<QueryResult<TradeBottleSummary>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: [], error: userError?.message ?? null, isConfigured: true };
  }

  const { data, error } = await supabase
    .from("trade_offer_items")
    .select(
      "id,maltperi_bottle_id,manual_bottle_name,box_condition,label_condition,image_url,note,status,created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as OfferRow[];
  const hydrated = await hydrateRawItems(
    supabase,
    rows.map((row) => row.id),
    [],
  );

  return {
    data: rows
      .map((row) => hydrated.offers.get(row.id))
      .filter((item): item is TradeBottleSummary => Boolean(item)),
    error: error?.message ?? hydrated.error,
    isConfigured: true,
  };
}

export async function getMyWantItems(): Promise<QueryResult<TradeBottleSummary>> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: [], error: userError?.message ?? null, isConfigured: true };
  }

  const { data, error } = await supabase
    .from("trade_want_items")
    .select("id,maltperi_bottle_id,manual_bottle_name,condition_note,status,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = (data ?? []) as WantRow[];
  const hydrated = await hydrateRawItems(
    supabase,
    [],
    rows.map((row) => row.id),
  );

  return {
    data: rows
      .map((row) => hydrated.wants.get(row.id))
      .filter((item): item is TradeBottleSummary => Boolean(item)),
    error: error?.message ?? hydrated.error,
    isConfigured: true,
  };
}

export async function getSentInterests(): Promise<
  QueryResult<TradeInterestListItem>
> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: [], error: userError?.message ?? null, isConfigured: true };
  }

  const { data, error } = await supabase
    .from("trade_interests")
    .select(interestSelect)
    .eq("requester_user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = ((data ?? []) as unknown) as InterestRow[];
  const built = await buildInterestItems(supabase, rows, "sent");

  return {
    data: built.items,
    error: error?.message ?? built.error,
    isConfigured: true,
  };
}

export async function getReceivedInterests(): Promise<
  QueryResult<TradeInterestListItem>
> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { data: [], error: null, isConfigured: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: [], error: userError?.message ?? null, isConfigured: true };
  }

  const { data, error } = await supabase
    .from("trade_interests")
    .select(interestSelect)
    .eq("receiver_user_id", user.id)
    .order("created_at", { ascending: false });

  const rows = ((data ?? []) as unknown) as InterestRow[];
  const built = await buildInterestItems(supabase, rows, "received");

  return {
    data: built.items,
    error: error?.message ?? built.error,
    isConfigured: true,
  };
}

export async function getPendingActionCount(): Promise<number> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return 0;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  const [received, inProgress] = await Promise.all([
    supabase
      .from("trade_interests")
      .select("id", { count: "exact", head: true })
      .eq("receiver_user_id", user.id)
      .eq("status", "interested"),
    supabase
      .from("trade_interests")
      .select("id", { count: "exact", head: true })
      .or(
        `receiver_user_id.eq.${user.id},requester_user_id.eq.${user.id}`,
      )
      .in("status", ["consulting", "completion_requested"]),
  ]);

  return (received.count ?? 0) + (inProgress.count ?? 0);
}

type DetailResult = {
  data: TradeInterestDetailItem | null;
  error: string | null;
  isConfigured: boolean;
};

export async function getTradeInterestDetail(
  interestId: string,
): Promise<DetailResult> {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { data: null, error: null, isConfigured: false };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: userError?.message ?? null, isConfigured: true };
  }

  const { data, error } = await supabase
    .from("trade_interests")
    .select(
      [
        interestSelect,
        "canceled_at",
        "dismissed_at",
        "requester_completed_at",
        "receiver_completed_at",
        "completed_at",
      ].join(","),
    )
    .eq("id", interestId)
    .single();

  if (error || !data) {
    return {
      data: null,
      error: error?.message ?? "取引が見つかりません。",
      isConfigured: true,
    };
  }

  const row = (data as unknown) as InterestRow;
  const userRole =
    row.requester_user_id === user.id
      ? "requester"
      : row.receiver_user_id === user.id
        ? "receiver"
        : null;

  if (!userRole) {
    return {
      data: null,
      error: "この取引を表示する権限がありません。",
      isConfigured: true,
    };
  }

  const [built, visibleResult, reviewResult] = await Promise.all([
    buildInterestItems(supabase, [row], userRole === "requester" ? "sent" : "received"),
    supabase
      .from("trade_visible_counterparty_profiles")
      .select("*")
      .eq("trade_interest_id", interestId)
      .maybeSingle(),
    supabase
      .from("trade_reviews")
      .select("id")
      .eq("trade_interest_id", interestId)
      .eq("reviewer_user_id", user.id)
      .maybeSingle(),
  ]);

  const item = built.items[0];

  if (!item) {
    return {
      data: null,
      error: built.error ?? "取引詳細を読み込めませんでした。",
      isConfigured: true,
    };
  }

  const visibleCounterparty = visibleResult.data
    ? ownerStatsFromVisible(visibleResult.data as VisibleCounterpartyRow)
    : null;

  return {
    data: {
      ...item,
      counterparty: visibleCounterparty ?? item.counterparty,
      requester_user_id: row.requester_user_id,
      receiver_user_id: row.receiver_user_id,
      requester_completed_at: row.requester_completed_at ?? null,
      receiver_completed_at: row.receiver_completed_at ?? null,
      completed_at: row.completed_at ?? null,
      canceled_at: row.canceled_at ?? null,
      dismissed_at: row.dismissed_at ?? null,
      user_role: userRole,
      has_reviewed: Boolean(reviewResult.data),
    },
    error:
      built.error ??
      visibleResult.error?.message ??
      (reviewResult.error && reviewResult.error.code !== "PGRST116"
        ? reviewResult.error.message
        : null),
    isConfigured: true,
  };
}
