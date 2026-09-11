-- Envanter kategorileri
create table if not exists public.inventory_categories (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  color text not null default 'vita'
    check (color in ('vita', 'pink', 'blue', 'amber', 'purple', 'emerald', 'red', 'gray')),
  created_at timestamptz not null default now(),
  unique (family_id, name)
);

create index if not exists inventory_categories_family_id_idx on public.inventory_categories (family_id);
alter table public.inventory_categories enable row level security;

drop policy if exists inventory_categories_select on public.inventory_categories;
create policy inventory_categories_select on public.inventory_categories
  for select using (public.is_family_member(family_id));
drop policy if exists inventory_categories_insert on public.inventory_categories;
create policy inventory_categories_insert on public.inventory_categories
  for insert with check (public.is_family_member(family_id));
drop policy if exists inventory_categories_update on public.inventory_categories;
create policy inventory_categories_update on public.inventory_categories
  for update using (public.is_family_member(family_id));
drop policy if exists inventory_categories_delete on public.inventory_categories;
create policy inventory_categories_delete on public.inventory_categories
  for delete using (public.is_family_member(family_id));

-- Envanter konumları
create table if not exists public.inventory_locations (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  color text not null default 'gray'
    check (color in ('vita', 'pink', 'blue', 'amber', 'purple', 'emerald', 'red', 'gray')),
  created_at timestamptz not null default now(),
  unique (family_id, name)
);

create index if not exists inventory_locations_family_id_idx on public.inventory_locations (family_id);
alter table public.inventory_locations enable row level security;

drop policy if exists inventory_locations_select on public.inventory_locations;
create policy inventory_locations_select on public.inventory_locations
  for select using (public.is_family_member(family_id));
drop policy if exists inventory_locations_insert on public.inventory_locations;
create policy inventory_locations_insert on public.inventory_locations
  for insert with check (public.is_family_member(family_id));
drop policy if exists inventory_locations_update on public.inventory_locations;
create policy inventory_locations_update on public.inventory_locations
  for update using (public.is_family_member(family_id));
drop policy if exists inventory_locations_delete on public.inventory_locations;
create policy inventory_locations_delete on public.inventory_locations
  for delete using (public.is_family_member(family_id));

-- Dijital arşiv kategorileri
create table if not exists public.archive_categories (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  color text not null default 'vita'
    check (color in ('vita', 'pink', 'blue', 'amber', 'purple', 'emerald', 'red', 'gray')),
  created_at timestamptz not null default now(),
  unique (family_id, name)
);

create index if not exists archive_categories_family_id_idx on public.archive_categories (family_id);
alter table public.archive_categories enable row level security;

drop policy if exists archive_categories_select on public.archive_categories;
create policy archive_categories_select on public.archive_categories
  for select using (public.is_family_member(family_id));
drop policy if exists archive_categories_insert on public.archive_categories;
create policy archive_categories_insert on public.archive_categories
  for insert with check (public.is_family_member(family_id));
drop policy if exists archive_categories_update on public.archive_categories;
create policy archive_categories_update on public.archive_categories
  for update using (public.is_family_member(family_id));
drop policy if exists archive_categories_delete on public.archive_categories;
create policy archive_categories_delete on public.archive_categories
  for delete using (public.is_family_member(family_id));

-- Var olan ailelere varsayılan setler (henüz hiç kaydı olmayanlara).
insert into public.inventory_categories (family_id, name, color)
select f.id, c.name, c.color
from public.families f
cross join (values ('Elektronik', 'vita'), ('Mobilya', 'amber'), ('Diğer', 'gray')) as c(name, color)
where not exists (select 1 from public.inventory_categories ic where ic.family_id = f.id);

insert into public.inventory_locations (family_id, name, color)
select f.id, c.name, c.color
from public.families f
cross join (
  values ('Salon', 'vita'), ('Mutfak', 'amber'), ('Yatak Odası', 'blue'), ('Garaj', 'gray')
) as c(name, color)
where not exists (select 1 from public.inventory_locations il where il.family_id = f.id);

