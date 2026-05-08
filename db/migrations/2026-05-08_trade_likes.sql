-- migration: trade_likes (メルカリ風いいね機能)
-- 適用前にスキーマバックアップを取ること
--
-- 追加のみ。既存テーブル/ビューは変更しない。
--   * trade_likes テーブル新設
--   * RLS: 全員 SELECT 可、本人のみ INSERT/DELETE
--   * いいね数は select count(*) where trade_post_id = ... で算出
--     (ビュー trade_public_posts は変更せず、アプリ側で merge する方針)

begin;

create table if not exists public.trade_likes (
  user_id        uuid not null references auth.users(id) on delete cascade,
  trade_post_id  uuid not null references public.trade_posts(id) on delete cascade,
  created_at     timestamptz not null default now(),
  primary key (user_id, trade_post_id)
);

create index if not exists trade_likes_user_created_idx
  on public.trade_likes (user_id, created_at desc);

create index if not exists trade_likes_post_idx
  on public.trade_likes (trade_post_id);

alter table public.trade_likes enable row level security;

-- いいね数を全員に見せるため SELECT は誰でも可
drop policy if exists "trade_likes: select all" on public.trade_likes;
create policy "trade_likes: select all"
  on public.trade_likes
  for select
  using (true);

-- 自分のいいねのみ追加可能
drop policy if exists "trade_likes: insert own" on public.trade_likes;
create policy "trade_likes: insert own"
  on public.trade_likes
  for insert
  with check (auth.uid() = user_id);

-- 自分のいいねのみ削除可能
drop policy if exists "trade_likes: delete own" on public.trade_likes;
create policy "trade_likes: delete own"
  on public.trade_likes
  for delete
  using (auth.uid() = user_id);

grant select on public.trade_likes to anon, authenticated;
grant insert, delete on public.trade_likes to authenticated;

commit;
