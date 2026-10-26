-- New, isolated occurrence-level storage. This does NOT alter library_schedule.
create table if not exists public.library_attendance_records (
  week_start date not null,
  session_date date not null,
  slot_id text not null,
  teacher_name text not null,
  teacher_id text,
  grade text,
  subject text,
  status text not null default 'unmarked' check (status in ('attended','absent','unmarked')),
  recorded_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (session_date, slot_id),
  check (session_date between week_start and week_start + 4)
);
create table if not exists public.library_attendance_archives (
  week_start date primary key,
  archived_at timestamptz not null default now(),
  archived_by uuid not null
);
alter table public.library_attendance_records enable row level security;
alter table public.library_attendance_archives enable row level security;
revoke all on table public.library_attendance_records from public, anon, authenticated;
revoke all on table public.library_attendance_archives from public, anon, authenticated;
-- Deliberately no SELECT/INSERT/UPDATE/DELETE policies. The browser must call
-- the separately JWT-authenticated admin-only Edge Function. The service role
-- is server-side only. Neither table references, triggers nor changes the
-- teachers' recurring library_schedule table.
create index if not exists library_attendance_week_idx on public.library_attendance_records(week_start);
