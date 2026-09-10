-- Yapılacaklar'ı basit bir proje yönetimi kartına dönüştürmek için alanlar:
-- açıklama (detay), son tarih ve atanan kişi.

alter table public.todos
  add column if not exists description text,
  add column if not exists due_date date,
  add column if not exists assigned_to uuid references auth.users (id) on delete set null;

create index if not exists todos_assigned_to_idx on public.todos (assigned_to);

-- Bir kullanıcının, hedef kullanıcıyla en az bir ortak ailesi olup olmadığını
-- kontrol eden yardımcı fonksiyon (security definer, RLS'te recursion yaratmaz).
create or replace function public.shares_family_with(target_user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members fm1
    join public.family_members fm2 on fm1.family_id = fm2.family_id
    where fm1.user_id = auth.uid()
      and fm2.user_id = target_user_id
  );
$$;

revoke execute on function public.shares_family_with(uuid) from anon;

-- Aile üyeleri görevleri birbirine atayabilsin diye, aynı ailedeki
-- kullanıcıların profillerini (ad/e-posta) görebilmesi gerekiyor.
drop policy if exists profiles_select_family on public.profiles;
create policy profiles_select_family on public.profiles
  for select using (public.shares_family_with(id));
