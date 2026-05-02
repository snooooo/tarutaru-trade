# TaruTaru Trade

TaruTaru Trade is a whisky exchange posting app.

The core unit is an exchange post, not a standalone offer or wanted item.

- 出る: one or more bottle candidates
- 求む: one or more bottle candidates, or unspecified
- 補足条件: free-text trade conditions such as `どれか1本` or `まとめて希望`
- 匿名プロフィール
- 興味あり
- X ID reveal only after consultation starts

Public site:

- https://tarutaru-trade.netlify.app/

GitHub:

- https://github.com/snooooo/tarutaru-trade

## Stack

- Next.js App Router
- TypeScript
- React Server Components
- Server Actions
- Supabase Auth/Postgres/RLS
- Netlify

## Local Development

```sh
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Required `.env.local` values:

```sh
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The local values are intentionally not committed.

## Verification

Run these before pushing meaningful changes:

```sh
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment

Netlify deploys from:

```text
snooooo/tarutaru-trade main
```

Netlify environment variables must match `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

After deploy, smoke test:

- `/posts`
- `/login`
- `/mypage`
- `/mypage/posts/new`
- `/mypage/posts/[postId]/edit`
- `/posts/[postId]`
- `/posts/[postId]/interest`
- `/mypage/interests/received`
- `/trades/[interestId]`

## Shared Supabase Warning

TaruTaru Trade currently shares the `WhiskyMap` Supabase project with MaltPeri.

Do not run destructive database operations.

Forbidden:

- `supabase db reset`
- `supabase db push`
- `drop schema public cascade`
- `drop database`
- `truncate`
- mass deletion against shared tables

Use only reviewed additive migrations, with a schema backup first.

Operational details are in [OPERATIONS.md](./OPERATIONS.md).

## Migration Location

The shared Supabase migration files live in the MaltPeri repo:

```text
/Users/user/Documents/sushiworks/maltperi/the_whisky_app1/supabase/migrations
```

TaruTaru-related migration files:

```text
20260501232500_create_tarutaru_trade.sql
20260502033000_create_tarutaru_trade_posts.sql
20260502103000_create_tarutaru_trade_proposal_offer_items.sql
```

Safe apply scripts:

```text
/Users/user/Documents/sushiworks/maltperi/the_whisky_app1/scripts/apply_tarutaru_phase9_trade_posts.sh
/Users/user/Documents/sushiworks/maltperi/the_whisky_app1/scripts/apply_tarutaru_proposal_offer_items.sh
```

These scripts use direct `psql` application after backup. They do not use `db reset` or `db push`.

## Test Accounts

```text
A:
tarutaru.phase5.a.20260501174255@example.com

B:
tarutaru.phase5.b.20260501174255@example.com

Password:
TaruTaru-20260501174255!
```

Use A/B for interest and consultation lifecycle checks.

## Current Product Direction

Use exchange posts everywhere.

The old standalone `/offers` and `/wants` app code has been removed. Legacy URLs are redirected by `proxy.ts`:

- `/offers*` -> `/posts`
- `/wants*` -> `/posts`
- `/mypage/offers*` -> `/mypage/posts/new`
- `/mypage/wants*` -> `/mypage/posts/new`

Old database tables are intentionally not dropped because the Supabase project is shared.