insert into public.archive_categories (family_id, name, color)
select f.id, c.name, c.color
from public.families f
cross join (
  values ('Kimlik', 'blue'), ('Fatura', 'amber'), ('Sözleşme', 'purple'), ('Sağlık', 'red'), ('Fotoğraf', 'pink'), ('Diğer', 'gray')
) as c(name, color)
where not exists (select 1 from public.archive_categories ac where ac.family_id = f.id);

-- inventory_items: serbest metin category/location -> yeni tablolara referans.
insert into public.inventory_categories (family_id, name, color)
select distinct ii.family_id, ii.category, 'gray'
from public.inventory_items ii
where ii.category is not null
  and not exists (
    select 1 from public.inventory_categories ic where ic.family_id = ii.family_id and ic.name = ii.category
  );

insert into public.inventory_locations (family_id, name, color)
select distinct ii.family_id, ii.location, 'gray'
from public.inventory_items ii
where ii.location is not null
  and not exists (
    select 1 from public.inventory_locations il where il.family_id = ii.family_id and il.name = ii.location
  );

alter table public.inventory_items add column if not exists category_id uuid references public.inventory_categories (id) on delete set null;
alter table public.inventory_items add column if not exists location_id uuid references public.inventory_locations (id) on delete set null;

update public.inventory_items ii
set category_id = ic.id
from public.inventory_categories ic
where ic.family_id = ii.family_id and ic.name = ii.category and ii.category_id is null;

update public.inventory_items ii
set location_id = il.id
from public.inventory_locations il
where il.family_id = ii.family_id and il.name = ii.location and ii.location_id is null;

alter table public.inventory_items drop column if exists category;
alter table public.inventory_items drop column if exists location;

-- archive_files: serbest metin category -> yeni tabloya referans.
insert into public.archive_categories (family_id, name, color)
select distinct af.family_id, af.category, 'gray'
from public.archive_files af
where af.category is not null
  and not exists (
    select 1 from public.archive_categories ac where ac.family_id = af.family_id and ac.name = af.category
  );

alter table public.archive_files add column if not exists category_id uuid references public.archive_categories (id) on delete set null;

update public.archive_files af
set category_id = ac.id
from public.archive_categories ac
where ac.family_id = af.family_id and ac.name = af.category and af.category_id is null;

alter table public.archive_files drop column if exists category;

-- Yeni aile oluşturulunca bu varsayılan setler de eklensin.
create or replace function public.create_family(family_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_family_id uuid;
  new_code text;
begin
  if auth.uid() is null then
    raise exception 'Oturum açmanız gerekiyor';
  end if;

  new_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.families (name, invite_code)
  values (family_name, new_code)
  returning id into new_family_id;

  insert into public.family_members (family_id, user_id, role)
  values (new_family_id, auth.uid(), 'owner');

  insert into public.calendar_categories (family_id, name, color)
  values
    (new_family_id, 'Genel', 'vita'),
    (new_family_id, 'Doğum günü', 'pink'),
    (new_family_id, 'Randevu', 'blue'),
    (new_family_id, 'Tatil', 'amber'),
    (new_family_id, 'Hatırlatma', 'purple');

  insert into public.shopping_categories (family_id, name, color)
  values
    (new_family_id, 'Market', 'vita'),
    (new_family_id, 'Eczane', 'red'),
    (new_family_id, 'Kırtasiye', 'blue'),
    (new_family_id, 'Diğer', 'gray');

  insert into public.inventory_categories (family_id, name, color)
  values
    (new_family_id, 'Elektronik', 'vita'),
    (new_family_id, 'Mobilya', 'amber'),
    (new_family_id, 'Diğer', 'gray');

  insert into public.inventory_locations (family_id, name, color)
  values
    (new_family_id, 'Salon', 'vita'),
    (new_family_id, 'Mutfak', 'amber'),
    (new_family_id, 'Yatak Odası', 'blue'),
    (new_family_id, 'Garaj', 'gray');

  insert into public.archive_categories (family_id, name, color)
  values
    (new_family_id, 'Kimlik', 'blue'),
    (new_family_id, 'Fatura', 'amber'),
    (new_family_id, 'Sözleşme', 'purple'),
    (new_family_id, 'Sağlık', 'red'),
    (new_family_id, 'Fotoğraf', 'pink'),
    (new_family_id, 'Diğer', 'gray');

  return new_family_id;
end;
$$;
