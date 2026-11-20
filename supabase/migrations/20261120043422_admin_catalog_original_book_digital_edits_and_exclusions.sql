-- Admin catalog edits/exclusions; existing reader and login policies remain unchanged.
create table if not exists public.efips_admin_catalog_controls (
  library text not null check (library in ('physical','ar','en','national')),
  book_id text not null check (length(book_id) between 1 and 190),
  action text not null check (action in ('update','delete')),
  title text not null default '',
  author text not null default '',
  subject text not null default '',
  publisher text not null default '',
  bio text not null default '',
  summary text not null default '',
  book_url text not null default '',
  audio_url text not null default '',
  source_title text not null default '',
  source_author text not null default '',
  source_shelf integer,
  source_row integer,
  updated_at timestamptz not null default now(),
  primary key (library,book_id),
  constraint digital_only_update check (action='delete' or library <> 'physical')
);
alter table public.efips_admin_catalog_controls enable row level security;
drop policy if exists "Read published catalog book controls" on public.efips_admin_catalog_controls;
create policy "Read published catalog book controls"
  on public.efips_admin_catalog_controls
  for select to anon, authenticated using (true);
revoke all on public.efips_admin_catalog_controls from anon, authenticated;
grant select on public.efips_admin_catalog_controls to anon, authenticated;

alter table public.efips_admin_catalog_books
  add column if not exists publisher text not null default '',
  add column if not exists bio text not null default '';
grant select (publisher,bio) on public.efips_admin_catalog_books to anon, authenticated;
