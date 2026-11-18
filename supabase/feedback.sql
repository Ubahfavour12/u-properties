-- Visitor feedback for U-properties. Anyone can submit; nobody can read it through the public key.
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rating smallint check (rating between 1 and 5),
  message text not null check (char_length(message) between 1 and 2000),
  role text check (role in ('renter', 'buyer', 'agent', 'landlord', 'investor', 'other')),
  name text check (char_length(name) <= 100),
  contact text check (char_length(contact) <= 200),
  page text check (char_length(page) <= 300)
);

alter table public.feedback enable row level security;

-- Public visitors may only add feedback, never read, change or delete it.
drop policy if exists "anyone can submit feedback" on public.feedback;
create policy "anyone can submit feedback" on public.feedback
  for insert to anon, authenticated with check (true);

revoke all on public.feedback from anon, authenticated;
grant insert on public.feedback to anon, authenticated;
