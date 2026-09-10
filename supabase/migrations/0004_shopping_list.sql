create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  quantity text,
  category text,
  is_bought boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists shopping_items_family_id_idx on public.shopping_items (family_id);

alter table public.shopping_items enable row level security;

drop policy if exists shopping_items_select on public.shopping_items;
create policy shopping_items_select on public.shopping_items
  for select using (public.is_family_member(family_id));

drop policy if exists shopping_items_insert on public.shopping_items;
create policy shopping_items_insert on public.shopping_items
  for insert with check (public.is_family_member(family_id));

drop policy if exists shopping_items_update on public.shopping_items;
create policy shopping_items_update on public.shopping_items
  for update using (public.is_family_member(family_id));

drop policy if exists shopping_items_delete on public.shopping_items;
create policy shopping_items_delete on public.shopping_items
  for delete using (public.is_family_member(family_id));
