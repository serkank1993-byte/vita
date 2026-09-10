-- Takvim kategorilerini sabit koddan veritabanına taşı; aile başına
-- özelleştirilebilir olsun (Ayarlar sayfasından yönetilecek).

create table if not exists public.calendar_categories (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  color text not null default 'vita'
    check (color in ('vita', 'pink', 'blue', 'amber', 'purple', 'emerald', 'red', 'gray')),
  created_at timestamptz not null default now(),
  unique (family_id, name)
);

create index if not exists calendar_categories_family_id_idx on public.calendar_categories (family_id);

alter table public.calendar_categories enable row level security;

drop policy if exists calendar_categories_select on public.calendar_categories;
create policy calendar_categories_select on public.calendar_categories
  for select using (public.is_family_member(family_id));

drop policy if exists calendar_categories_insert on public.calendar_categories;
create policy calendar_categories_insert on public.calendar_categories
  for insert with check (public.is_family_member(family_id));

drop policy if exists calendar_categories_update on public.calendar_categories;
create policy calendar_categories_update on public.calendar_categories
  for update using (public.is_family_member(family_id));

drop policy if exists calendar_categories_delete on public.calendar_categories;
create policy calendar_categories_delete on public.calendar_categories
  for delete using (public.is_family_member(family_id));

-- Var olan ailelere varsayılan kategori seti (henüz hiç kategorisi olmayanlara).
insert into public.calendar_categories (family_id, name, color)
select f.id, c.name, c.color
from public.families f
cross join (
  values
    ('Genel', 'vita'),
    ('Doğum günü', 'pink'),
    ('Randevu', 'blue'),
    ('Tatil', 'amber'),
    ('Hatırlatma', 'purple')
) as c(name, color)
where not exists (
  select 1 from public.calendar_categories cc where cc.family_id = f.id
);

-- events tablosuna kategori referansı ekle, eski sabit enum'u taşı, kaldır.
alter table public.events add column if not exists category_id uuid references public.calendar_categories (id) on delete set null;

update public.events e
set category_id = cc.id
from public.calendar_categories cc
where cc.family_id = e.family_id
  and cc.name = case e.category
    when 'general' then 'Genel'
    when 'birthday' then 'Doğum günü'
    when 'appointment' then 'Randevu'
    when 'holiday' then 'Tatil'
    when 'reminder' then 'Hatırlatma'
    else 'Genel'
  end
  and e.category_id is null;

alter table public.events drop column if exists category;

-- Yeni aile oluşturulunca varsayılan takvim kategorileri de otomatik eklensin.
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

  return new_family_id;
end;
$$;

-- Ayarlar sayfasından aile adı düzenlenebilsin.
drop policy if exists families_update on public.families;
create policy families_update on public.families
  for update using (public.is_family_member(id));
