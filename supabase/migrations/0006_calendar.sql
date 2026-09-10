create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  title text not null,
  description text,
  event_date date not null,
  event_time time,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists events_family_id_idx on public.events (family_id);
create index if not exists events_date_idx on public.events (event_date);

alter table public.events enable row level security;

drop policy if exists events_select on public.events;
create policy events_select on public.events
  for select using (public.is_family_member(family_id));

drop policy if exists events_insert on public.events;
create policy events_insert on public.events
  for insert with check (public.is_family_member(family_id));

drop policy if exists events_update on public.events;
create policy events_update on public.events
  for update using (public.is_family_member(family_id));

drop policy if exists events_delete on public.events;
create policy events_delete on public.events
  for delete using (public.is_family_member(family_id));
