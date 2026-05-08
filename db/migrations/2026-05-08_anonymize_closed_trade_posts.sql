-- migration: closed トレード投稿の匿名化
-- 適用前にスキーマバックアップを取ること
--
-- 変更点:
--   * trade_public_posts に status, closed_at を追加
--   * status='closed' のとき個人特定可能なフィールドと補足/検索テキストを NULL にマスク
--   * フィルタを status in ('public','closed') に変更（closed も一覧/詳細に出すが匿名化される）

begin;

drop view if exists public.trade_public_posts cascade;

create view public.trade_public_posts as
select
  p.id,
  p.status,
  p.closed_at,
  p.title,
  case when p.status = 'closed' then null else p.condition_note end as condition_note,
  p.created_at,
  p.published_at,
  case when p.status = 'closed' then null else stats.profile_public_id end as profile_public_id,
  case when p.status = 'closed' then null else stats.display_name end as owner_display_name,
  case when p.status = 'closed' then null else stats.x_followers_range end as owner_x_followers_range,
  case when p.status = 'closed' then null else stats.shipping_preference end as owner_shipping_preference,
  case when p.status = 'closed' then null else stats.shipping_region end as owner_shipping_region,
  case when p.status = 'closed' then null else stats.completed_count end as owner_completed_count,
  case when p.status = 'closed' then null else stats.review_count end as owner_review_count,
  case when p.status = 'closed' then null else stats.average_rating end as owner_average_rating,
  case when p.status = 'closed' then null else stats.cancellation_rate end as owner_cancellation_rate,
  offer_items.items as offer_items,
  coalesce(want_items.items, '[]'::jsonb) as want_items,
  case
    when p.status = 'closed' then null
    else concat_ws(
      ' ',
      p.title,
      p.condition_note,
      offer_items.search_text,
      want_items.search_text
    )
  end as search_text
from public.trade_posts p
join public.trade_public_profile_stats_internal stats on stats.user_id = p.user_id
join lateral (
  select jsonb_agg(
    jsonb_build_object(
      'id', oi.id,
      'maltperi_bottle_id', oi.maltperi_bottle_id,
      'manual_bottle_name', oi.manual_bottle_name,
      'display_bottle_name', coalesce(b.bottle_name, oi.manual_bottle_name),
      'bottle_name', b.bottle_name,
      'brand_name', b.brand_name,
      'country', b.country,
      'category', b.category,
      'distillery_name_ja', b.distillery_name_ja,
      'distillery_id', b.distillery_id,
      'distillery_area', d.area,
      'median_price', ps.median_price,
      'price_sample_count', ps.sample_count,
      'box_condition', oi.box_condition,
      'label_condition', oi.label_condition,
      'image_url', oi.image_url,
      'note', oi.note,
      'sort_order', oi.sort_order,
      'created_at', oi.created_at
    )
    order by oi.sort_order, oi.created_at
  ) as items,
  string_agg(
    concat_ws(' ', coalesce(b.bottle_name, oi.manual_bottle_name), b.brand_name, b.country, b.distillery_name_ja, d.area),
    ' '
  ) as search_text
  from public.trade_offer_items oi
  left join public.bottles b on b.id = oi.maltperi_bottle_id
  left join public.distilleries d on d.id = b.distillery_id
  left join public.trade_bottle_auction_price_stats ps on ps.bottle_id = oi.maltperi_bottle_id
  where oi.trade_post_id = p.id
    and oi.status = 'public'
) offer_items on offer_items.items is not null
left join lateral (
  select jsonb_agg(
    jsonb_build_object(
      'id', wi.id,
      'maltperi_bottle_id', wi.maltperi_bottle_id,
      'manual_bottle_name', wi.manual_bottle_name,
      'display_bottle_name', coalesce(b.bottle_name, wi.manual_bottle_name),
      'bottle_name', b.bottle_name,
      'brand_name', b.brand_name,
      'country', b.country,
      'category', b.category,
      'distillery_name_ja', b.distillery_name_ja,
      'distillery_id', b.distillery_id,
      'distillery_area', d.area,
      'median_price', ps.median_price,
      'price_sample_count', ps.sample_count,
      'condition_note', wi.condition_note,
      'sort_order', wi.sort_order,
      'created_at', wi.created_at
    )
    order by wi.sort_order, wi.created_at
  ) as items,
  string_agg(
    concat_ws(' ', coalesce(b.bottle_name, wi.manual_bottle_name), b.brand_name, b.country, b.distillery_name_ja, d.area),
    ' '
  ) as search_text
  from public.trade_want_items wi
  left join public.bottles b on b.id = wi.maltperi_bottle_id
  left join public.distilleries d on d.id = b.distillery_id
  left join public.trade_bottle_auction_price_stats ps on ps.bottle_id = wi.maltperi_bottle_id
  where wi.trade_post_id = p.id
    and wi.status = 'public'
) want_items on true
where p.status in ('public', 'closed');

grant select on public.trade_public_posts to anon, authenticated;

commit;
