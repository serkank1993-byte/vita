-- Evcil hayvan türlerini de Ayarlar'dan yönetilebilir yap; cins ve
-- mikroçip alanlarını kaldır (istenmedi).

create table if not exists public.pet_species (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  color text not null default 'vita'
    check (color in ('vita', 'pink', 'blue', 'amber', 'purple', 'emerald', 'red', 'gray')),
  created_at timestamptz not null default now(),
  unique (family_id, name)
);

create index if not exists pet_species_family_id_idx on public.pet_species (family_id);
alter table public.pet_species enable row level security;

drop policy if exists pet_species_select on public.pet_species;
create policy pet_species_select on public.pet_species
  for select using (public.is_family_member(family_id));
drop policy if exists pet_species_insert on public.pet_species;
create policy pet_species_insert on public.pet_species
  for insert with check (public.is_family_member(family_id));
drop policy if exists pet_species_update on public.pet_species;
create policy pet_species_update on public.pet_species
  for update using (public.is_family_member(family_id));
drop policy if exists pet_species_delete on public.pet_species;
create policy pet_species_delete on public.pet_species
  for delete using (public.is_family_member(family_id));

-- Var olan ailelere varsayılan tür seti (henüz hiç türü olmayanlara).
insert into public.pet_species (family_id, name, color)
select f.id, c.name, c.color
from public.families f
cross join (
  values ('Kedi', 'vita'), ('Köpek', 'amber'), ('Kuş', 'blue'), ('Balık', 'purple'), ('Diğer', 'gray')
) as c(name, color)
where not exists (select 1 from public.pet_species ps where ps.family_id = f.id);

-- Var olan serbest metin türleri eşleştir, kalanları yeni tür olarak oluştur.
insert into public.pet_species (family_id, name, color)
select distinct p.family_id, p.species, 'gray'
from public.pets p
where p.species is not null
  and not exists (
    select 1 from public.pet_species ps where ps.family_id = p.family_id and ps.name = p.species
  );

alter table public.pets add column if not exists species_id uuid references public.pet_species (id) on delete set null;

update public.pets p
set species_id = ps.id
from public.pet_species ps
where ps.family_id = p.family_id and ps.name = p.species and p.species_id is null;

alter table public.pets drop column if exists species;
alter table public.pets drop column if exists breed;
alter table public.pets drop column if exists microchip_number;

-- Yeni aile oluşturulunca varsayılan evcil hayvan türleri de eklensin.
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

  insert into public.pet_species (family_id, name, color)
  values
    (new_family_id, 'Kedi', 'vita'),
    (new_family_id, 'Köpek', 'amber'),
    (new_family_id, 'Kuş', 'blue'),
    (new_family_id, 'Balık', 'purple'),
    (new_family_id, 'Diğer', 'gray');

  return new_family_id;
end;
$$;
