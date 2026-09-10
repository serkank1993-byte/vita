create table if not exists public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  category text,
  location text,
  purchase_date date,
  warranty_until date,
  value numeric(12, 2),
  note text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists inventory_items_family_id_idx on public.inventory_items (family_id);

alter table public.inventory_items enable row level security;

drop policy if exists inventory_items_select on public.inventory_items;
create policy inventory_items_select on public.inventory_items
  for select using (public.is_family_member(family_id));

drop policy if exists inventory_items_insert on public.inventory_items;
create policy inventory_items_insert on public.inventory_items
  for insert with check (public.is_family_member(family_id));

drop policy if exists inventory_items_update on public.inventory_items;
create policy inventory_items_update on public.inventory_items
  for update using (public.is_family_member(family_id));

drop policy if exists inventory_items_delete on public.inventory_items;
create policy inventory_items_delete on public.inventory_items
  for delete using (public.is_family_member(family_id));
