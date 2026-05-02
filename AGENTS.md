<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Supabase Safety

TaruTaru Trade shares the same Supabase project with the MaltPeri app. Never run destructive database reset operations for this project.

Forbidden:

- `supabase db reset`
- `supabase db push`
- `drop schema public cascade`
- destructive full-database cleanup or mass deletion

Use reviewed additive migrations only. For remote/dev Supabase changes, take a schema backup first and apply a single reviewed SQL migration transactionally, matching the existing TaruTaru migration workflow.
