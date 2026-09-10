create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  species text,
  breed text,
  birth_date date,
  next_vet_date date,
  notes text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists pets_family_id_idx on public.pets (family_id);

alter table public.pets enable row level security;

drop policy if exists pets_select on public.pets;
create policy pets_select on public.pets
  for select using (public.is_family_member(family_id));

drop policy if exists pets_insert on public.pets;
create policy pets_insert on public.pets
  for insert with check (public.is_family_member(family_id));

drop policy if exists pets_update on public.pets;
create policy pets_update on public.pets
  for update using (public.is_family_member(family_id));

drop policy if exists pets_delete on public.pets;
create policy pets_delete on public.pets
  for delete using (public.is_family_member(family_id));
