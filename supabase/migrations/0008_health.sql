create table if not exists public.health_records (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  person_id uuid references auth.users (id) on delete set null,
  title text not null,
  record_date date not null default current_date,
  next_date date,
  note text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists health_records_family_id_idx on public.health_records (family_id);

alter table public.health_records enable row level security;

drop policy if exists health_records_select on public.health_records;
create policy health_records_select on public.health_records
  for select using (public.is_family_member(family_id));

drop policy if exists health_records_insert on public.health_records;
create policy health_records_insert on public.health_records
  for insert with check (public.is_family_member(family_id));

drop policy if exists health_records_update on public.health_records;
create policy health_records_update on public.health_records
  for update using (public.is_family_member(family_id));

drop policy if exists health_records_delete on public.health_records;
create policy health_records_delete on public.health_records
  for delete using (public.is_family_member(family_id));
