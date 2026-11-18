-- Visitor feedback for U-properties (lives in the marketing-platform project for now). Anyone can submit; nobody can read it through the public key.
create table if not exists public.up_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rating smallint check (rating between 1 and 5),
  message text not null check (char_length(message) between 1 and 2000),
  role text check (role in ('renter', 'buyer', 'agent', 'landlord', 'investor', 'other')),
  name text check (char_length(name) <= 100),
  contact text check (char_length(contact) <= 200),
  page text check (char_length(page) <= 300)
);

alter table public.up_feedback enable row level security;

-- Public visitors may only add feedback, never read, change or delete it.
drop policy if exists "anyone can submit feedback" on public.up_feedback;
create policy "anyone can submit feedback" on public.up_feedback
  for insert to anon, authenticated with check (true);

revoke all on public.up_feedback from anon, authenticated;
grant insert on public.up_feedback to anon, authenticated;
