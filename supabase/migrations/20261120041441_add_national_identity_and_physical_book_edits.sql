-- Add an explicit National Identity destination without changing existing book collections.
alter table public.efips_admin_catalog_books
 add column if not exists national_identity boolean not null default false;
grant select (national_identity) on public.efips_admin_catalog_books to anon, authenticated;

-- Admin-authorized, metadata-only overlays for existing physical books.
-- Public readers may only SELECT published bibliographic corrections.
create table if not exists public.efips_admin_physical_edits (
 catalog_id text primary key,
 title text not null check(length(btrim(title))>0 and length(title)<=240),
 author text not null check(length(btrim(author))>0 and length(author)<=200),
 isbn text not null default '' check(length(isbn)<=20),
 cabinet integer not null check(cabinet between 1 and 9999),
 shelf_row integer not null check(shelf_row between 1 and 9999),
 national_identity boolean not null default false,
 edited_at timestamptz not null default now()
);
alter table public.efips_admin_physical_edits enable row level security;
drop policy if exists "Read published physical catalog edits" on public.efips_admin_physical_edits;
create policy "Read published physical catalog edits" on public.efips_admin_physical_edits
 for select to anon, authenticated using(true);
revoke all on public.efips_admin_physical_edits from anon, authenticated;
grant select on public.efips_admin_physical_edits to anon, authenticated;
