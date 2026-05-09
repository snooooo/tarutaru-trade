-- TaruTaru Trade: track administrator-hidden trade posts.
-- Additive only. Do not reset or rewrite existing shared Supabase data.

alter table public.trade_posts
  add column if not exists admin_hidden_at timestamptz,
  add column if not exists admin_hidden_by uuid references auth.users(id),
  add column if not exists admin_hidden_reason text;

create index if not exists trade_posts_admin_hidden_at_idx
  on public.trade_posts (admin_hidden_at)
  where admin_hidden_at is not null;
