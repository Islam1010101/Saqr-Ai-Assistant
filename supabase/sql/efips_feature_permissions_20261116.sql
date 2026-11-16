-- EFIPS individual, additive service overrides; no modification to login roles.
-- Only server-side verified school admins may change these values.
create table if not exists public.efips_feature_permissions (
  email text not null check (email = lower(email) and email ~ '^[^@[:space:]]+@falcon-school[.]com$'),
  feature_key text not null check (feature_key in (
    'catalog','digital_library','creators','national_identity','schedule',
    'saqr_learning','challenges','sort_library','studio','reading_quest','podcast'
  )),
  enabled boolean not null,
  updated_by text not null,
  updated_at timestamptz not null default now(),
  primary key (email, feature_key)
);
create index if not exists efips_feature_permissions_feature_idx
  on public.efips_feature_permissions (feature_key,enabled);
alter table public.efips_feature_permissions enable row level security;
revoke all on public.efips_feature_permissions from public,anon,authenticated;
grant select,insert,update,delete on public.efips_feature_permissions to service_role;

create table if not exists public.efips_feature_permissions_audit (
  id bigint generated always as identity primary key,
  email text not null,
  feature_key text not null,
  previous_state text not null,
  new_state text not null,
  changed_by text not null,
  changed_at timestamptz not null default now()
);
create index if not exists efips_feature_permissions_audit_email_time_idx
  on public.efips_feature_permissions_audit (email,changed_at desc);
alter table public.efips_feature_permissions_audit enable row level security;
revoke all on public.efips_feature_permissions_audit from public,anon,authenticated;
grant select,insert on public.efips_feature_permissions_audit to service_role;
grant usage,select on sequence public.efips_feature_permissions_audit_id_seq to service_role;
