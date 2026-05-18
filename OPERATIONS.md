# TaruTaru Trade Operations

## Production

Production URL:

```text
https://tarutaru-trade.netlify.app/
```

Deployment:

```text
Netlify -> GitHub -> snooooo/tarutaru-trade -> main
```

GitHub repo:

```text
https://github.com/snooooo/tarutaru-trade
```

## Environment Variables

Required:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
TARUTARU_TRADE_APP_URL
```

`SUPABASE_SERVICE_ROLE_KEY` is used server-side only to look up the post owner's
Auth email address for interest notification emails. Never expose it with a
`NEXT_PUBLIC_` prefix.

## Supabase Ownership

Current Supabase project:

```text
WhiskyMap / vsynfvjstpgslfppbfuo
```

This project is shared with MaltPeri.

TaruTaru uses `trade_` tables/views/functions. MaltPeri app tables must not be modified as part of TaruTaru work unless explicitly planned.

## Database Safety Rules

Never run:

```sh
supabase db reset
supabase db push
```

Never run shared-project destructive operations:

```sql
drop schema public cascade;
drop database ...;
truncate ...;
delete from ...; -- without a narrow reviewed target
```

Allowed approach:

1. Create a reviewed additive migration SQL.
2. Search for dangerous DDL/DML.
3. Take a schema backup.
4. Apply the single SQL transaction with `psql`.
5. Run verification SQL or app smoke tests.
6. Commit the migration/script in the MaltPeri repo.

## Migration Repo

Shared Supabase migrations are tracked in:

```text
/Users/user/Documents/sushiworks/maltperi/the_whisky_app1
```

TaruTaru migrations currently tracked there:

```text
supabase/migrations/20260501232500_create_tarutaru_trade.sql
supabase/migrations/20260502033000_create_tarutaru_trade_posts.sql
supabase/migrations/20260502103000_create_tarutaru_trade_proposal_offer_items.sql
```

TaruTaru safe apply scripts:

```text
scripts/apply_tarutaru_phase9_trade_posts.sh
scripts/apply_tarutaru_proposal_offer_items.sh
```

Schema backups are local-only and ignored:

```text
backups/
```

## Dangerous SQL Search

Before applying a TaruTaru migration to the shared Supabase project:

```sh
rg -n "\\b(drop\\s+(table|schema|database|type)|truncate|delete\\s+from|alter\\s+table\\s+.*drop|db reset|db push)\\b" path/to/migration.sql
```

Expected hits should be only comments or safety checks. If executable SQL is matched, stop and review.

## App Verification

Run locally:

```sh
npm run lint
npx tsc --noEmit
npm run build
```

Smoke test locally or on Netlify:

- `/posts`
- `/mypage`
- create exchange post
- edit exchange post
- stop/reopen exchange post
- send interest
- received interest
- start consultation
- trade detail
- X ID hidden before consultation and visible after consultation

## Legacy Offer/Want Policy

The product no longer treats standalone offers or wants as the main concept.

Current concept:

```text
交換投稿
  出る: 1件以上
  求む: 1件以上または未指定
  補足条件
  匿名プロフィール
  興味あり
  相談開始後にX ID開示
```

Removed from the app:

- `/offers`
- `/wants`
- `/mypage/offers`
- `/mypage/wants`
- standalone offer/want forms
- standalone offer/want edit pages

Compatibility redirects are centralized in `proxy.ts`.

Do not reintroduce standalone offer/want UX unless the product direction changes explicitly.

## Test Accounts

```text
A:
tarutaru.phase5.a.20260501174255@example.com

B:
tarutaru.phase5.b.20260501174255@example.com

Password:
TaruTaru-20260501174255!
```

Use these for two-sided flow checks.

## Git Workflow

TaruTaru app repo:

```sh
cd /Users/user/Documents/sushiworks/whisky_trade/tarutaru-trade
git status --short
npm run lint
npx tsc --noEmit
npm run build
git add ...
git commit -m "..."
git push origin main
```

MaltPeri migration repo:

```sh
cd /Users/user/Documents/sushiworks/maltperi/the_whisky_app1
git status --short
```

Only stage TaruTaru migration/script files when working on TaruTaru. Do not stage unrelated MaltPeri app changes.

## Future DB Split

TaruTaru may later move to its own Supabase project.

Likely migration path:

1. Create a TaruTaru Supabase project.
2. Apply TaruTaru `trade_` migrations.
3. Export/import `trade_` data only if needed.
4. Recreate or re-register Auth users.
5. Change Netlify environment variables.
6. Smoke test.
7. Only after successful cutover, decide how to retire shared-project `trade_` data.

Do not drop shared-project `trade_` tables casually. Treat cleanup as a separate reviewed migration.
