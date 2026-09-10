-- Vita: aile bazlı çoklu kiracılık (multi-tenant) temel şeması
-- Her aile kendi verisini görür; RLS ile aileler arası izolasyon sağlanır.

create extension if not exists pgcrypto;

-- Profiles: her auth kullanıcısı için ek bilgiler
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

-- Families: her aile bir kiracı (tenant)
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text not null unique,
  created_at timestamptz not null default now()
);

-- Family members: kullanıcı-aile ilişkisi (bir kullanıcı birden fazla aileye üye olabilir)
create table if not exists public.family_members (
  family_id uuid not null references public.families (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (family_id, user_id)
);

-- Todos: ilk modül
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  title text not null,
  is_done boolean not null default false,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists todos_family_id_idx on public.todos (family_id);
create index if not exists family_members_user_id_idx on public.family_members (user_id);

-- Yeni auth kullanıcısı için otomatik profil oluşturma
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Bir kullanıcının bir ailenin üyesi olup olmadığını kontrol eden yardımcı fonksiyon.
-- security definer olduğu için RLS'te dairesel referans (recursion) sorunu yaratmaz.
create or replace function public.is_family_member(fid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members fm
    where fm.family_id = fid
      and fm.user_id = auth.uid()
  );
$$;

-- Yeni aile oluşturma: aile kaydını ve ilk üyeliği (owner) tek işlemde yapar.
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

  return new_family_id;
end;
$$;

-- Davet koduyla mevcut bir aileye katılma.
create or replace function public.join_family(code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_family_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Oturum açmanız gerekiyor';
  end if;

  select id into target_family_id
  from public.families
  where invite_code = upper(code);

  if target_family_id is null then
    raise exception 'Geçersiz davet kodu';
  end if;

  insert into public.family_members (family_id, user_id, role)
  values (target_family_id, auth.uid(), 'member')
  on conflict (family_id, user_id) do nothing;

  return target_family_id;
end;
$$;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.todos enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid());

drop policy if exists families_select on public.families;
create policy families_select on public.families
  for select using (public.is_family_member(id));

drop policy if exists family_members_select on public.family_members;
create policy family_members_select on public.family_members
  for select using (public.is_family_member(family_id));

drop policy if exists family_members_delete_self on public.family_members;
create policy family_members_delete_self on public.family_members
  for delete using (user_id = auth.uid());

drop policy if exists todos_select on public.todos;
create policy todos_select on public.todos
  for select using (public.is_family_member(family_id));

drop policy if exists todos_insert on public.todos;
create policy todos_insert on public.todos
  for insert with check (public.is_family_member(family_id));

drop policy if exists todos_update on public.todos;
create policy todos_update on public.todos
  for update using (public.is_family_member(family_id));

drop policy if exists todos_delete on public.todos;
create policy todos_delete on public.todos
  for delete using (public.is_family_member(family_id));
