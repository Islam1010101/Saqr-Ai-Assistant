-- Individual feature entitlements, separate from school role assignments.
-- Existing EFIPS account, student, teacher, schedule and book tables are UNCHANGED.
-- Only the verified Edge Function's service_role may read or write overrides.
create table if not exists public.efips_user_feature_overrides (
  email text not null,
  feature_key text not null,
  allowed boolean not null,
  updated_by text not null,
  updated_at timestamptz not null default now(),
  constraint efips_user_feature_overrides_pk primary key (email,feature_key),
  constraint efips_user_feature_email_chk check (email=lower(email) and email ~ '^[^@[:space:]]+@falcon-school[.]com$'),
  constraint efips_user_feature_key_chk check (
    feature_key in (
      'catalog','saqr_ai','digital_library','creators','suggestions','ielts',
      'saqr_learning','schedule','national_identity','passport',
      'emirati_language','heritage_detective','flag_glory','voice_union',
      'national_books','challenges','reading_quest','sort_library',
      'saqr_studio','podcast'
    )
  )
);
alter table public.efips_user_feature_overrides enable row level security;
revoke all on public.efips_user_feature_overrides from public, anon, authenticated;
grant select,insert,update,delete on public.efips_user_feature_overrides to service_role;
comment on table public.efips_user_feature_overrides is
  'Per-verified-school-email feature grants/denials. Service-only; NEVER used to assign school roles or admin rights.';
