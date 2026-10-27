create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  full_name text not null,
  organization text not null default '',
  email text not null,
  phone text not null default '',
  inquiry_type text not null,
  project_location text not null default '',
  budget text not null default '',
  timeline text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

revoke all on table public.inquiries from anon, authenticated;
