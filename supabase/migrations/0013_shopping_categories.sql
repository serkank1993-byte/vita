-- Alışveriş kategorilerini de Takvim kategorileri gibi aile başına
-- yönetilebilir hale getir (Ayarlar sayfasından).

create table if not exists public.shopping_categories (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  color text not null default 'vita'
    check (color in ('vita', 'pink', 'blue', 'amber', 'purple', 'emerald', 'red', 'gray')),
  created_at timestamptz not null default now(),
  unique (family_id, name)
);

create index if not exists shopping_categories_family_id_idx on public.shopping_categories (family_id);

alter table public.shopping_categories enable row level security;

drop policy if exists shopping_categories_select on public.shopping_categories;
create policy shopping_categories_select on public.shopping_categories
  for select using (public.is_family_member(family_id));

drop policy if exists shopping_categories_insert on public.shopping_categories;
create policy shopping_categories_insert on public.shopping_categories
  for insert with check (public.is_family_member(family_id));

drop policy if exists shopping_categories_update on public.shopping_categories;
create policy shopping_categories_update on public.shopping_categories
  for update using (public.is_family_member(family_id));

drop policy if exists shopping_categories_delete on public.shopping_categories;
create policy shopping_categories_delete on public.shopping_categories
  for delete using (public.is_family_member(family_id));

-- Var olan ailelere varsayılan kategori seti (henüz hiç kategorisi olmayanlara).
insert into public.shopping_categories (family_id, name, color)
select f.id, c.name, c.color
from public.families f
cross join (
  values
    ('Market', 'vita'),
    ('Eczane', 'red'),
    ('Kırtasiye', 'blue'),
    ('Diğer', 'gray')
) as c(name, color)
where not exists (
  select 1 from public.shopping_categories sc where sc.family_id = f.id
);

-- Var olan serbest metin kategorilerini (varsa) eşleştir, kalanları yeni
-- kategori olarak oluştur, sonra eski text sütununu kaldır.
insert into public.shopping_categories (family_id, name, color)
select distinct si.family_id, si.category, 'gray'
from public.shopping_items si
where si.category is not null
  and not exists (
    select 1 from public.shopping_categories sc
    where sc.family_id = si.family_id and sc.name = si.category
  );

alter table public.shopping_items add column if not exists category_id uuid references public.shopping_categories (id) on delete set null;

update public.shopping_items si
set category_id = sc.id
from public.shopping_categories sc
where sc.family_id = si.family_id
  and sc.name = si.category
  and si.category_id is null;

alter table public.shopping_items drop column if exists category;

-- Yeni aile oluşturulunca varsayılan alışveriş kategorileri de eklensin.
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

  return new_family_id;
end;
$$;
