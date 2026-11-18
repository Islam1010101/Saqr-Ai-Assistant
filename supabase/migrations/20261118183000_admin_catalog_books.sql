-- Additive holdings; original catalogs and login/role policies remain unchanged.
create table if not exists public.efips_admin_catalog_books (
 id uuid primary key default gen_random_uuid(),
 kind text not null check(kind in ('physical','digital')),
 status text not null default 'approved' check(status in ('approved','pending')),
 language text not null check(language in ('ar','en')),
 title text not null check(length(btrim(title)) between 1 and 240),
 author text not null default '' check(length(author)<=200),
 isbn text not null default '' check(length(isbn)<=20),
 cabinet integer check(cabinet between 1 and 9999),
 shelf_row integer check(shelf_row between 1 and 9999),
 subject text not null default '' check(length(subject)<=160),
 book_url text not null default '' check(length(book_url)<=2000),
 audio_url text not null default '' check(length(audio_url)<=2000),
 summary text not null default '' check(length(summary)<=2000),
 source text not null default 'manual' check(source in ('manual','excel')),
 source_fingerprint text not null unique,
 review_note text not null default '',
 created_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 check(status='pending' or (length(btrim(author))>0 and
    ((kind='physical' and cabinet is not null and shelf_row is not null) or
     (kind='digital' and book_url like 'https://%')))),
 check((kind='physical' and book_url='' and audio_url='') or
       (kind='digital' and cabinet is null and shelf_row is null))
);
create index if not exists efips_admin_catalog_books_status_idx
 on public.efips_admin_catalog_books(status,kind,created_at desc);
alter table public.efips_admin_catalog_books enable row level security;
revoke all on public.efips_admin_catalog_books from anon,authenticated;
grant select on public.efips_admin_catalog_books to anon,authenticated;
drop policy if exists "Public reads approved holdings" on public.efips_admin_catalog_books;
create policy "Public reads approved holdings" on public.efips_admin_catalog_books for select
 to anon,authenticated using(status='approved');
drop policy if exists "Admin reviews pending holdings" on public.efips_admin_catalog_books;
create policy "Admin reviews pending holdings" on public.efips_admin_catalog_books for select
 to authenticated using((select efips_private.current_school_identity())->>'role'='admin');
-- Writing is possible only through the authenticated admin Edge Function/service role.
